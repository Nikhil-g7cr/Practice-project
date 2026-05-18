import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('API documentation for the application')
  .setVersion('1.0.0')
  .addBearerAuth()
  .addTag('Auth', 'Authentication endpoints')
  .addTag('Users', 'User management endpoints')
  .addTag('Phones', 'Phone management endpoints')
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};
