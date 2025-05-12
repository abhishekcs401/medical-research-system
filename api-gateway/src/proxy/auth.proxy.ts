import { config } from '../config/gateway.config';
import { createCustomProxy } from './proxy.factory';

export const authProxy = createCustomProxy({
  // target: config.authServiceUrl || 'http://localhost:3000',
  target: config.authServiceUrl || 'http://auth-microservice:3000',
  label: 'Auth',
  injectUserHeaders: false, // typically not needed for auth requests
});
