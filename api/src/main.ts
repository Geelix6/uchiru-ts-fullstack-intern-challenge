import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: () => {
        throw new HttpException(
          {
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            message: 'Invalid input',
          },
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
