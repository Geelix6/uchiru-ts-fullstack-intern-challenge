import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Like } from 'src/likes/likes.entity';
import { User } from 'src/users/user.entity';
import * as request from 'supertest';

describe('Authentication & Error Scenarios E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User, Like],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    await request(app.getHttpServer())
      .post('/user')
      .send({ login: 'duplicate', password: 'pwd' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject duplicate user registration with 409', async () => {
    await request(app.getHttpServer())
      .post('/user')
      .send({ login: 'duplicate', password: 'pwd' })
      .expect(409)
      .expect((res) => {
        expect(res.body).toHaveProperty('statusCode', 409);
        expect(res.body).toHaveProperty('message');
      });
  });

  it('should return 401 for accessing /likes without token', async () => {
    await request(app.getHttpServer())
      .get('/likes')
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('statusCode', 401);
        expect(res.body).toHaveProperty('message');
      });
  });
});
