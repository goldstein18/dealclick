import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('biometric-login')
  @UseGuards(JwtAuthGuard)
  biometricLogin(@Request() req) {
    // Biometric authentication happens on the client
    // This endpoint just returns a new token for the authenticated user
    return this.authService.generateToken(req.user);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@Request() req) {
    return this.authService.generateToken(req.user);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}

