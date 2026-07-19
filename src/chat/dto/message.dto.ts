import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class MessageDto {
  @ApiProperty({
    description: 'ID of the user sending the message',
    example: 18,
  })
  @IsInt()
  @IsPositive()
  senderId: number;

  @ApiPropertyOptional({
    description: 'Optional target user for a direct message',
    example: 42,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  receiverId?: number;

  @ApiProperty({
    description: 'Identifier for the conversation where the message belongs',
    example: 8,
  })
  @IsInt()
  @IsPositive()
  conversationId: number;

  @ApiPropertyOptional({
    description: 'Optional image URL attached to the chat message',
    example: 'https://cdn.versityblend.app/chat/messages/42.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({
    description: 'Rich text message content sent in chat',
    example: 'Sending the files for the study group meeting now.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
} 