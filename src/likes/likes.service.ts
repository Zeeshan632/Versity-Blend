import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entity/like.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    private readonly eventEmitter: EventEmitter2
  ){}

  async likePost(postId: number, userId: number){
    const alreadyLiked = await this.likeRepo.findOne({where: {post: {id: postId}, user: {id: userId}}})

    if(alreadyLiked){
      await this.likeRepo.delete(alreadyLiked.id)
      this.eventEmitter.emit('user.deletedLikeOnPost', {userId, postId})
      return {success: true, message: 'Your like on the post is deleted successfully!'}
    }

    const createdLike = this.likeRepo.create({post: {id: postId}, user: {id: userId}})
    await this.likeRepo.save(createdLike)

    this.eventEmitter.emit('user.likedPost', {userId, postId})
    
    return {success: true, message: 'The post is liked successfully!'}
  }
  
  async getAllLikesOfAPost(postId: number){
    const likes = await this.likeRepo.find({where: {post: {id: postId}}, relations: {user: true}})
    return {success: true, likesCount: likes.length, likes}
  }

  async getUserLikedPosts(userId: number){
    const likes = await this.likeRepo.find({where: {user: {id: userId}}, relations: ['post']})
    const likedPosts = likes.map(like => like.post)
    return {success: true, likedPostsCount: likedPosts.length, likedPosts}
  }

  async likeComment(commentId: number, userId: number){
    const commentAlreadyLiked = await this.likeRepo.findOne({where: {comment: {id: commentId}, user: {id: userId}}})

    if(commentAlreadyLiked){
      await this.likeRepo.delete(commentAlreadyLiked.id)
      this.eventEmitter.emit('user.deletedLikeOnComment', {userId, commentId})
      return {success: true, message: 'Your like on the comment is deleted successfully!'}
    }
    
    const commentLiked = this.likeRepo.create({
      comment: {id: commentId},
      user: {id: userId}
    })

    try {
      await this.likeRepo.save(commentLiked)
      this.eventEmitter.emit('user.likedComment', {userId, commentId})
      return {success: true, message: 'Comment liked successfully!'}
    }catch(err){
      throw new InternalServerErrorException('Something went wrong while liking the comment!')
    }
  }

  async getAllLikesOfAComment(commentId: number){
    const likesOfAComment = await this.likeRepo.find({where: {comment: {id: commentId}}, relations: {user: true}})
    if(likesOfAComment.length <= 0){
      return {success: false, message: 'No results found!'}
    }
    return {success: true, likesCount: likesOfAComment.length, likesOfAComment}
  }

}
