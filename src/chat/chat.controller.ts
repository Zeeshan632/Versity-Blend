import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedRequest } from 'src/types/express';
import { FileValidationPipe } from 'src/upload/file-validation.pipe';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}
    
    @Post('send-image')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Upload and send an image in chat' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @ApiCreatedResponse({ description: 'Image uploaded and sent successfully' })
    async sendImage(
        @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
        @Req() req: AuthenticatedRequest
    ){
        return await this.chatService.uploadImage(image)
    }
}
