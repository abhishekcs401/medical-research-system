import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  refreshToken,
  getCurrentUser,
  updateUserRole,
  updateUserProfileController,
  logoutController,
  requestPasswordResetController,
  resetPasswordController,
} from '../controllers/auth.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { isAdminMiddleware } from '../middlewares/isAdmin.middleware';
import {
  loginRateLimiter,
  registerRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
} from '../middlewares/rateLimit.middleware';
// import { upload } from '../middlewares/upload.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public Routes
router.post('/register', registerRateLimiter, asyncHandler(registerUserController));
router.post('/login', loginRateLimiter, asyncHandler(loginUserController));
router.post(
  '/request-reset-password',
  forgotPasswordRateLimiter,
  asyncHandler(requestPasswordResetController)
);
router.post('/reset-password', resetPasswordRateLimiter, asyncHandler(resetPasswordController));
router.post('/refresh-token', asyncHandler(refreshToken));

// Protected Routes (require JWT auth)
router.get('/me', authenticateUser, asyncHandler(getCurrentUser));
router.put(
  '/update-profile',
  authenticateUser,
  // upload.single('profileImage'),
  asyncHandler(updateUserProfileController)
);
router.post('/logout', authenticateUser, asyncHandler(logoutController));
router.patch('/users/:id/role', authenticateUser, isAdminMiddleware, asyncHandler(updateUserRole));

export default router;
