export interface AuditResponse {
  data: Audit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Participant audit payload structure
export interface ParticipantData {
  id: number;
  name: string;
  email: string;
  age: number;
  joinedDate: string;
  createdByRole: string;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Program audit payload structure
export interface ProgramData {
  id: number;
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  attachment: string;
  createdByRole: string;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Union type for audit payload
export type AuditPayloadData = ParticipantData | ProgramData;

// Main Audit interface
export interface Audit {
  id: number;
  entity: 'participant' | 'program';
  entityId: number;
  payload: {
    data: AuditPayloadData;
  };
  createdAt: string;
  updatedAt: string;
}
