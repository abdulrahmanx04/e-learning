import { Max, Min } from "class-validator";
import { Users } from "src/auth/entities/auth.entity";
import { Enrollments } from "src/enrollment/entities/enrollment.entity";
import { Lessons } from "src/lessons/entities/lesson.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('lesson_progress')
@Index(['lessonId'])
@Index(['userId'])
export class LessonProgress {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string;

    @Column()
    lessonId: string;

    @Column({type: 'boolean',default: false})
    isCompleted: boolean

    @Column({ type: 'int', default: 0 })
    watchedDuration: number
    
    @Column({type: 'int', default: 0})
    @Min(0)
    @Max(100)
    progressPercentage: number
    

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date | null

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    lastAccessedAt: Date


    @ManyToOne(() => Lessons, lessons => lessons.lessonProgress,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'lessonId'})
    lesson: Lessons

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: Users

}
