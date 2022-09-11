import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Mentor extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    name: string

    @Field()
    @Column({ unique: true })
    email!: string

    @Column()
    password!: string

    @Field(() => [User])
    @OneToMany(() => User, user => user.mentor)
    users: User[]

    @Field()
    @Column({ default: 0 })
    noOfUsers: number

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date

    @Field()
    @Column({type: "decimal", default: 0})
    rating: number

    @Field()
    @Column({ default: true })
    freeToWork: boolean
}