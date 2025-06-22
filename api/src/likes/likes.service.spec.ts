import { HttpService } from '@nestjs/axios';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './likes.entity';
import { LikesService } from './likes.service';
import { User } from '../users/user.entity';

describe('LikesService', () => {
  let service: LikesService;
  let likeRepo: Repository<Like>;
  let httpService: HttpService;

  const mockUser = { id: 'user-id', login: 'test-user' } as User;
  const mockLike = {
    id: 'like-id',
    catId: 'cat-id',
    catUrl: 'https://example.com/cat.jpg',
    createdAt: new Date(),
    user: mockUser,
  } as Like;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: getRepositoryToken(Like),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likeRepo = module.get<Repository<Like>>(getRepositoryToken(Like));
    httpService = module.get<HttpService>(HttpService);
  });

  describe('findAll', () => {
    it('should return user likes sorted by date', async () => {
      const likes = [mockLike, { ...mockLike, id: 'like-id-2' }];
      jest.spyOn(likeRepo, 'find').mockResolvedValue(likes);

      const result = await service.findAll(mockUser);

      expect(likeRepo.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(likes);
    });
  });

  describe('create', () => {
    const createDto: CreateLikeDto = {
      cat_id: 'cat-id',
      cat_url: 'https://example.com/cat.jpg',
    };

    it('should create a new like', async () => {
      jest.spyOn(likeRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(likeRepo, 'create').mockReturnValue(mockLike);
      jest.spyOn(likeRepo, 'save').mockResolvedValue(mockLike);
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: { id: createDto.cat_id, url: createDto.cat_url },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as any),
      );

      const result = await service.create(mockUser, createDto);

      expect(httpService.get).toHaveBeenCalledWith(
        `/images/${createDto.cat_id}`,
      );
      expect(likeRepo.create).toHaveBeenCalledWith({
        user: mockUser,
        catId: createDto.cat_id,
        catUrl: createDto.cat_url,
      });
      expect(result).toEqual(mockLike);
    });

    it('should throw ConflictException if like exists', async () => {
      jest.spyOn(likeRepo, 'findOne').mockResolvedValue(mockLike);

      await expect(service.create(mockUser, createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException for invalid cat_id', async () => {
      jest.spyOn(likeRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        throwError(() => ({
          response: { status: 404 },
        })),
      );

      await expect(service.create(mockUser, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for URL mismatch', async () => {
      jest.spyOn(likeRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: { id: createDto.cat_id, url: 'different-url' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as any),
      );

      await expect(service.create(mockUser, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a like', async () => {
      jest.spyOn(likeRepo, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(mockUser, 'cat-id');

      expect(likeRepo.delete).toHaveBeenCalledWith({
        user: { id: mockUser.id },
        catId: 'cat-id',
      });
    });

    it('should throw NotFoundException if like not found', async () => {
      jest.spyOn(likeRepo, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(mockUser, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
