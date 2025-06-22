import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as TokenUtil from 'src/utils/generate-token.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create user, set token header and return 201', async () => {
    const dto: CreateUserDto = { login: 'user1', password: '123456' };
    const createdUser = { id: 'user1', login: dto.login, password: 'hashed' };
    const fakeToken = 'fake-token-123';

    (usersService.create as jest.Mock).mockResolvedValue(createdUser);
    jest.spyOn(TokenUtil, 'generateToken').mockReturnValue(fakeToken);

    const res: any = {
      set: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await controller.newUser(dto, res);

    expect(usersService.create).toHaveBeenCalledWith(dto.login, dto.password);
    expect(TokenUtil.generateToken).toHaveBeenCalledWith(createdUser.id);
    expect(res.set).toHaveBeenCalledWith('X-Auth-Token', fakeToken);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalled();
  });

  it('should propagate error from service.create', async () => {
    const dto: CreateUserDto = { login: 'user2', password: '123456' };
    const error = new ConflictException('User with this login already exists');
    (usersService.create as jest.Mock).mockRejectedValue(error);

    const res: any = {
      set: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await expect(controller.newUser(dto, res)).rejects.toBe(error);
    expect(usersService.create).toHaveBeenCalledWith(dto.login, dto.password);
    expect(res.set).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
