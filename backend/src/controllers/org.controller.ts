import { Request, Response } from 'express';
import { registerOrg } from '../services/org.service';
import ApiError from '../common/utils/ApiError';
import Logger from '../middleware/logger';

export const createOrg = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const orgData = await registerOrg({
      name
    });

    if (typeof orgData === 'string') {
      if (orgData.includes(' already exists.')) {
        Logger.warn(`[Api] ⚠️ Organisation already exists - ${orgData}`);
        return res.status(409).send(orgData);
      } else {
        Logger.error(`[Api] 🚨 Organisation registration failed - ${orgData}`);
        return res.status(400).send(orgData);
      }
    } else {
      Logger.info(`[Api] ✅ Organisation registered successfully: ${name}`);
      res.status(200).send('Organisation registered successfully');
    }
  } catch (error) {
    throw new ApiError(500, 'Organization registration failed');
  }
};

export const getOrg = async (req: Request, res: Response) => {
  res.send('Get Org');
};

export const updateOrg = async (req: Request, res: Response) => {
  res.send('Update Org');
};

export const deleteOrg = async (req: Request, res: Response) => {
  res.send('Delete Org');
};
