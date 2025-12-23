import { Comment } from "src/comments/entity/comment.entity";
import { Post } from "src/posts/entity/posts.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.likes, {onDelete: 'CASCADE'})
  user: User

  @ManyToOne(() => Post, post => post.likes, {onDelete: 'CASCADE'})
  post: Post

  @ManyToOne(() => Comment, comment => comment.likes, {onDelete: 'CASCADE'})
  comment: Comment
}