import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { university: true },
    });

    const newPost = this.postRepository.create({
      text: createPostDto.text,
      global: createPostDto.global ?? false,
      images: createPostDto.images ?? [],
      author: { id: userId },
      university: !createPostDto.global ? { id: user.university.id } : null,
    });

    const newPostCreated = await this.postRepository.save(newPost);

    return this.postRepository.findOne({
      where: { id: newPostCreated.id },
      relations: { university: true, author: true },
    });
  }

  async editPost(id: number, updatePostDto: Partial<CreatePostDto>, userId: number) {
    const postExists = await this.postRepository.findOne({ where: { id }, relations: { author: true } });

    if (!postExists) {
      throw new NotFoundException('No post with this id exists!');
    }

    if(postExists.author.id !== userId){
      throw new ForbiddenException('You are not allowed to edit this post!')
    }
    
    try {      
      await this.postRepository.update(id, updatePostDto);
      return await this.postRepository.find({where: {id}})
      
    }catch(err){
      throw new InternalServerErrorException('Failed to update the post!')
    }
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('No post found with this id!');
    }

    return post;
  }

  async getPostsOfAUser(userId: number, page: number, limit: number) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { author: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPostsOfAUniversity(
    univesityId: number,
    page: number,
    limit: number,
  ) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { university: { id: univesityId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllGlobalPosts(page: number, limit: number) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { global: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
