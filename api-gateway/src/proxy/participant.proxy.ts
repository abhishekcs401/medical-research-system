import { config } from '../config/gateway.config';
import { createCustomProxy } from './proxy.factory';

export const participantProxy = createCustomProxy({
  target: config.programServiceUrl || 'http://localhost:3001',
  label: 'Participant',
  injectUserHeaders: true,
});
