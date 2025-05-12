// Importing Participant model
import { Participant } from '../../participant/types/participant.model';
type NullableString = string | null;
export interface Program {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  attachment: NullableString;
  createdByEmail: string;
  createdByRole: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
