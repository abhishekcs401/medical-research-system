import { createCustomProxy } from './proxy.factory';
import { config } from '../config/gateway.config';

export const programProxy = createCustomProxy({
  target: config.programServiceUrl || 'http://localhost:3001',
  label: 'Program',
  injectUserHeaders: true,
});
