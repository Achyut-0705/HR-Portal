import { Router } from 'express';
import {
  createOrg,
  deleteOrg,
  getOrg,
  updateOrg
} from '../controllers/org.controller';

const router = Router();

router.post('/', createOrg);
router.get('/', getOrg);
router.patch('/', updateOrg);
router.delete('/', deleteOrg);

export default router;
