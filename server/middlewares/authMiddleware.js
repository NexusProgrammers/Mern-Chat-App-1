import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, Please Login",
    });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, No Token",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(verified.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
});

export default authMiddleware;
