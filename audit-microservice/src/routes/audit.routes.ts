import { Router } from 'express';
import { getAudits } from '../controllers/audit.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/audits', asyncHandler(getAudits));

export default router;
