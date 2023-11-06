import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};

export default generateToken;
