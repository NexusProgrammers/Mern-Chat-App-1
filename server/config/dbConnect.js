import mongoose from "mongoose";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.MONGO_URL;

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDb Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
