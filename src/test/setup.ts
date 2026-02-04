import { beforeEach } from 'vitest';
import { createMiroMock, resetMiroMock } from './miro-mock';

declare global {
  var miro: ReturnType<typeof createMiroMock>;
}

beforeEach(() => {
  resetMiroMock();
  globalThis.miro = createMiroMock();
});
