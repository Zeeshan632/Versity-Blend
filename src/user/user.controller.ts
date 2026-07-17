import { Controller, Get, Param, ParseIntPipe, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/upload/file-validation.pipe';
import { AuthenticatedRequest } from 'src/types/express';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUser(id);
  }

  @Patch('/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ){
    return this.userService.updateProfilePicture(file, req.user.userId)
  }

}
