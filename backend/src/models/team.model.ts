import { Schema, model, Types } from "mongoose";

const TeamSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Types.ObjectId, ref: 'User', required: true },
  members: [
    {
      user: { type: Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['manager', 'user'], default: 'user' }
    }
  ],
  inviteTokens: [{ email: String, token: String, expiresAt: Date }],
}, { timestamps: true });

export const Team = model('Team', TeamSchema);
