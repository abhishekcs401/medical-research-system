import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { config } from '../config/config';
import { UnauthorizedError, BadRequestError } from '../errors';
import { CustomJwtPayload } from '../types/jwtPayload';

// Correct property access from config
const JWT_SECRET = config.jwt.accessSecret || process.env.JWT_SECRET || 'supersecretdevkey';
const JWT_REFRESH_SECRET =
  config.jwt.refreshSecret || process.env.JWT_REFRESH_SECRET || 'refreshsupersecretkey';
const JWT_RESET_SECRET = config.jwt.resetSecret || process.env.JWT_RESET_SECRET || 'resetsecretkey';

// Access Token
export const generateAccessToken = (payload: object): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  } catch (error) {
    console.error('Error generating access token:', error);
    throw new BadRequestError('Error generating access token');
  }
};

// Refresh Token
export const generateRefreshToken = (payload: object): string => {
  try {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new BadRequestError('Error generating refresh token');
  }
};

// Verify Access Token
export const verifyAccessToken = (token: string): CustomJwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
  } catch (error: any) {
    console.error('Error verifying access token:', error);
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token expired');
    } else {
      throw new UnauthorizedError('Invalid access token');
    }
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    if (typeof decoded === 'string') throw new UnauthorizedError('Invalid refresh token');
    return decoded;
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expired');
    } else if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    } else {
      throw new UnauthorizedError('Token verification failed');
    }
  }
};

// Generate Reset Password Token
export const generateResetToken = (payload: object): string => {
  try {
    return jwt.sign(payload, JWT_RESET_SECRET, { expiresIn: '15m' });
  } catch (error) {
    console.error('Error generating reset password token:', error);
    throw new BadRequestError('Error generating reset password token');
  }
};

// Verify Reset Password Token
export const verifyResetToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_RESET_SECRET);
    if (typeof decoded === 'string') throw new UnauthorizedError('Invalid reset password token');
    return decoded;
  } catch (error) {
    console.error('Error verifying reset password token:', error);
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError('Reset password token expired');
    } else if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError('Invalid reset password token');
    } else {
      throw new UnauthorizedError('Token verification failed');
    }
  }
};
