import { z } from 'zod';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/data-source';
import { RegisterUserDto, LoginUserDto } from '../dtos/user.dto';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  verifyResetToken,
} from '../utils';
import { sendEmail } from '../utils/mail.util';
import { BadRequestError, ConflictError, UnauthorizedError, NotFoundError } from '../errors';

// Type for Role
type UserRole = 'participant' | 'admin';

const userRepository: Repository<User> = AppDataSource.getRepository(User);

// Register User
export const registerUserService = async (input: z.infer<typeof RegisterUserDto>) => {
  const { email, username, name, password, role = 'admin' } = input;

  // Check for existing email
  const existingEmail = await userRepository.findOne({ where: { email } });
  if (existingEmail) throw new ConflictError('Email already in use');

  // Check for existing username
  const existingUsername = await userRepository.findOne({ where: { username } });
  if (existingUsername) throw new ConflictError('Username already in use');

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const newUser = userRepository.create({
    email,
    username,
    name,
    password: hashedPassword,
    role: role as UserRole, // Ensure correct role type
  });
  const savedUser = await userRepository.save(newUser);

  return {
    id: savedUser.id,
    email: savedUser.email,
    username: savedUser.username,
    name: savedUser.name,
    role: savedUser.role,
    createdAt: savedUser.createdAt,
  };
};

// Login User
export const loginUserService = async (data: z.infer<typeof LoginUserDto>) => {
  const { email, password } = data;
  const user = await userRepository.findOne({ where: { email: email } });
  if (!user) throw new NotFoundError(`User with email "${email}" not found`);

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({ id: user.id });

  user.refreshToken = refreshToken;
  await userRepository.save(user);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  };
};

// Get Current User Profile
export const getCurrentUserProfileService = async (userId: number) => {
  const user = await userRepository.findOne({
    where: { id: userId },
    select: ['id', 'email', 'username', 'name', 'role', 'createdAt'], // Exclude password, tokens
  });

  if (!user) throw new NotFoundError('User not found');

  return user;
};

// Update User Role (by Admin)
export const updateUserRoleService = async (
  targetUserId: number,
  newRole: UserRole,
  requester: { id: number; role: UserRole }
) => {
  if (requester.role !== 'admin') {
    throw new UnauthorizedError('Only admins can update roles');
  }

  const user = await userRepository.findOne({ where: { id: targetUserId } });
  if (!user) throw new NotFoundError('Target user not found');

  user.role = newRole;
  const updatedUser = await userRepository.save(user);

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role,
  };
};

// Handle Refresh Token
export const handleRefreshTokenService = async (refreshToken: string): Promise<string> => {
  if (!refreshToken) {
    throw new BadRequestError('Refresh token is required');
  }

  let decoded: any;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err: any) {
    throw new UnauthorizedError('Refresh token is invalid or expired');
  }

  const user = await userRepository.findOne({ where: { id: decoded.id } });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  if (user.refreshToken !== refreshToken) {
    throw new UnauthorizedError('Refresh token does not match');
  }

  const newAccessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return newAccessToken;
};

// Update User Profile (name, username, profilePicture)
export const updateUserProfileService = async (
  userId: number,
  updates: Partial<Pick<User, 'name' | 'username' | 'email' | 'profilePicture'>>
) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  // Prevent email or username conflict
  if (updates.email && updates.email !== user.email) {
    const existingEmail = await userRepository.findOne({ where: { email: updates.email } });
    if (existingEmail) throw new ConflictError('Email is already taken');
    user.email = updates.email;
  }

  if (updates.username && updates.username !== user.username) {
    const existingUsername = await userRepository.findOne({
      where: { username: updates.username },
    });
    if (existingUsername) throw new ConflictError('Username is already taken');
    user.username = updates.username;
  }

  if (updates.name) {
    user.name = updates.name;
  }

  if (updates.profilePicture) {
    user.profilePicture = updates.profilePicture;
  }

  const updatedUser = await userRepository.save(user);

  return {
    message: 'Profile updated successfully',
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      name: updatedUser.name,
      profilePicture: updatedUser.profilePicture,
    },
  };
};

// Logout User
export const logoutUserService = async (refreshToken: string): Promise<{ message: string }> => {
  if (!refreshToken) throw new BadRequestError('Refresh token is required');

  const user = await userRepository.findOne({ where: { refreshToken } });
  if (!user) throw new UnauthorizedError('Invalid refresh token');
  user.refreshToken = null;
  await userRepository.save(user);

  return { message: 'User logged out successfully' };
};

// Request Password Reset
export const requestPasswordResetService = async (email: string) => {
  const user = await userRepository.findOne({ where: { email } });
  if (!user) throw new NotFoundError('User with the given email does not exist');

  const resetToken = generateResetToken({ id: user.id });

  await sendResetPasswordEmail(user.email, resetToken);

  user.resetToken = resetToken;
  await userRepository.save(user);

  return { message: 'Password reset link has been sent to your email' };
};

// Send Reset Password Email
const sendResetPasswordEmail = async (email: string, resetToken: string) => {
  const resetLink = `http://yourdomain.com/reset-password?token=${resetToken}`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail(email, 'Password Reset Request', html);
};

// Reset Password
export const resetPasswordService = async (token: string, newPassword: string) => {
  const decoded: any = verifyResetToken(token);
  const user = await userRepository.findOne({ where: { id: decoded.id } });

  if (!user || user.resetToken !== token) {
    throw new UnauthorizedError('Invalid or expired reset token');
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.resetToken = null;

  await userRepository.save(user);

  return { message: 'Password has been successfully reset' };
};
