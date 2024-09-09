import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerOptions } from './config/SwaggerOptions';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './exceptions/filters/http-exception-filter';
import * as express from 'express';
import { GqlExceptionFilter } from './exceptions/filters/gql-exception-filter';

// Express-based bootstrap function
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Default is Express

  // Enable CORS
  app.enableCors({ origin: '*', credentials: true });
  app.use(express.json());
  // Serve static files with Express
  app.use('/public', express.static(join(__dirname, 'public')));

  // Register cookie-parser for Express
  app.use(cookieParser());

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
      
      
      exceptionFactory: errors => {
        return new BadRequestException(
          errors.map(error => ({
            [error.property]: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }),
  );

  // Set up global exception filter
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalFilters(new GqlExceptionFilter());

  // Set up Swagger documentation
  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, SwaggerOptions));

  // Set the global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Start the server
  await app.listen(process.env.PORT || 6000, async () => {
    console.log(`Application is running on: http://localhost:${process.env.PORT || 6000}`);
  });
}

bootstrap();
