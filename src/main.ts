import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import  fastifyCookie  from '@fastify/cookie';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerOptions } from './config/SwaggerOptions';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { CustomExceptionFilter } from './exceptions/filters/http-exception-filter';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // app.enableCors();
  app.enableCors({ origin: '*', credentials: true });
  // Serve static files
  app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default is '/'
  });

  // Register the fastify-cookie plugin
  await app.register(fastifyCookie);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Automatically remove properties that are not defined in DTO
      exceptionFactory: errors => {
        return new BadRequestException(
          errors.map(error => ({
            [error.property]: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }),
  );
  app.useGlobalFilters(new CustomExceptionFilter());
  // Swagger Documentation

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, SwaggerOptions));
  //* Set the global prefix for all route
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT || 6000, async (_, address) => {
    console.log(`Application is running on: ${address}`);
  });
}
bootstrap();
