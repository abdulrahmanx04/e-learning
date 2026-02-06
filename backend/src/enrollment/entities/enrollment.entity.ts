import { Max, Min } from "class-validator";
import { Users } from "src/auth/entities/auth.entity";
import { Courses } from "src/courses/entities/course.entity";
import { Payment } from "src/payments/entities/payment.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";


export enum EnrollStatus {
    PENDING = 'pending',
    ACTIVE= 'active',
    COMPLETED= 'completed',
    DROPPED= 'dropped'
}
@Entity('enrollments')
@Unique(['userId','courseId'])
@Index(['userId','status'])
@Index(['courseId','status'])
export class Enrollments {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Users, user => user.enrollments,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: Users

    @Column()
    userId: string

    @ManyToOne(() => Courses, course => course.enrollments,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'courseId'})
    course: Courses

    @Column()
    courseId: string

    @OneToMany(() => Payment, payment => payment.enrollment)
    payments: Payment[]

    @Column({type: 'enum', enum: EnrollStatus, default: EnrollStatus.PENDING})
    status: EnrollStatus


    

    @Column({type: 'timestamp',nullable: true})
    completedAt: Date 

    @Column({ type: 'timestamp', nullable: true })
    lastAccessedAt: Date

    @Column({ default: false }) 
    certificateEarned: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
