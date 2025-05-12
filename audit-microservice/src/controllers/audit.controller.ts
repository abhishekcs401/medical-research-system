import { Request, Response } from 'express';
import logger from '../utils/logger';
import { getAllAudits } from '../services/audit.service';
import { getPagination } from '../utils/pagination';

export const getAudits = async (req: Request, res: Response) => {
  try {
    const { page, limit } = getPagination(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 10
    );
    const audits = await getAllAudits(page, limit);
    logger.info('Audits retrieved successfully'); // Logging success
    return res.json(audits); // Early return after success
  } catch (err) {
    logger.error(
      `Error retrieving audits: ${err instanceof Error ? err.message : 'Unknown error'}`
    ); // Logging error
    return res.status(500).json({
      message: 'Error retrieving audits',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
