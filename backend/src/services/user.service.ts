import User from '../schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { TUserCreationPayload, TUserRole, TUserStatus } from '../types/user';
import Logger from '../middleware/logger';
import { parseMongoError } from '../common/utils/ErrorParser';

export const getUser = (filter: any, projection?: any, options?: any) => {
  return User.findOne(filter, projection, options);
};

export const findOneUserAndUpdate = (
  filter: any,
  update?: any,
  options?: any
) => {
  return User.findOneAndUpdate(filter, update, options);
};

export const getUsersList = (
  filter: any,
  { limit, skip, sort }: { limit: number; skip: number; sort: any },
  projection?: any,
  options?: any
) => {
  return User.find(filter, projection, options)
    .limit(limit)
    .skip(skip)
    .sort(sort);
};

export const getUsersCount = (filter: any, options?: any) => {
  return User.countDocuments(filter, options);
};

export const registerUser = async <
  T extends TUserCreationPayload & { role: TUserRole; status: TUserStatus }
>({
  username,
  password,
  name,
  email,
  role,
  status
}: T) => {
  const user = new User({
    id: uuidv4(),
    username,
    password,
    organizationName: `${process.env.ORGANIZATION_NAME}`,
    name,
    email,
    role,
    status
  });

  try {
    await user.save();
    Logger.info(`[mongodb] ✅ User with ${username} registered successfully`);
    return user;
  } catch (error: any) {
    Logger.error(`[mongodb] 🚨 Error during user registration - ${error}`);
    if (error.code === 11000) {
      const duplicate = parseMongoError(error);
      if (duplicate) {
        Logger.warn(
          `[mongodb] ⚠️ Duplicate key error - ${duplicate.field} with value ${duplicate.value} already exists.`
        );
        return `${duplicate.field} with value ${duplicate.value} already exists.`;
      }
    } else {
      throw error;
    }
  }
};
