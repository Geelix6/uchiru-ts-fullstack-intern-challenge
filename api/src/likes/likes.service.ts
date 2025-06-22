import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Like } from './likes.entity';
import { User } from 'src/users/user.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly repo: Repository<Like>,
    private readonly http: HttpService,
  ) {}

  async findAll(user: User): Promise<Like[]> {
    return this.repo.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(user: User, dto: CreateLikeDto): Promise<Like> {
    const exists = await this.repo.findOne({
      where: { user: { id: user.id }, catId: dto.cat_id },
    });
    if (exists) {
      throw new ConflictException('Like already exists');
    }

    let resp: AxiosResponse<{ id: string; url: string }>;
    try {
      resp = await firstValueFrom(this.http.get(`/images/${dto.cat_id}`));
    } catch (err) {
      throw new NotFoundException('cat_id not found in TheCatAPI');
    }

    const { data } = resp;
    if (data.url !== dto.cat_url) {
      throw new NotFoundException('cat_url does not match TheCatAPI record');
    }

    const like = this.repo.create({
      user,
      catId: dto.cat_id,
      catUrl: dto.cat_url,
    });
    return this.repo.save(like);
  }

  async remove(user: User, catId: string): Promise<void> {
    const result = await this.repo.delete({
      user: { id: user.id },
      catId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Like not found');
    }
  }
}
