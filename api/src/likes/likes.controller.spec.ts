import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeResponseDto } from './dto/like-response-dto';
import { LikesController } from './likes.controller';
import { Like } from './likes.entity';
import { LikesService } from './likes.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

describe('LikesController', () => {
  let controller: LikesController;
  let likesService: LikesService;

  const mockUser = { id: 'user-id' } as User;
  const mockReq = { user: mockUser } as AuthenticatedRequest;
  const mockLike = {
    id: 'like-id',
    catId: 'cat-id',
    catUrl: 'https://example.com/cat.jpg',
    createdAt: new Date(),
  } as Like;

  const mockResponseDto: LikeResponseDto = {
    cat_id: mockLike.catId,
    cat_url: mockLike.catUrl,
    created_at: mockLike.createdAt.toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        {
          provide: LikesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LikesController>(LikesController);
    likesService = module.get<LikesService>(LikesService);
  });

  describe('listLikes', () => {
    it('should return formatted likes', async () => {
      const likes = [mockLike, { ...mockLike, id: 'like2' }];
      jest.spyOn(likesService, 'findAll').mockResolvedValue(likes);

      const result = await controller.listLikes(mockReq);

      expect(likesService.findAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        data: likes.map((like) => ({
          cat_id: like.catId,
          cat_url: like.catUrl,
          created_at: like.createdAt.toISOString(),
        })),
      });
    });
  });

  describe('newLike', () => {
    const createDto: CreateLikeDto = {
      cat_id: 'cat-id',
      cat_url: 'https://example.com/cat.jpg',
    };

    it('should create and return a like', async () => {
      jest.spyOn(likesService, 'create').mockResolvedValue(mockLike);

      const result = await controller.newLike(mockReq, createDto);

      expect(likesService.create).toHaveBeenCalledWith(mockUser, createDto);
      expect(result).toEqual(mockResponseDto);
    });
  });

  describe('dropLike', () => {
    it('should delete a like', async () => {
      jest.spyOn(likesService, 'remove').mockResolvedValue(undefined);

      await controller.dropLike(mockReq, 'cat-id');

      expect(likesService.remove).toHaveBeenCalledWith(mockUser, 'cat-id');
    });

    it('should propagate error from service.remove', async () => {
      const error = new NotFoundException('Like not found');
      jest.spyOn(likesService, 'remove').mockRejectedValue(error);

      await expect(controller.dropLike(mockReq, 'cat-id')).rejects.toBe(error);
      expect(likesService.remove).toHaveBeenCalledWith(mockUser, 'cat-id');
    });
  });
});
