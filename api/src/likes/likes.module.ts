import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Like } from './likes.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    UsersModule,
    AuthModule,
    HttpModule.register({
      baseURL: 'https://api.thecatapi.com/v1',
      headers: {
        'x-api-key': process.env.CAT_API_KEY,
      },
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
