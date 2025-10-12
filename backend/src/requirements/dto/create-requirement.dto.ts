import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRequirementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  requirement: string;

  @IsString()
  @IsOptional()
  propertyType?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  budget?: string;
}

