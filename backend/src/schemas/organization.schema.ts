import mongoose, { Schema } from "mongoose";

const ORGANIZATION_SCHEMA = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date, // iso standard
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

const Organization = mongoose.model("Organization", ORGANIZATION_SCHEMA);
export default Organization;
