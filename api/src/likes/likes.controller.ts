import {
  Controller,
  UseGuards,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { LikesService } from './likes.service';
import { LikeResponseDto } from './dto/like-response-dto';
import { CreateLikeDto } from './dto/create-like.dto';

@UseGuards(AuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  async listLikes(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ data: LikeResponseDto[] }> {
    const likes = await this.likesService.findAll(req.user);
    const data: LikeResponseDto[] = likes.map((like) => ({
      cat_id: like.catId,
      cat_url: like.catUrl,
      created_at: like.createdAt.toISOString(),
    }));
    return { data };
  }

  @Post()
  async newLike(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateLikeDto,
  ): Promise<LikeResponseDto> {
    const like = await this.likesService.create(req.user, dto);
    return {
      cat_id: like.catId,
      cat_url: like.catUrl,
      created_at: like.createdAt.toISOString(),
    };
  }

  @Delete(':cat_id')
  async dropLike(
    @Req() req: AuthenticatedRequest,
    @Param('cat_id') catId: string,
  ): Promise<void> {
    await this.likesService.remove(req.user, catId);
  }
}
