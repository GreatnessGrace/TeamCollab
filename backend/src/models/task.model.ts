import { Schema, model, Types } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  project: { type: Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
  createdBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Task = model('Task', TaskSchema);