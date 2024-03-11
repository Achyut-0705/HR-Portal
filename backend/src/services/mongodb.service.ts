import mongoose, { Mongoose } from "mongoose";

let mongodb: Mongoose;

export const connectToMongoDB = async (uri: string) => {
  mongodb = await mongoose.connect(uri);
  return mongodb;
};

export const getMongoDB = () => mongodb;
