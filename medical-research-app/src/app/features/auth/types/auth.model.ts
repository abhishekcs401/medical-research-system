// Common user structure
export interface User {
  id: number;
  email: string;
  username: string; // added based on response
  name: string;
  role: 'admin' | 'participant';
}

// Login request & response
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

// Register request & response
export interface RegisterRequest {
  name: string;
  email: string;
  username: string; // added to match your user entity
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Token payload after decoding (JWT)
export interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
