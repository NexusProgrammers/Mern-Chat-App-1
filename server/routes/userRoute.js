import { Router } from "express";
import {
  getOnlinePeople,
  getProfile,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/logout", logout);

userRouter.get("/profile", authMiddleware, getProfile);

userRouter.get("/get-online-people", authMiddleware, getOnlinePeople);

export default userRouter;
