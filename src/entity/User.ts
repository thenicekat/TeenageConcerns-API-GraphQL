import { Field, ObjectType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity } from "typeorm"
import { Mentor } from './Mentor';

@Entity()
@ObjectType()
export class User extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    uuid: string

    @Field()
    @Column()
    mentorId: number

    @Field(() => Mentor)
    @ManyToOne(() => Mentor, mentor => mentor.users)
    mentor: Mentor

    @Field()
    @Column({type: "decimal", default: 0})
    rating: number

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date
}
