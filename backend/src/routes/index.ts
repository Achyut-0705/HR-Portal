import { Router } from 'express';
import OrgRouter from './org.route';
import { withAuthRole } from '../middleware/auth';

const router = Router();

router.use('/org', withAuthRole(['super_admin']), OrgRouter);

export default router;
