import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Courses } from "src/courses/entities/course.entity";
import { Enrollments, EnrollStatus } from "src/enrollment/entities/enrollment.entity";
import { Repository } from "typeorm";

@Injectable()
export class ActiveEnrollment implements CanActivate {
    constructor(
        @InjectRepository(Enrollments) private enrollRepo: Repository<Enrollments>,
        @InjectRepository(Courses) private courseRepo: Repository<Courses>
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>   {
        const request= context.switchToHttp().getRequest() 
        const userId= request.user.id
        const courseId = request.params.courseId;
           
        
        if (!userId  || !courseId) {
            throw new ForbiddenException('Missing user or course');
        }
        
        if(request.user.role === 'instructor') {
            const course= await this.courseRepo.findOne({
                where: {
                    id: courseId,
                    userId
                }
            })
            if(!course) {
                throw new ForbiddenException('Not your course')
            }
            return true
        }
        if(request.user.role === 'admin'){
            return true
        }
        
        const count = await this.enrollRepo.count({
            where: {
                userId,
                courseId,
                status: EnrollStatus.ACTIVE
            }
        })
        if(count === 0){
            throw new ForbiddenException('You must be enrolled in this course')
        }
        return true
    }
}