import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get('version')
  getVersion() {
    // Puedes controlar esto desde variables de entorno en Railway
    const currentVersion = this.configService.get('APP_VERSION', '1.0.0');
    const minimumVersion = this.configService.get('MINIMUM_APP_VERSION', '1.0.0');
    const updateRequired = this.configService.get('FORCE_UPDATE', 'false') === 'true';
    const updateMessage = this.configService.get(
      'UPDATE_MESSAGE',
      'Tu app está actualizada'
    );

    return {
      currentVersion,
      minimumVersion,
      updateRequired,
      updateUrl: 'https://dealclick.app/download',
      message: updateMessage,
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

