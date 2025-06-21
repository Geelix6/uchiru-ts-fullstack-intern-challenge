import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Like } from './likes.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UsersModule, AuthModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
