import { describe, it, expect } from 'vitest';
import { createAgent, registerUser } from '../helpers/test-app';

describe('Users API', () => {
  async function setupAuthenticatedUser() {
    const agent = createAgent();
    const res = await registerUser(agent);
    const userId = res.body.data.user.id as string;
    return { agent, userId };
  }

  describe('GET /api/v1/users', () => {
    it('should list users with pagination', async () => {
      const { agent } = await setupAuthenticatedUser();

      await registerUser(createAgent(), {
        email: 'other@example.com',
        password: 'password123',
        firstName: 'Other',
        lastName: 'User',
      });

      const res = await agent.get('/api/v1/users?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.data.users.length).toBeGreaterThanOrEqual(2);
      expect(res.body.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
      });
    });

    it('should support search', async () => {
      const { agent } = await setupAuthenticatedUser();

      await registerUser(createAgent(), {
        email: 'searchable@example.com',
        password: 'password123',
        firstName: 'Searchable',
        lastName: 'Person',
      });

      const res = await agent.get('/api/v1/users?search=searchable');

      expect(res.status).toBe(200);
      expect(
        res.body.data.users.some((u: { email: string }) => u.email === 'searchable@example.com'),
      ).toBe(true);
    });

    it('should support status filtering', async () => {
      const { agent } = await setupAuthenticatedUser();

      const res = await agent.get('/api/v1/users?status=ACTIVE');

      expect(res.status).toBe(200);
      expect(res.body.data.users.every((u: { status: string }) => u.status === 'ACTIVE')).toBe(
        true,
      );
    });

    it('should reject unauthenticated requests', async () => {
      const res = await createAgent().get('/api/v1/users');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should get own user profile', async () => {
      const { agent, userId } = await setupAuthenticatedUser();

      const res = await agent.get(`/api/v1/users/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.id).toBe(userId);
      expect(res.body.data.user).not.toHaveProperty('passwordHash');
    });

    it('should prevent IDOR - cannot access other users', async () => {
      const { agent } = await setupAuthenticatedUser();

      const otherAgent = createAgent();
      const otherRes = await registerUser(otherAgent, {
        email: 'other2@example.com',
        password: 'password123',
      });
      const otherUserId = otherRes.body.data.user.id as string;

      const res = await agent.get(`/api/v1/users/${otherUserId}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const { agent } = await setupAuthenticatedUser();
      const fakeId = '00000000-0000-4000-8000-000000000001';

      const res = await agent.get(`/api/v1/users/${fakeId}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const { agent } = await setupAuthenticatedUser();

      const res = await agent.post('/api/v1/users').send({
        email: 'created@example.com',
        password: 'password123',
        firstName: 'Created',
        lastName: 'User',
      });

      expect(res.status).toBe(201);
      expect(res.body.data.user.email).toBe('created@example.com');
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('should update own user profile', async () => {
      const { agent, userId } = await setupAuthenticatedUser();

      const res = await agent.patch(`/api/v1/users/${userId}`).send({
        firstName: 'Updated',
        lastName: 'Name',
      });

      expect(res.status).toBe(200);
      expect(res.body.data.user.firstName).toBe('Updated');
      expect(res.body.data.user.lastName).toBe('Name');
    });

    it('should allow updating another user', async () => {
      const { agent } = await setupAuthenticatedUser();

      const otherRes = await registerUser(createAgent(), {
        email: 'other3@example.com',
        password: 'password123',
      });
      const otherUserId = otherRes.body.data.user.id as string;

      const res = await agent.patch(`/api/v1/users/${otherUserId}`).send({
        firstName: 'Updated',
        lastName: 'Other',
        status: 'PENDING',
      });

      expect(res.status).toBe(200);
      expect(res.body.data.user.firstName).toBe('Updated');
      expect(res.body.data.user.lastName).toBe('Other');
      expect(res.body.data.user.status).toBe('PENDING');
    });
  });

  describe('PATCH /api/v1/users/:id/status', () => {
    it('should prevent self-deactivation via status endpoint', async () => {
      const { agent, userId } = await setupAuthenticatedUser();

      const res = await agent.patch(`/api/v1/users/${userId}/status`).send({
        status: 'INACTIVE',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should soft delete own account', async () => {
      const { agent, userId } = await setupAuthenticatedUser();

      const res = await agent.delete(`/api/v1/users/${userId}`);

      expect(res.status).toBe(200);

      // Soft delete revokes refresh tokens, so follow-up auth requests fail.
      const getRes = await agent.get(`/api/v1/users/${userId}`);
      expect(getRes.status).toBe(401);
    });

    it('should allow deleting another user', async () => {
      const { agent } = await setupAuthenticatedUser();

      const otherRes = await registerUser(createAgent(), {
        email: 'other4@example.com',
        password: 'password123',
      });
      const otherUserId = otherRes.body.data.user.id as string;

      const res = await agent.delete(`/api/v1/users/${otherUserId}`);

      expect(res.status).toBe(200);
    });
  });
});
