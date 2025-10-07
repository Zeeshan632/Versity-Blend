import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  about: string
}