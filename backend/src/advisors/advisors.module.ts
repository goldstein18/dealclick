import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../properties/entities/property.entity';
import { User } from '../users/entities/user.entity';
import { AdvisorsController } from './advisors.controller';
import { AdvisorsService } from './advisors.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property])],
  controllers: [AdvisorsController],
  providers: [AdvisorsService],
  exports: [AdvisorsService],
})
export class AdvisorsModule {}

