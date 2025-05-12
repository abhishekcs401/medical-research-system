import { RequestHandler } from 'express';

// Define the possible roles and actions
type Role = 'admin' | 'participant' | 'user';
type Action = 'create' | 'read' | 'update' | 'delete';

const rolePermissions: Record<Role, Action[]> = {
  admin: ['create', 'read', 'update', 'delete'],
  participant: ['create', 'read', 'update'],
  user: ['read'],
};

const methodToActionMap: Record<string, Action> = {
  GET: 'read',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'delete',
};

// ✅ Use RequestHandler to fix the type error in app.use(...)
export const checkPermission: RequestHandler = (req, res, next) => {
  const user = (req as any).user;
  if (!user || !user.role) {
    res.status(403).json({ message: 'Missing user role' });
    return;
  }

  const userRole = user.role as Role;
  const action = methodToActionMap[req.method];

  if (!action) {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const allowedActions = rolePermissions[userRole];

  if (!allowedActions || !allowedActions.includes(action)) {
    res.status(403).json({ message: 'Access denied: insufficient permissions' });
    return;
  }

  next();
};
