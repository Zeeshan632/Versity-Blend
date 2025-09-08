import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUniversityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  domain: string;

  @IsOptional()
  @IsString()
  abbreviation?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}