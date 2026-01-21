import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CourseEnrollmentController, EnrollmentController } from './enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/auth.entity';
import { Courses } from 'src/courses/entities/course.entity';
import { Enrollments } from './entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users,Courses,Enrollments])],
  controllers: [EnrollmentController,CourseEnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentsModule {}
