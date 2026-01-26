import { Injectable } from "@nestjs/common";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsUUID, Max, Min } from "class-validator";

@Injectable()
export class CreateProgressDto {
 
    @IsOptional()
    @IsInt()
    watchedDuration?: number;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    progressPercentage?: number    

}

export class LessonDto {
  @Expose()
  title: string

  @Expose()
  duration: number
}

export class LessonProgressResponse {
  @Expose()
  id: string

  @Expose()
  lessonId: string;

  @Expose()
  watchedDuration?: number

  @Expose()
  progressPercentage: number

  @Expose()
  isCompleted?: boolean

  @Expose()
  completedAt: Date
 
  @Expose()
  lastAccessedAt: Date

  @Expose()
  @Type(()=> LessonDto)
  lesson: LessonDto
}



