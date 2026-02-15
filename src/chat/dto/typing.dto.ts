import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class TypingDto {
  @IsNumber()
  @IsNotEmpty()
  universityId: number
  
  @IsBoolean()
  @IsNotEmpty()
  typing: boolean
}