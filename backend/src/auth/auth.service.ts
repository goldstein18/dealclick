import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { userHandle: registerDto.userHandle },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user with explicit field mapping (no specialties processing for now)
    const userData: any = {
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      userHandle: registerDto.userHandle,
      role: registerDto.role || 'agent',
    };

    // Add optional fields only if they exist
    if (registerDto.phone) userData.phone = registerDto.phone;
    if (registerDto.whatsappNumber) userData.whatsappNumber = registerDto.whatsappNumber;
    if (registerDto.company) userData.company = registerDto.company;
    if (registerDto.bio) userData.bio = registerDto.bio;
    if (registerDto.ubicacion) userData.ubicacion = registerDto.ubicacion;

    // Process specialties - convert string to array AFTER creating base object
    if (registerDto.specialties && registerDto.specialties.trim()) {
      try {
        const specialtiesArray = registerDto.specialties
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        if (specialtiesArray.length > 0) {
          userData.specialties = specialtiesArray;
        }
      } catch (err) {
        console.error('Error processing specialties, skipping:', err);
      }
    }

    const user = this.userRepository.create(userData);
    const savedUser: User = await this.userRepository.save(user) as User;

    // Generate token
    return this.generateToken(savedUser);
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    return this.generateToken(user);
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  generateToken(user: User) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      name: user.name,
      userHandle: user.userHandle,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userHandle: user.userHandle,
        avatar: user.avatar,
        role: user.role,
        company: user.company,
        whatsappNumber: user.whatsappNumber,
      },
    };
  }
}

