import { Schema, model, type InferSchemaType } from "mongoose";
import { randomUUID } from "node:crypto";

const companySchema = new Schema({
  _id: {
    type: String,
    default: () => randomUUID(),
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export type CompanyDocument = InferSchemaType<typeof companySchema> & {
  _id: string;
};

export const CompanyModel = model("Company", companySchema);
