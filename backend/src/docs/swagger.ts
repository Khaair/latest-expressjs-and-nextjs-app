import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API',
      version: '1.0.0',
      description: 'REST API for authentication and user management',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string', example: 'Success' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'object' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string', nullable: true },
            lastName: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'PENDING'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/api/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } },
            },
          },
          responses: {
            201: {
              description: 'User registered',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } },
              },
            },
            409: { description: 'Email already exists' },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/v1/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: { 200: { description: 'Logged out' } },
        },
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: { 200: { description: 'Current user profile' } },
        },
      },
      '/api/v1/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          responses: { 200: { description: 'Tokens refreshed' } },
        },
      },
      '/api/v1/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Request password reset',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: { email: { type: 'string', format: 'email' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Reset email sent if account exists' } },
        },
      },
      '/api/v1/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Reset password with token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'password'],
                  properties: {
                    token: { type: 'string' },
                    password: { type: 'string', minLength: 8 },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Password reset successful' } },
        },
      },
      '/api/v1/auth/change-password': {
        post: {
          tags: ['Auth'],
          summary: 'Change password',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword'],
                  properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string', minLength: 8 },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Password changed' } },
        },
      },
      '/api/v1/users': {
        get: {
          tags: ['Users'],
          summary: 'List users',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'PENDING'] },
            },
            { name: 'sortBy', in: 'query', schema: { type: 'string' } },
            { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
          ],
          responses: { 200: { description: 'Paginated user list' } },
        },
        post: {
          tags: ['Users'],
          summary: 'Create user',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: { 201: { description: 'User created' } },
        },
      },
      '/api/v1/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: { 200: { description: 'User details' }, 403: { description: 'Forbidden' } },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update user',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: { 200: { description: 'User updated' } },
        },
        delete: {
          tags: ['Users'],
          summary: 'Soft delete user',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: { 200: { description: 'User deleted' } },
        },
      },
      '/api/v1/users/{id}/status': {
        patch: {
          tags: ['Users'],
          summary: 'Update user status',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: { 200: { description: 'Status updated' } },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './src/routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
