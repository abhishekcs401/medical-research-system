import { Program } from '../../program/types/program.model';

export interface Participant {
  id: number;
  name: string;
  email: string;
  age: number;
  joinedDate: string;
  program: Program;
  createdByEmail: string;
  createdByRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantResponse {
  data: Participant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
