import { University } from "src/universities/universities.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(() => University, university => university.users)
  university: University
}