import { Router } from "express";
import {
  getMessages,
  getOnlinePeople,
} from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const messageRouter = Router();

messageRouter.get("/get-all/:userId", authMiddleware, getMessages);

messageRouter.get("/get-online-people", authMiddleware, getOnlinePeople);

export default messageRouter;
