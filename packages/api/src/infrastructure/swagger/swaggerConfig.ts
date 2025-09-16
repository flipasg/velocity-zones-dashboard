import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Velocity Zones Dashboard API',
      version: '1.0.0',
      description:
        'API for managing velocity zones and exercise repetitions with clean architecture',
      contact: {
        name: 'Velocity Zones Dashboard',
        url: 'https://github.com/flipasg/velocity-zones-dashboard',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development server',
      },
      {
        url: '/api/v1',
        description: 'Current environment',
      },
    ],
    components: {
      schemas: {
        ZoneResponseDto: {
          type: 'object',
          required: ['id', 'name', 'minVelocity', 'maxVelocity', 'color'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the velocity zone',
              example: 'zone-123',
            },
            name: {
              type: 'string',
              description: 'Name of the velocity zone',
              example: 'Power',
            },
            minVelocity: {
              type: 'number',
              description: 'Minimum velocity for this zone (m/s)',
              example: 0.3,
            },
            maxVelocity: {
              type: 'number',
              description: 'Maximum velocity for this zone (m/s)',
              example: 0.6,
            },
            color: {
              type: 'string',
              description: 'Color code for zone visualization',
              example: '#ffaa00',
            },
            description: {
              type: 'string',
              description: 'Optional description of the zone',
              example: 'Power development zone',
            },
          },
        },
        CreateRepDto: {
          type: 'object',
          required: ['exerciseId', 'velocity'],
          properties: {
            exerciseId: {
              type: 'string',
              description: 'ID of the exercise',
              example: 'exercise-123',
            },
            velocity: {
              type: 'number',
              description: 'Average velocity in m/s',
              example: 0.45,
            },
            metadata: {
              type: 'object',
              description: 'Optional metadata about the rep',
              example: { weight: 80.5, reps: 5, notes: 'Felt strong today' },
            },
          },
        },
        RepResponseDto: {
          type: 'object',
          required: ['id', 'exerciseId', 'velocity', 'timestamp'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the rep',
              example: 'rep-123',
            },
            exerciseId: {
              type: 'string',
              description: 'ID of the exercise',
              example: 'exercise-123',
            },
            velocity: {
              type: 'number',
              description: 'Average velocity in m/s',
              example: 0.45,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the rep was recorded',
              example: '2025-09-16T14:30:00.000Z',
            },
            metadata: {
              type: 'object',
              description: 'Optional metadata about the rep',
              example: { weight: 80.5, reps: 5, notes: 'Felt strong today' },
            },
          },
        },
        ApiError: {
          type: 'object',
          required: ['message', 'code', 'statusCode'],
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Validation failed',
            },
            code: {
              type: 'string',
              description: 'Error code',
              example: 'VALIDATION_ERROR',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 400,
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Velocity Zones',
        description: 'Operations related to velocity zone management',
      },
      {
        name: 'Reps',
        description: 'Operations related to exercise repetition tracking',
      },
    ],
  },
  apis: ['./src/presentation/controllers/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJSDoc(options);
