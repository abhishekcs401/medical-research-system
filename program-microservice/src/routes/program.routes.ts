import { Router } from 'express';
import { uploadFile } from '../middlewares/fileUpload';
import { asyncHandler } from '../utils/asyncHandler';

import {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from '../controllers/program.controller';

const router = Router();

router.get('/', asyncHandler(getPrograms));
router.get('/:id', asyncHandler(getProgramById));
router.post('/', uploadFile, asyncHandler(createProgram));
router.put('/:id', uploadFile, asyncHandler(updateProgram));
router.delete('/:id', asyncHandler(deleteProgram));

export default router;
