import express from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import dbConnect from "./config/dbConnect.js";
import helmet from "helmet";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Message from "./models/messageModel.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const app = express();

config();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(helmet());

app.use(cookieParser());

app.use(morgan("dev"));

const currentModuleUrl = import.meta.url;
const currentModulePath = fileURLToPath(currentModuleUrl);
const currentDirectory = dirname(currentModulePath);

app.use("/uploads", express.static(path.join(currentDirectory, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Your API",
  });
});

app.use("/api/v1/users", userRouter);

app.use("/api/v1/messages", messageRouter);

app.use(notFound);

app.use(errorHandler);

dbConnect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`);
});


const wss = new WebSocket("wss://mern-chat-app-1-server.vercel.app");

wss.on("connection", (connection, req) => {
  // getting user data from the cookie for this connection
  const notifyAboutOnlinePeople = () => {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            _id: c._id,
            name: c.name,
            email: c.email,
            image: c.image,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
          })),
        })
      );
    });
  };

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log("dead");
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, userData) => {
          if (err) throw err;
          const { _id, name, email, image, createdAt, updatedAt } =
            userData.user;
          connection._id = _id;
          connection.name = name;
          connection.email = email;
          connection.image = image;
          connection.createdAt = createdAt;
          connection.updatedAt = updatedAt;
        });
      }
    }
  }

  // send here message from one to another

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;
    if (file) {
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const filePath = path.join(currentDirectory, "uploads", filename);
      const bufferData = Buffer.from(file.data, "base64");
      fs.writeFile(filePath, bufferData, () => {
        Message.create({
          sender: connection._id,
          recipient,
          text,
          file: filename || null,
        }).then((messageDoc) => {
          [...wss.clients]
            .filter((c) => c._id === recipient)
            .forEach((c) =>
              c.send(
                JSON.stringify({
                  text,
                  sender: connection._id,
                  recipient,
                  _id: messageDoc._id,
                  file: filename,
                })
              )
            );
        });
      });
    } else if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection._id,
        recipient,
        text,
      });
      [...wss.clients]
        .filter((c) => c._id === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection._id,
              recipient,
              _id: messageDoc._id,
              file: filename,
            })
          )
        );
    }
  });

  // Online people when someone connects
  notifyAboutOnlinePeople();
});
