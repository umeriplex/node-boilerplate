import swaggerJsDoc from 'swagger-jsdoc';
import env from './env';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise Backend API',
      version: '1.0.0',
      description: 'API documentation for the backend boilerplate',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Development Server',
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/docs/**/*.ts', './src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
