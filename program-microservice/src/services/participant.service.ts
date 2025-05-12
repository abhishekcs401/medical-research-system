import { AppDataSource } from '../config/data-source';
import { Participant } from '../entities/Participant';
import { Program } from '../entities/Program';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { publishDeleteEvent } from '../rabbitmq/producer';
import { Repository } from 'typeorm';
import { PaginationOptions } from '../utils/pagination';

const participantRepository: Repository<Participant> = AppDataSource.getRepository(Participant);

// Helper function to check if a program exists by ID
const findProgramById = async (programId: number) => {
  const program = await AppDataSource.getRepository(Program).findOne({
    where: { id: programId },
  });
  if (!program) {
    throw new NotFoundError(`Program with ID ${programId} does not exist.`);
  }
  return program;
};

export const createParticipantService = async (
  data: any,
  user: { email: string; role: string }
) => {
  const program = await findProgramById(data.program);

  // Check if a participant with the same email already exists in the database
  const existingParticipant = await participantRepository.findOne({
    where: { email: data.email },
  });

  if (existingParticipant) {
    throw new ConflictError(`Participant with email "${data.email}" already exists.`);
  }

  // Create new participant and save to the repository
  const newParticipant = participantRepository.create({
    ...data,
    program, // Linking the program to the participant
    createdByEmail: user.email,
    createdByRole: user.role,
  });

  return await participantRepository.save(newParticipant);
};

// Get All Participants
export const getParticipantsService = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const [participants, total] = await participantRepository.findAndCount({
    relations: ['program'],
    skip: offset,
    take: limit,
  });
  const totalPages = Math.ceil(total / limit);

  return {
    data: participants,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

// Get Participant By ID
export const getParticipantByIdService = async (id: number) => {
  // Fetch participant by ID, also including related program information
  const participant = await participantRepository.findOne({
    where: { id },
    relations: ['program'],
  });

  if (!participant) {
    throw new NotFoundError('Participant not found');
  }

  return participant;
};

// Update Participant
export const updateParticipantService = async (
  id: number,
  data: any,
  user: { email: string; role: string }
) => {
  const participant = await participantRepository.findOneBy({ id });
  if (!participant) {
    throw new NotFoundError('Participant not found');
  }

  // If the program ID is part of the update, check if the program exists
  if (data.program) {
    const program = await findProgramById(data.program);
    participant.program = program;
  }

  // Update the participant's data with the provided fields (including program if needed)
  Object.assign(participant, data);
  // Assign user context metadata
  participant.createdByEmail = user.email;
  participant.createdByRole = user.role;

  // Save the updated participant
  return await participantRepository.save(participant);
};

// Delete Participant
export const deleteParticipantService = async (id: number) => {
  const participant = await participantRepository.findOneBy({ id });
  if (!participant) {
    throw new NotFoundError('Participant not found');
  }

  // Publish delete event for audit purposes
  await publishDeleteEvent({
    entity: 'participant',
    entityId: id, // The entity's ID (participant ID)
    payload: {
      data: participant,
    },
  });

  // Remove the participant from the database
  await participantRepository.remove(participant);
  return true;
};
