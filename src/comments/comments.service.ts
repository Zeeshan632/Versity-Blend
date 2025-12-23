import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    private readonly eventEmitter: EventEmitter2
    
  ) {}

  async createComment(
    postId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const createdComment = this.commentRepo.create({
      text: createCommentDto.text,
      authorId: { id: userId },
      post: { id: postId },
    });
    try {
      await this.commentRepo.save(createdComment);
      this.eventEmitter.emit('user.createdComment', {userId, postId})
    } catch (err) {
      throw new InternalServerErrorException('Failed to created comment!');
    }
    return { success: true, message: 'Comment created successfully!' };
  }

  async updateComment(commentId: number, updateCommentDto: UpdateCommentDto) {
    const updatedComment = await this.commentRepo.update(commentId, {
      text: updateCommentDto.text,
    });

    if (updatedComment.affected === 0) {
      throw new NotFoundException('The comment does not exist!');
    }

    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });
    return { success: true, message: 'Comment updated successfully!', comment };
  }

  async deleteComment(commentId: number, authorId: number) {
    const ifTheCommentBelongsToUser = await this.commentRepo.findOne({where: {id: commentId, authorId: {id: authorId}}})

    if(!ifTheCommentBelongsToUser){
      throw new ForbiddenException('You are not allowed to delete this comment!')
    }
    const deletedComment = await this.commentRepo.delete(commentId);

    if (deletedComment.affected === 0) {
      throw new NotFoundException('Comment does not exist!');
    }
    
    this.eventEmitter.emit('user.commentDeleted', {commentId, authorId})
    return { success: true, message: 'Comment deleted successfully!' };
  }

  async getCommentsOfAPost(postId: number) {
    const comments = await this.commentRepo.find({
      where: { post: { id: postId } },
      relations: { authorId: true },
      order: {createdAt: 'DESC'}
    });

    return {
      success: true,
      message: 'Comments fetched successfully!',
      comments,
    };
  }
}
