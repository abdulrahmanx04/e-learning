import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lessons } from 'src/lessons/entities/lesson.entity';
import { LessonProgress } from './entities/progress.entity';
import { Enrollments } from 'src/enrollment/entities/enrollment.entity';
import { Users } from 'src/auth/entities/auth.entity';
import { Courses } from 'src/courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonProgress,Lessons,Enrollments,Courses])],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
