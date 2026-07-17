import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Election } from "./election.entity";
import { User } from "src/user/entity/user.entity";

@Entity()
export class Candidate {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Election)
    election: Election

    @ManyToOne(() => User)
    user: User
}