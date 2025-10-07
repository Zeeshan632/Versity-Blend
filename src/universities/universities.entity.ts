import { Group } from 'src/groups/entity/group.entity';
import { Post } from 'src/posts/entity/posts.entity';
import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  domain: string;

  @Column({ nullable: true })
  abbreviation: string;

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => User, user => user.university)
  users: User[]

  @OneToMany(() => Group, group => group.university)
  groups: Group[]

  @OneToMany(() => Post, post => post.university)
  posts: Post[]
  
  @CreateDateColumn({type: 'timestamp with time zone'})
  createdAt: Date

  @UpdateDateColumn({type: 'timestamp with time zone'})
  updatedAt: Date
}
