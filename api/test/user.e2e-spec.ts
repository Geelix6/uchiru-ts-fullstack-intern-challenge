import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Like } from 'src/likes/likes.entity';
import { User } from 'src/users/user.entity';
import * as request from 'supertest';

describe('UserController E2E', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register new user and return X-Auth-Token header', async () => {
    const res = await request(app.getHttpServer())
      .post('/user')
      .send({ login: 'newuser', password: 'pass123' })
      .expect(201);

    expect(res.headers).toHaveProperty('x-auth-token');
    expect(typeof res.headers['x-auth-token']).toBe('string');
  });

  it('should reject registration with missing fields (400)', async () => {
    await request(app.getHttpServer())
      .post('/user')
      .send({ login: '' })
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('statusCode', 400);
        expect(res.body).toHaveProperty('message');
        expect(Array.isArray(res.body.message)).toBe(true);
      });
  });

  it('should reject duplicate registration with 409', async () => {
    await request(app.getHttpServer())
      .post('/user')
      .send({ login: 'dupuser', password: 'pwd' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/user')
      .send({ login: 'dupuser', password: 'pwd' })
      .expect(409)
      .expect((res) => {
        expect(res.body).toHaveProperty('statusCode', 409);
        expect(res.body).toHaveProperty('message');
      });
  });
});
