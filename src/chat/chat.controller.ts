import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedRequest } from 'src/types/express';
import { FileValidationPipe } from 'src/upload/file-validation.pipe';
import { ChatService } from './chat.service';

@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}
    
    @Post('send-image')
    @UseInterceptors(FileInterceptor('image'))
    async sendImage(
        @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
        @Req() req: AuthenticatedRequest
    ){
        return await this.chatService.uploadImage(image)
    }
}
