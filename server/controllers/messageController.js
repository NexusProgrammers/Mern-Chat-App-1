import expressAsyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, Please Login",
      });
    }

    const token = authorizationHeader.split(" ")[1];
    
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("No token");
    }
  });
}

export const getMessages = expressAsyncHandler(async (req, res) => {
  const userData = await getUserDataFromRequest(req);

  const { userId } = req.params;

  const ourUserId = userData.user._id;

  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  });

  res.status(200).json(messages);
});

export const getOnlinePeople = expressAsyncHandler(async (req, res) => {
  const users = await User.find({}, { _id: 1, name: 1 });
  res.json(users);
});
