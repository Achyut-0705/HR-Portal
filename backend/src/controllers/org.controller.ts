import { Request, Response } from 'express';
import {
  deleteOrganization,
  findOneOrganizationAndUpdate,
  getOrganization,
  registerOrg
} from '../services/org.service';
import ApiError from '../common/utils/ApiError';
import Logger from '../middleware/logger';
import { Organization } from '../types/organization';

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
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send('Missing required fields');
    }

    const orgData = await getOrganization({ id }, { _id: 0 });

    if (!orgData) {
      return res.status(404).send('Organization not found');
    }

    Logger.info(`[Api] ✅ Organisation found: ${orgData.name}`);

    res.status(200).send(orgData);
  } catch (error) {
    throw new ApiError(500, 'Organization not found');
  }
};

export const updateOrg = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    if (!id) {
      return res.status(400).send('Missing required fields');
    }

    const updatedOrgData: Partial<Organization> = {};

    if (name && name.trim() !== '') {
      updatedOrgData.name = name;
    }

    const orgData: any = await findOneOrganizationAndUpdate(
      { id },
      updatedOrgData
    );

    if (!orgData) {
      return res.status(404).send('Organization not found');
    }

    Logger.info(`[Api] ✅ Organisation updated: ${orgData.name}`);

    res.status(200).send(orgData);
  } catch (error) {
    throw new ApiError(500, 'Organization update failed');
  }
};

export const deleteOrg = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send('Missing required fields');
    }

    const orgData = await deleteOrganization({ id });

    if (!orgData) {
      return res.status(404).send('Organization not found');
    }

    Logger.info(`[Api] ✅ Organisation deleted: ${orgData.name}`);

    res.status(200).send('Organisation deleted successfully');
  } catch (error) {
    throw new ApiError(500, 'Organization deletion failed');
  }
};
