import { Exclude } from "class-transformer";
import { Group } from "src/groups/entity/group.entity";
import { Like } from "src/likes/entity/like.entity";
import { Post } from "src/posts/entity/posts.entity";
import { University } from "src/universities/universities.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    nullable: false,
    length: 25,
    unique: true
  })
  username: string

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    unique: true
  })
  email: string

  @Exclude()
  @Column({
    type: 'text',
  })
  password: string

  @Column({
    type: 'varchar',
  })
  name: string

  @Column({
    type: 'text',
  })
  bio: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole

  @Column({
    type: 'text'
  })
  profilePicture: string

  @CreateDateColumn({type: 'timestamp with time zone'})
  createdAt: Date

  @UpdateDateColumn({type: 'timestamp with time zone'})
  updatedAt: Date

  @ManyToOne(() => University, university => university.users)
  university: University

  @OneToMany(() => Group, group => group.admin)
  adminOfGroups: Group[]

  @ManyToMany(() => Group, group => group.members)
  memberOfGroups: Group[]

  @OneToMany(() => Post, post => post.author)
  posts: Post[]

  @OneToMany(() => Like, like => like.user)
  likes: Like[]
}