import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

// Mock handlers
export const handlers = [
  http.post('/api/realtime/session', async () => {
    return HttpResponse.json({
      id: 'test_session_id',
      object: 'realtime.session',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      modalities: ['text'],
      client_secret: {
        value: 'test_token',
        expires_at: Math.floor(Date.now() / 1000) + 60, // 1 minute from now
      },
    });
  }),
];

const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test
afterEach(() => server.resetHandlers());
