import { ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Group } from 'src/groups/entity/group.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async createPost(createPostDto: CreatePostDto, userId: number){

    const user = await this.userRepository.findOne({where: {id: userId}, relations: {university: true}})

    if(createPostDto.groupId){
      const groupExists = await this.groupRepository.findOne({where: {id: createPostDto.groupId}})
      if(!groupExists){
        throw new NotFoundException('No group with this group id exists!')
      }
    }

    const newPost = this.postRepository.create({
      text: createPostDto.text,
      global: createPostDto.global ?? false,
      images: createPostDto.images ?? [],
      group: createPostDto.groupId ? {id: createPostDto.groupId} : null,
      author: {id: userId},
      university: {id: user.university.id}
    })

    const newPostCreated = await this.postRepository.save(newPost)

    return this.postRepository.findOne({where: {id: newPostCreated.id}, relations: {university: true, author: true, group: true}})
  }

  async editPost(id: number, updatePostDto: Partial<CreatePostDto>){
    const postExists = await this.postRepository.find({where: {id}})

    if(!postExists){
      throw new NotFoundException('No post with this id exists!')
    }

    return await this.postRepository.update(id, updatePostDto)
  }
}
