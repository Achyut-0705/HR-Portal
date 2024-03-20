import { parseMongoError } from '../common/utils/ErrorParser';
import Logger from '../middleware/logger';
import Organization from '../schemas/organization.schema';
import { v4 as uuid } from 'uuid';

// Todo: CRUD operation for orgaization
export const registerOrg = async ({ name }: { name: string }) => {
  if (!name) {
    throw new Error('Missing required fields');
  }
  const org = new Organization({
    name,
    id: uuid()
  });

  try {
    await org.save();
    Logger.info(
      `[mongodb] ✅ Organisation with ${name} registered successfully`
    );
    return org;
  } catch (error: any) {
    Logger.error(
      `[mongodb] 🚨 Error during organisation registration - ${error}`
    );
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
