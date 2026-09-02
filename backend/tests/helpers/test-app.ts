import request, { Response } from 'supertest';
import { createApp } from '../../src/app';

export const app = createApp();

export interface TestUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const defaultUser: TestUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
};

export async function registerUser(
  agent: request.SuperAgentTest,
  user: TestUser = defaultUser,
): Promise<Response> {
  return agent.post('/api/v1/auth/register').send(user);
}

export async function loginUser(
  agent: request.SuperAgentTest,
  credentials: Pick<TestUser, 'email' | 'password'> = defaultUser,
): Promise<Response> {
  return agent.post('/api/v1/auth/login').send(credentials);
}

export function createAgent(): request.SuperAgentTest {
  return request.agent(app);
}
