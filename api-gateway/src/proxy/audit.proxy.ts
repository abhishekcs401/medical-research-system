import { config } from '../config/gateway.config';
import { createCustomProxy } from './proxy.factory';

export const auditProxy = createCustomProxy({
  target: config.auditServiceUrl || 'http://localhost:3002',
  label: 'Audit',
  injectUserHeaders: false, // usually not needed for audit service
});
