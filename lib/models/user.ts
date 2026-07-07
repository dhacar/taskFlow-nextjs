import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    provider: {
      type: String,
      enum: ["google"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const User =
  (models.User as Model<UserDocument> | undefined) ?? model<UserDocument>("User", userSchema);
