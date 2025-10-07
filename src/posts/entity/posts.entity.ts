import { Group } from "src/groups/entity/group.entity";
import { Like } from "src/likes/entity/like.entity";
import { University } from "src/universities/universities.entity";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'text',
    nullable: false,
  })
  text: string

  @Column({type: 'text', array: true, nullable: true})
  images: string[]

  @Column({type: 'boolean', default: false})
  global: boolean

  @ManyToOne(() => User, user => user.posts)
  author: User

  @ManyToOne(() => Group, group => group.posts, {nullable: true})
  group: Group

  @ManyToOne(() => University, university => university.posts)
  university: University

  @OneToMany(() => Like, like => like.post)
  likes: Like[]

  @CreateDateColumn({type: 'timestamp with time zone'})
  createdAt: Date

  @UpdateDateColumn({type: 'timestamp with time zone'})
  updatedAt: Date
}