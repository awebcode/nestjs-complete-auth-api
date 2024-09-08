import { DocumentBuilder } from "@nestjs/swagger";

export const SwaggerOptions = new DocumentBuilder()
  .setTitle('Nest.js API')
  .setDescription('Nest.js API description')
  .setVersion('1.0')
  .addServer('http://localhost:3000/', 'Local environment')
  .addServer('https://asikur.api.com/', 'Staging')
  .addServer('https://production.asikur.api.com/', 'Production')
  .addTag('Nest API Tag')
  .addBearerAuth()
  .build();
