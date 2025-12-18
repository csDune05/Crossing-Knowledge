import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword, verifyPassword } from './password.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
      fullName: createUserDto.fullName ?? '',
      phone: createUserDto.phone ?? '',
    });
    return this.hashAndSave(user);
  }

  async findByIdentifierWithPassword(identifier: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :identifier OR user.email = :identifier', {
        identifier,
      })
      .getOne();
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await hashPassword(updateUserDto.password);
      await this.userRepository.update(id, {
        ...updateUserDto,
        password: hashedPassword,
      });
    } else {
      await this.userRepository.update(id, updateUserDto);
    }
    return this.userRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.password.includes(':')) {
      const matches = user.password === password;
      if (matches) {
        await this.userRepository.update(user.id, {
          password: await hashPassword(password),
        });
      }
      return matches;
    }
    return verifyPassword(password, user.password);
  }

  private async hashAndSave(user: User) {
    user.password = await hashPassword(user.password);
    const saved = await this.userRepository.save(user);
    const { password, ...safeUser } = saved;
    return safeUser;
  }
}
