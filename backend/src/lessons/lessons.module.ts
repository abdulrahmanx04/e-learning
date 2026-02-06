import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lessons } from './entities/lesson.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Courses } from 'src/courses/entities/course.entity';
import { Enrollments } from 'src/enrollment/entities/enrollment.entity';
import { LessonProgress } from 'src/progress/entities/progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lessons,Courses,Enrollments]),CloudinaryModule],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
