import { Expose, Transform, Type } from "class-transformer";
import { EnrollStatus } from "../entities/enrollment.entity";

export class InstructorDto {
    @Expose()
    name: string
    @Expose()
    avatar: string | null
}
export class CourseDto {
        @Expose()
        id: string

        @Expose()
        title: string

        @Expose()
        description: string

        @Expose()
        @Transform(({value}) => Number(value))
        price: number
        
        @Expose()
        @Type(() => InstructorDto)
        instructor: InstructorDto
}

export class EnrollResponseDto {
    @Expose()
    id: string

    @Expose()
    @Type(() => CourseDto)
    course: CourseDto

    @Expose()
    status: EnrollStatus

    @Expose()
    lessonsCompleted: number

    @Expose()
    certificateEarned: boolean

    @Expose()
    createdAt: Date

    @Expose()
    progressPercentage: number
}