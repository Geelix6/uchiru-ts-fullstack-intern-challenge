import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as nock from 'nock';
import { AppModule } from 'src/app.module';
import { Like } from 'src/likes/likes.entity';
import { User } from 'src/users/user.entity';
import * as request from 'supertest';

describe('LikesController E2E (SQLite + Supertest)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/user')
      .send({ login: 'e2e-user', password: 'secret' })
      .expect(201);
    token = res.header['x-auth-token'];
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST/GET/DELETE and extra DELETE /likes flow', async () => {
    const catId = 'cat';
    const catUrl = 'https://cdn.thecatapi.com/images/cat.jpg';

    nock('https://api.thecatapi.com')
      .get(`/v1/images/${catId}`)
      .reply(200, { id: catId, url: catUrl });

    await request(app.getHttpServer())
      .post('/likes')
      .set('Authorization', `Bearer ${token}`)
      .send({ cat_id: catId, cat_url: catUrl })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/likes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0]).toMatchObject({ cat_id: catId });

    await request(app.getHttpServer())
      .delete(`/likes/${catId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/likes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, { data: [] });

    await request(app.getHttpServer())
      .delete('/likes')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect((res) => {
        expect(res.body).toHaveProperty('statusCode', 404);
        expect(res.body).toHaveProperty('message');
      });
  });
});
