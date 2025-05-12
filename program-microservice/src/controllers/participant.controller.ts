import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { participantSchema, participantUpdateSchema } from '../validators/participant.validator';
import {
  createParticipantService,
  getParticipantsService,
  getParticipantByIdService,
  updateParticipantService,
  deleteParticipantService,
} from '../services/participant.service';
import { BadRequestError, ValidationError } from '../errors';
import { getPagination } from '../utils/pagination';

export const createParticipant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new BadRequestError('User is not authenticated');
    }

    const parsed = participantSchema.parse(req.body);
    const result = await createParticipantService(parsed, req.user);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError('Invalid request data', error.errors));
    }
    return next(error);
  }
};

export const getParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const pagination = getPagination(page, limit);
    const participants = await getParticipantsService(pagination.page, pagination.limit);

    return res.status(200).json(participants);
  } catch (error) {
    return next(error);
  }
};

export const getParticipantById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new BadRequestError('Participant ID must be a number', {
        field: 'id',
        message: 'Must be a number',
      });
    }

    const participant = await getParticipantByIdService(id);
    return res.status(200).json(participant);
  } catch (error) {
    return next(error);
  }
};

export const updateParticipant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new BadRequestError('User is not authenticated');
    }

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new BadRequestError('Participant ID must be a number', {
        field: 'id',
        message: 'Must be a number',
      });
    }

    const parsed = participantUpdateSchema.parse(req.body);
    const updated = await updateParticipantService(id, parsed, req.user);

    return res.status(200).json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError('Invalid update data', error.errors));
    }
    return next(error);
  }
};

export const deleteParticipant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new BadRequestError('Participant ID must be a number', {
        field: 'id',
        message: 'Must be a number',
      });
    }

    await deleteParticipantService(id);
    return res.status(200).json({ message: 'Participant deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
