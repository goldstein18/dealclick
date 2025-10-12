import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['properties', 'requirements'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Don't return password
    delete user.password;
    return user;
  }

  async findByHandle(userHandle: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userHandle },
      relations: ['properties', 'requirements'],
    });

    if (!user) {
      throw new NotFoundException(`User with handle @${userHandle} not found`);
    }

    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, requestUserId: string): Promise<User> {
    if (id !== requestUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    
    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;
    
    return updatedUser;
  }
}

