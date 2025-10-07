import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entity/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>
  ){}

  async likePost(postId: number, userId: number){
    const createdPost = this.likeRepo.create({post: {id: postId}, user: {id: userId}})
    await this.likeRepo.save(createdPost)
    return {success: true, message: 'The post is liked successfully!'}
  }

  async deleteLike(likeId: number){
    const likeExists = this.likeRepo.find({where: {id: likeId}})
    if(!likeExists){
      throw new ConflictException('No like exists with this like id!')
    }
    await this.likeRepo.delete(likeId)
    return {success: true, message: 'The like has been successfully deleted!'}
  }
}
