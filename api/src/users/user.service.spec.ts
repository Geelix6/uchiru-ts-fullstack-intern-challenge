import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create new user if not exists', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      const fakeUser = { id: '1', login: 'foo', password: 'hash' } as User;
      (repo.create as jest.Mock).mockReturnValue(fakeUser);
      (repo.save as jest.Mock).mockResolvedValue(fakeUser);

      const result = await service.create('foo', 'bar');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { login: 'foo' } });
      expect(repo.create).toHaveBeenCalledWith({
        login: 'foo',
        password: expect.any(String),
      });
      expect(repo.save).toHaveBeenCalledWith(fakeUser);
      expect(result).toEqual(fakeUser);
    });

    it('should throw ConflictException if user exists', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({
        id: '1',
        login: 'foo',
      } as User);

      await expect(service.create('foo', 'bar')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersArray = [
        { id: '1', login: 'foo', password: 'hash' } as User,
        { id: '2', login: 'bar', password: 'hash2' } as User,
      ];
      (repo.find as jest.Mock).mockResolvedValue(usersArray);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(usersArray);
    });
  });
});
