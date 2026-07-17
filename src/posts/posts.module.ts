import { Module} from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/posts.entity';
import { Group } from 'src/groups/entity/group.entity';
import { User } from 'src/user/entity/user.entity';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Group, User]), UploadModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
