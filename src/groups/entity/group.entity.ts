import { Post } from "src/posts/entity/posts.entity";
import { University } from "src/universities/universities.entity";
import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['name', 'university'])
export class Group{
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'citext'})
  name: string

  @Column()
  about: string
  
  @CreateDateColumn({type: 'timestamp with time zone'})
  createdAt: Date

  @UpdateDateColumn({type: 'timestamp with time zone'})
  updatedAt: Date
  
  @ManyToOne(() => User, user => user.adminOfGroups)
  admin: User

  @ManyToMany(() => User, user => user.memberOfGroups )
  @JoinTable()
  members: User[]

  @ManyToOne(() => University, university => university.groups)
  university: University

  @OneToMany(() => Post, post => post.group)
  posts: Post[]
}