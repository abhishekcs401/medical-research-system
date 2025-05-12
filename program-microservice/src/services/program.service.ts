import { AppDataSource } from '../config/data-source';
import { Program } from '../entities/Program';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { publishDeleteEvent } from '../rabbitmq/producer';
import { Repository } from 'typeorm';
import { PaginatedPrograms } from '../utils/pagination';

const programRepository: Repository<Program> = AppDataSource.getRepository(Program);

// Create Program
export const createProgramService = async (
  data: any,
  file: Express.Multer.File | undefined,
  user: { email: string; role: string }
) => {
  const existing = await programRepository.findOne({ where: { title: data.title } });
  if (existing) {
    throw new ConflictError(`Program with title "${data.title}" already exists`);
  }

  const newProgram = programRepository.create({
    ...data,
    attachment: file?.filename || null,
    createdByEmail: user.email,
    createdByRole: user.role,
  });

  return await programRepository.save(newProgram);
};

// Get All Programs
export const getAllProgramsService = async (
  page: number,
  limit: number
): Promise<PaginatedPrograms> => {
  const offset = (page - 1) * limit;
  const [programs, total] = await programRepository.findAndCount({
    skip: offset,
    take: limit,
    relations: ['participants'],
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: programs,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

// Get Program By ID
export const getProgramByIdService = async (id: number): Promise<Program> => {
  if (!id) {
    throw new BadRequestError('Program ID is required');
  }

  const program = await programRepository.findOne({
    where: { id },
    relations: ['participants'],
  });

  if (!program) {
    throw new NotFoundError(`Program with ID ${id} not found`);
  }

  return program;
};

// Update Program
export const updateProgramService = async (
  id: number,
  data: any,
  file: Express.Multer.File | undefined,
  user: { email: string; role: string }
) => {
  if (!id) {
    throw new BadRequestError('Program ID is required');
  }

  const existingProgram = await programRepository.findOneBy({ id });
  if (!existingProgram) {
    throw new NotFoundError(`Program with ID ${id} not found`);
  }

  // Prevent updating to an existing title
  if (data.title && data.title !== existingProgram.title) {
    const duplicate = await programRepository.findOne({ where: { title: data.title } });
    if (duplicate) {
      throw new ConflictError(`Program with title "${data.title}" already exists`);
    }
  }

  const updated = programRepository.merge(existingProgram, {
    ...data,
    attachment: file?.filename ?? existingProgram.attachment,
    createdByEmail: user.email,
    createdByRole: user.role,
  });

  return await programRepository.save(updated);
};

// Delete Program
export const deleteProgramService = async (id: number): Promise<void> => {
  if (!id) {
    throw new BadRequestError('Program ID is required');
  }

  const program = await programRepository.findOneBy({ id });
  if (!program) {
    throw new NotFoundError(`Program with ID ${id} not found`);
  }
  // Publish delete event for audit purposes
  await publishDeleteEvent({
    entity: 'program',
    entityId: id, // The entity's ID (program ID)
    payload: {
      data: program,
    },
  });
  await programRepository.remove(program);
};
