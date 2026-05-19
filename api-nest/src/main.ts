import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerOptions } from './core/swagger/doc.swagger';
import cookieParser from 'cookie-parser';
// import { AllExceptionsFilter } from './core/guards/exception/exception.filter';

async function bootstrap() {
  console.log('🚀 Starting application bootstrap...');

  const app = await NestFactory.create(AppModule);
  console.log('AppModule created successfully');

  const port = process.env.PORT ?? 3000;
  console.log(`Port configured: ${port}`);

  // Dynamic CORS configuration with correct port
  const corsConfig = {
    origin: process.env.CORS_ORIGIN || `http://localhost:${port}`,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  console.log('CORS configured:', corsConfig.origin);

  app.enableCors(corsConfig);
  app.use(cookieParser());

  // Apply global exception filter
  // app.useGlobalFilters(new AllExceptionsFilter()); 

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`\nServer is running on http://localhost:${port}`);
  console.log(
    `Swagger UI is available at http://localhost:${port}/api/docs\n`,
  );
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
