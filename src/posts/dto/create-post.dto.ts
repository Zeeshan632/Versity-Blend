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

  @IsInt()
  @IsOptional()
  groupId: number;

  @IsBoolean()
  @IsOptional()
  global: boolean;
}
