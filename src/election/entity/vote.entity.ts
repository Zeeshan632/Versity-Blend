import { User } from "src/user/entity/user.entity";
import { CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Election } from "./election.entity";
import { Candidate } from "./candidate.entity";

@Entity()
export class Vote{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Election)
    election: Election;
    
    @ManyToOne(() => User)
    voter: User

    @ManyToOne(() => Candidate)
    candidate: Candidate

    @CreateDateColumn()
    votedAt: Date
}