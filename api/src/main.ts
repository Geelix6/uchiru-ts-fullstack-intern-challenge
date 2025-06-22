import { readFileSync } from 'fs';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as yaml from 'js-yaml';
import * as swaggerUi from 'swagger-ui-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const specPath = join(__dirname, '../../openapi.yaml');
  const spec = yaml.load(readFileSync(specPath, 'utf8'));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('Swagger UI available at /docs');

  await app.listen(3000);
}
bootstrap();
