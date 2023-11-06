import { Router } from "express";
import {
  getMessages,
  getOnlinePeople,
} from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.get("/get-all/:userId", getMessages);

messageRouter.get("/get-online-people", getOnlinePeople);

export default messageRouter;
