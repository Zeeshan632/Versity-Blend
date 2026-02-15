import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GroupMessageDto {
  @IsNumber()
  @IsNotEmpty()
  universityId: number
  
  @IsString()
  @IsNotEmpty()
  text: string
} 