import mongoose from "mongoose";
import {customLog} from "../utility/common"
const connectDB = async () => {
    const uri: string = process.env.MONGO_URI || "";
    mongoose.connection.on('open', () => customLog("MongoDB connection opened."));
    mongoose.connection.on('disconnected', () => customLog("MongoDB connection disconnected."));
    mongoose.connection.on('reconnected', () => customLog("MongoDB reconnected."));
    mongoose.connection.on('disconnecting', () => customLog("MongoDB disconnecting..."));
    mongoose.connection.on('close', () => customLog("MongoDB connection closed."));
  
    try {
      await mongoose.connect(uri, { dbName: process.env.DATABASE_NAME || "" });
      customLog("Connected to MongoDB successfully.");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw new Error("Error connecting to MongoDB" + err);
    }
  };
  

export default connectDB;