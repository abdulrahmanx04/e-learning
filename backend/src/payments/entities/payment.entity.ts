import { Users } from "src/auth/entities/auth.entity";
import { Enrollments } from "src/enrollment/entities/enrollment.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



export enum PaymentStatus {
    PENDING= 'pending',
    SUCCESS= 'success',
    FAILED= 'failed',
    REFUNDED= 'refunded',
    EXPIRED= 'expires'
}

export enum Currency {
    EGP= 'EGP',
    USD= 'USD',
}
@Entity('payments')
@Index(['stripeSessionId'], {unique: true})
@Index(['paymentIntentId'], {unique: true})
@Index(['userId'])
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'enum',enum: PaymentStatus, default: PaymentStatus.PENDING})
    status: PaymentStatus


    @Column({nullable: true})
    stripeSessionId: string

    @Column({nullable: true})
    paymentIntentId: string
    
    @Column({ nullable: true })
    failureMessage?: string;

    @Column({type: 'date', nullable: true})
    refundRequestedAt: Date


     @Column({type: 'date', nullable: true})
     refundedAt: Date


    @Column({type: 'decimal', precision: 10, scale: 2})
    amount: number

    @Column({type: 'decimal',precision: 10,scale: 2,nullable: true})
    refundAmount: number

    @Column({ type: 'enum', enum: Currency, default: Currency.EGP })
    currency: Currency;

    @ManyToOne(() => Users, user => user.payments,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: Users

    @ManyToOne(() => Enrollments, enroll => enroll.payments,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'enrollId'})
    enrollment: Enrollments

    @Column({name: 'enrollId'})
    enrollId: string

    @Column()
    userId: string


    @CreateDateColumn()
    createdAt: Date


    @UpdateDateColumn()
    updatedAt: Date

}
