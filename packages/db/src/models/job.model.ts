import mongoose, {  Schema } from "mongoose";

const JobSchema = new Schema({
  request_id: { type: String, required: true },
  payload: { type: Object, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "complete", "failed"],
    required: true,
  },
  vendor: { type: String, enum: ["sync", "async"], required: true },
  result: { type: Object },
  retries: { type: Number, default: 0 },
});


export const Job = mongoose.model("Job", JobSchema);
