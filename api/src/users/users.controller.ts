import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { generateToken } from 'src/utils/generate-token.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async newUser(
    @Body() dto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.usersService.create(dto.login, dto.password);
    const token = generateToken(user.id);

    res.set('X-Auth-Token', token);
    res.status(HttpStatus.CREATED).send();
  }
}
