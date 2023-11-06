import { Router } from "express";
import {
  getOnlinePeople,
  getProfile,
  login,
  logout,
  register,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/logout", logout);

userRouter.get("/profile", getProfile);

userRouter.get("/get-online-people", getOnlinePeople);

export default userRouter;
