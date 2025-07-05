import mongoose from "mongoose";

export async function connectMongo(uri: string) {
  try {
    await mongoose.connect(uri, { dbName: "multivendor" });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Failed to connect to MongoDB", error)
  }
}