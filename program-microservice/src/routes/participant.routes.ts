import { Router } from 'express';
import {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from '../controllers/participant.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getParticipants));
router.get('/:id', asyncHandler(getParticipantById));
router.post('/', asyncHandler(createParticipant));
router.put('/:id', asyncHandler(updateParticipant));
router.delete('/:id', asyncHandler(deleteParticipant));

export default router;
