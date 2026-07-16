import { InferSchemaType, model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";
import { Role } from "../../../domain/enums/Role";

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    companyId: {
      type: String,
      required: true,
      ref: "Company",
      index: true,
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const UserModel = model("User", userSchema);
