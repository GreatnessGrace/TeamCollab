import { Schema, model, Types } from "mongoose";

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  team: { type: Types.ObjectId, ref: 'Team', required: true },
  createdBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Project = model('Project', ProjectSchema);