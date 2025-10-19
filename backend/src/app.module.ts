import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvisorsModule } from './advisors/advisors.module';
import { AppController } from './app/app.controller';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { RequirementsModule } from './requirements/requirements.module';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-1-us-east-1.pooler.supabase.com',
      port: 5432,
      username: 'postgres.nheefvchtxtetadwiwin',
      password: 'BABAsali25!gold',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: ['error', 'warn'],
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        max: 10,
        connectionTimeoutMillis: 10000,
      },
    }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    RequirementsModule,
    AdvisorsModule,
    StorageModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

