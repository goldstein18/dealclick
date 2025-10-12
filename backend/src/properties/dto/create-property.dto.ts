import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  propertyType: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  beds?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  baths?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  area?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  parking?: number;

  @IsNumber()
  @IsOptional()
  yearBuilt?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}

