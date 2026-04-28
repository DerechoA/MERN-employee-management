const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'MERN Employee Management API',
    version: '1.0.0',
    description: 'API documentation for the backend service using Swagger UI.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local backend server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
      },
      Employee: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          position: { type: 'string' },
          department: { type: 'string' },
          salary: { type: 'number' },
          createdBy: { type: 'string', nullable: true },
          updatedBy: { type: 'string', nullable: true },
          updatedAt: { type: 'string', format: 'date-time', nullable: true },
          deleted: { type: 'boolean' },
          deletedBy: { type: 'string', nullable: true },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          errors: {
            type: 'array',
            items: { type: 'object' },
          },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/definitions/{model}': {
      get: {
        summary: 'Get model definition',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Model definition returned',
          },
          '404': {
            description: 'Model not found',
          },
        },
      },
    },
    '/api/{model}': {
      get: {
        summary: 'List records for a model',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
          {
            name: 'deleted',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'Show deleted records when true (admin only)',
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of records',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
      post: {
        summary: 'Create a new record for a model',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Employee' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Record created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Employee' },
              },
            },
          },
          '400': {
            description: 'Validation failed',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/{model}/{id}': {
      get: {
        summary: 'Get a single record by id',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Record returned' },
          '404': { description: 'Record not found' },
        },
      },
      put: {
        summary: 'Update a record by id',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Employee' },
            },
          },
        },
        responses: {
          '200': { description: 'Record updated successfully' },
          '400': { description: 'Validation failed' },
          '404': { description: 'Record not found' },
        },
      },
      delete: {
        summary: 'Soft delete a record by id',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Record soft deleted' },
          '404': { description: 'Record not found' },
        },
      },
    },
    '/api/{model}/{id}/soft-delete': {
      patch: {
        summary: 'Soft delete a record by id',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Record soft deleted' },
          '404': { description: 'Record not found' },
        },
      },
    },
    '/api/{model}/{id}/undelete': {
      patch: {
        summary: 'Restore a soft deleted record (admin only)',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Record restored' },
          '403': { description: 'Forbidden: insufficient permissions' },
          '404': { description: 'Record not found' },
        },
      },
    },
    '/api/{model}/{id}/permanent': {
      delete: {
        summary: 'Permanently delete a soft deleted record (admin only)',
        parameters: [
          {
            name: 'model',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'employees' },
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Record permanently deleted' },
          '403': { description: 'Forbidden: insufficient permissions' },
          '404': { description: 'Record not found' },
        },
      },
    },
  },
};

export default swaggerDocument;
