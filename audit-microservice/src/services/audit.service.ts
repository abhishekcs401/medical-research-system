import { AppDataSource } from '../data-source';
import { DeleteAudit } from '../entities/DeleteAudit';
import { PaginatedAudits } from '../utils/pagination';

// Save a delete audit record
export const saveDeleteAudit = async (data: {
  entity: string;
  entityId: string | number;
  payload?: Record<string, any>;
}) => {
  const { entity, entityId, payload } = data;
  if (!entity || !entityId) {
    throw new Error('Entity and entityId are required fields');
  }

  const repo = AppDataSource.getRepository(DeleteAudit);

  const audit = repo.create({
    entity,
    entityId: Number(entityId),
    payload,
  });
  return await repo.save(audit);
};

// Get all audits with pagination
export const getAllAudits = async (page: number, limit: number): Promise<PaginatedAudits> => {
  const repo = AppDataSource.getRepository(DeleteAudit);

  const offset = (page - 1) * limit;
  const [audits, total] = await repo.findAndCount({
    skip: offset,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: audits,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};
