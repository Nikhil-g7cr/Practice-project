import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../modules/app/app.module';
import { TransformInterceptor } from './interceptors/transform/transform.interceptor';
import cookieParser from 'cookie-parser';
// import { AllExceptionsFilter } from './guards/exception/exception.filter';

const logger = new Logger('Bootstrap');

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Enable cookie parser
  app.use(cookieParser());

  // Apply global pipes
  app.useGlobalPipes(new ValidationPipe());

  // Apply global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Apply global filters
  // app.useGlobalFilters(new AllExceptionsFilter());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API endpoints documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
