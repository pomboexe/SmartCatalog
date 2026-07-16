import { InferSchemaType, model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";

const productSchema = new Schema(
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
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

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const ProductModel = model("Product", productSchema);
