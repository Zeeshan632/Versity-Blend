import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images: string[];

  @IsBoolean()
  @IsOptional()
  global: boolean;
}
