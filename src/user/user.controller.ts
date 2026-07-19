import { Controller, Get, Param, ParseIntPipe, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/upload/file-validation.pipe';
import { AuthenticatedRequest } from 'src/types/express';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiOkResponse({ description: 'User profile retrieved successfully' })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUser(id);
  }

  @Patch('/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update user profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Profile picture updated successfully' })
  async updateProfilePicture(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ){
    return this.userService.updateProfilePicture(file, req.user.userId)
  }
}
