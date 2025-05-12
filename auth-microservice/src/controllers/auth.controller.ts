import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  registerUserService,
  loginUserService,
  getCurrentUserProfileService,
  requestPasswordResetService,
  resetPasswordService,
  updateUserRoleService,
  updateUserProfileService,
  handleRefreshTokenService,
  logoutUserService,
} from '../services/auth.service';
import { RegisterUserDto, LoginUserDto, ResetPasswordDto } from '../dtos/user.dto';
import { BadRequestError, ForbiddenError, ValidationError, UnauthorizedError } from '../errors';
import { formatZodError } from '../utils/formatZodError';

export const registerUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = RegisterUserDto.parse(req.body);
    const result = await registerUserService(validatedData);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError('Invalid request data', formatZodError(error)));
    }
    return next(error);
  }
};

export const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = LoginUserDto.parse(req.body);
    const result = await loginUserService(validatedData);

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict', // or 'lax'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token & user info in body only
    res.status(200).json({
      message: 'Login successful',
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError('Invalid request data', formatZodError(error)));
    }
    return next(error);
  }
};

// Request password reset (send OTP or email link)
export const requestPasswordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const result = await requestPasswordResetService(email);

    return res.status(200).json({
      message: 'Password reset link/OTP sent to email',
    });
  } catch (error) {
    return next(error);
  }
};

// Reset password (verify token + set new password)
export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new BadRequestError('Token and new password are required');
    }

    const result = await resetPasswordService(token, newPassword);

    return res.status(200).json({
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized: User not authenticated');
    }
    const { id } = req.user;
    // Ensure id is a number
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    const user = await getCurrentUserProfileService(userId);
    // Respond with the current user's details
    return res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (req.user?.role !== 'admin') {
      throw new ForbiddenError('Only admins can update user roles');
    }

    if (!role) {
      throw new BadRequestError('Role is required');
    }

    // Convert `id` to a number before passing it to the service
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    const updatedUser = await updateUserRoleService(userId, role, {
      id: parseInt(req.user.id, 10),
      role: req.user.role,
    });

    res.status(200).json({ message: 'Role updated successfully', user: updatedUser });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError('Invalid request data', formatZodError(error)));
    }
    return next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }
    const newAccessToken = await handleRefreshTokenService(refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};
export const updateUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized: User not authenticated');
    }

    const { username, name, email } = req.body;
    const profilePicture = req.file?.filename; // Or use req.file?.path based on your storage config

    if (!username && !name && !profilePicture) {
      throw new BadRequestError(
        'At least one field (username, name, or profile image) is required for update'
      );
    }

    const updatedUser = await updateUserProfileService(Number(req.user.id), {
      username,
      name,
      email,
      profilePicture,
    });

    return res.status(200).json({
      message: 'User profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict', // Or 'lax' depending on your needs
    });

    const result = await logoutUserService(refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
