import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,

      private readonly uploadService: UploadService
  ){}

  async getUser(id: number){
    const user =  await this.userRepository.findOne({where: {id}})
    
    const {password, ...userWithoutPassword} = user
    return userWithoutPassword
  }

  async updateProfilePicture(file: Express.Multer.File, userId: number){
    const url = await this.uploadService.uploadImage(file, 'profiles')

    await this.userRepository.update(userId, {profilePicture: url})

    return {profilePicture: url}
  }
}
