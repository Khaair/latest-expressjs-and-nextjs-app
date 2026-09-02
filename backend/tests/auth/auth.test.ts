import { describe, it, expect } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { hashToken } from '../../src/utils/password';
import { generateSecureToken } from '../../src/utils/tokens';
import { createAgent, defaultUser, registerUser, loginUser } from '../helpers/test-app';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const agent = createAgent();
      const res = await registerUser(agent);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(defaultUser.email);
      expect(res.body.data.user).not.toHaveProperty('passwordHash');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const res = await registerUser(createAgent(), defaultUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should validate input', async () => {
      const res = await createAgent()
        .post('/api/v1/auth/register')
        .send({ email: 'invalid', password: 'short' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const loginAgent = createAgent();
      const res = await loginUser(loginAgent);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(defaultUser.email);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const res = await loginUser(createAgent(), {
        email: defaultUser.email,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const res = await agent.get('/api/v1/auth/me');

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(defaultUser.email);
    });

    it('should reject unauthenticated requests', async () => {
      const res = await createAgent().get('/api/v1/auth/me');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout authenticated user', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const res = await agent.post('/api/v1/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const meRes = await agent.get('/api/v1/auth/me');
      expect(meRes.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh tokens with valid refresh cookie', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const res = await agent.post('/api/v1/auth/refresh');

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(defaultUser.email);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject refresh without cookie', async () => {
      const res = await createAgent().post('/api/v1/auth/refresh');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should accept forgot password request', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const res = await agent.post('/api/v1/auth/forgot-password').send({
        email: defaultUser.email,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const tokens = await prisma.passwordResetToken.findMany();
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should not reveal if email does not exist', async () => {
      const res = await createAgent()
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'missing@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/auth/reset-password', () => {
    async function createResetToken(userId: string): Promise<string> {
      const rawToken = generateSecureToken();
      const tokenHash = await hashToken(rawToken);
      await prisma.passwordResetToken.create({
        data: {
          tokenHash,
          userId,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
      return rawToken;
    }

    it('should reset password with valid token', async () => {
      const agent = createAgent();
      const registerRes = await registerUser(agent);
      const userId = registerRes.body.data.user.id;
      const token = await createResetToken(userId);

      const res = await createAgent()
        .post('/api/v1/auth/reset-password')
        .send({ token, password: 'newpassword123' });

      expect(res.status).toBe(200);

      const loginRes = await loginUser(createAgent(), {
        email: defaultUser.email,
        password: 'newpassword123',
      });
      expect(loginRes.status).toBe(200);
    });

    it('should reject invalid reset token', async () => {
      const res = await createAgent()
        .post('/api/v1/auth/reset-password')
        .send({ token: 'invalid-token', password: 'newpassword123' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/change-password', () => {
    it('should change password when authenticated', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const res = await agent.post('/api/v1/auth/change-password').send({
        currentPassword: defaultUser.password,
        newPassword: 'changedpassword123',
      });

      expect(res.status).toBe(200);

      const loginRes = await loginUser(createAgent(), {
        email: defaultUser.email,
        password: 'changedpassword123',
      });
      expect(loginRes.status).toBe(200);
    });

    it('should reject wrong current password', async () => {
      const agent = createAgent();
      await registerUser(agent);

      const res = await agent.post('/api/v1/auth/change-password').send({
        currentPassword: 'wrongpassword',
        newPassword: 'changedpassword123',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('Health checks', () => {
    it('GET /health should return ok', async () => {
      const res = await createAgent().get('/health');
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ok');
    });

    it('GET /health/ready should check database', async () => {
      const res = await createAgent().get('/health/ready');
      expect(res.status).toBe(200);
      expect(res.body.data.database).toBe('connected');
    });
  });
});
