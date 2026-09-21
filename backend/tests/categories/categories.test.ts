import { describe, it, expect } from 'vitest';
import { createAgent, registerUser } from '../helpers/test-app';

describe('Categories API', () => {
  async function setupAuthenticatedUser() {
    const agent = createAgent();
    await registerUser(agent, {
      email: `cat-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Cat',
      lastName: 'Admin',
    });
    return { agent };
  }

  describe('GET /api/v1/categories', () => {
    it('should list categories with pagination', async () => {
      const { agent } = await setupAuthenticatedUser();

      await agent.post('/api/v1/categories').send({
        name: 'Technology',
        description: 'Tech related posts',
      });

      const res = await agent.get('/api/v1/categories?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.data.categories.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
      });
    });

    it('should support search', async () => {
      const { agent } = await setupAuthenticatedUser();

      await agent.post('/api/v1/categories').send({
        name: 'Searchable Category',
        slug: 'searchable-category',
      });

      const res = await agent.get('/api/v1/categories?search=searchable');

      expect(res.status).toBe(200);
      expect(
        res.body.data.categories.some(
          (c: { name: string }) => c.name === 'Searchable Category',
        ),
      ).toBe(true);
    });

    it('should reject unauthenticated requests', async () => {
      const res = await createAgent().get('/api/v1/categories');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/categories', () => {
    it('should create a category and auto-generate slug', async () => {
      const { agent } = await setupAuthenticatedUser();

      const res = await agent.post('/api/v1/categories').send({
        name: 'Web Development',
        description: 'All about web',
      });

      expect(res.status).toBe(201);
      expect(res.body.data.category.name).toBe('Web Development');
      expect(res.body.data.category.slug).toBe('web-development');
    });
  });

  describe('PATCH /api/v1/categories/:id', () => {
    it('should update a category', async () => {
      const { agent } = await setupAuthenticatedUser();

      const created = await agent.post('/api/v1/categories').send({
        name: 'Draft',
      });
      const id = created.body.data.category.id as string;

      const res = await agent.patch(`/api/v1/categories/${id}`).send({
        name: 'Published',
        description: 'Updated description',
      });

      expect(res.status).toBe(200);
      expect(res.body.data.category.name).toBe('Published');
      expect(res.body.data.category.description).toBe('Updated description');
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should soft delete a category', async () => {
      const { agent } = await setupAuthenticatedUser();

      const created = await agent.post('/api/v1/categories').send({
        name: 'Temporary',
      });
      const id = created.body.data.category.id as string;

      const res = await agent.delete(`/api/v1/categories/${id}`);
      expect(res.status).toBe(200);

      const getRes = await agent.get(`/api/v1/categories/${id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
