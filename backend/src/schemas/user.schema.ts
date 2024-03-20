import mongoose, { Schema } from 'mongoose';
import { TUSerSchema, userRoleSchema, userStatusSchema } from '../types/user';

const USER_SCHEMA = new Schema<TUSerSchema>(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    organizationName: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: userRoleSchema.options,
      default: 'user'
    },
    status: {
      type: String,
      enum: userStatusSchema.options,
      default: 'active'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const User = mongoose.model('User', USER_SCHEMA);
export default User;
