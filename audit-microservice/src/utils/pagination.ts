import { DeleteAudit } from '../entities/DeleteAudit';

export interface PaginationOptions {
  page: number;
  limit: number;
  searchAudit?: string;
}

export interface PaginatedAudits {
  data: DeleteAudit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getPagination = (page: number, limit: number): PaginationOptions => {
  if (page < 1 || limit < 1) {
    throw new Error('Page and limit must be greater than zero');
  }
  return {
    page: page || 1, // Default to page 1
    limit: limit || 10, // Default to limit 10
  };
};
