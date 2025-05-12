import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { programSchema, updateProgramSchema } from '../validators/program.validator';
import {
  createProgramService,
  getAllProgramsService,
  getProgramByIdService,
  updateProgramService,
  deleteProgramService,
} from '../services/program.service';
import { BadRequestError, ValidationError } from '../errors';
import { getPagination } from '../utils/pagination';

export const createProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.fileValidationError) {
      throw new BadRequestError(req.fileValidationError);
    }
    if (!req.user) {
      throw new BadRequestError('User is not authenticated');
    }

    const parsed = programSchema.parse(req.body);
    const result = await createProgramService(parsed, req.file, req.user);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError('Invalid request data', error.errors));
    }
    return next(error);
  }
};

export const getPrograms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const pagination = getPagination(page, limit);
    const programs = await getAllProgramsService(pagination.page, pagination.limit);

    return res.status(200).json(programs);
  } catch (error) {
    return next(error);
  }
};

export const getProgramById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new BadRequestError('Program ID must be a number', {
        field: 'id',
        message: 'Must be a number',
      });
    }

    const program = await getProgramByIdService(id);
    return res.status(200).json(program);
  } catch (error) {
    return next(error);
  }
};

export const updateProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.fileValidationError) {
      throw new BadRequestError(req.fileValidationError);
    }
    if (!req.user) {
      throw new BadRequestError('User is not authenticated');
    }
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new BadRequestError('Program ID must be a number', {
        field: 'id',
        message: 'Must be a number',
      });
    }

    const parsed = updateProgramSchema.parse(req.body);
    const updated = await updateProgramService(id, parsed, req.file, req.user);

    return res.status(200).json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError('Invalid update data', error.errors));
    }
    return next(error);
  }
};

export const deleteProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new BadRequestError('Program ID must be a number', {
        field: 'id',
        message: 'Must be a number',
      });
    }

    await deleteProgramService(id);
    return res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
