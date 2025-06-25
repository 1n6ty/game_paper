import { container as prodContainer } from './container.prod';
import { container as mockContainer } from './container.mock';

console.log(
  `%c[DI] Application is running with ${__USE_MOCKS__ ? 'MOCK' : 'PRODUCTION'} dependencies.`,
  'color: #00A36C; font-weight: bold;'
);

export const dependencies = __USE_MOCKS__ ? mockContainer : prodContainer;