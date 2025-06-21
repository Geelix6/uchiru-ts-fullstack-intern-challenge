import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(login: string, plainPassword: string): Promise<User> {
    const exists = await this.repo.findOne({ where: { login } });

    if (exists) {
      throw new ConflictException('User with this login already exists');
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const user = this.repo.create({ login, password: passwordHash });

    return this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }
}
