import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { generateToken } from 'src/utils/generate-token.util';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async newUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(dto.login, dto.password);
    const token = generateToken(user.id);

    res.set('X-Auth-Token', token);
    return res.status(HttpStatus.CREATED).send();
  }
}
