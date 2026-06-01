import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class MessageDto {
  @IsInt()
  @IsPositive()
  senderId: number
  
  @IsInt()
  @IsPositive()
  @IsOptional()
  receiverId?: number
  
  @IsInt()
  @IsPositive()
  conversationId: number

  @IsString()
  @IsNotEmpty()
  message: string
} 