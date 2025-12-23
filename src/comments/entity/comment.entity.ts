import { Like } from "src/likes/entity/like.entity";
import { Post } from "src/posts/entity/posts.entity";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'text',
    nullable: false
  })
  text: string

  @ManyToOne(() => User, user => user.comments, {onDelete: 'CASCADE'})
  authorId: User
  
  @ManyToOne(() => Post, post => post.comments, {onDelete: 'CASCADE'})
  post: Post

  @OneToMany(() => Like, Like => Like.comment)
  likes: Like[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}