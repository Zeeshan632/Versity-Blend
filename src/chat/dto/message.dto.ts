import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class MessageDto {
  @IsNumber()
  @IsNotEmpty()
  senderId: number

  @IsNumber()
  @IsOptional()
  receiverId?: number
  
  @IsNumber()
  @IsNotEmpty()
  conversationId: number

  @IsString()
  @IsNotEmpty()
  message: string
} 