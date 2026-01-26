import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProgressDto, LessonProgressResponse } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { UserData } from 'src/common/all-interfaces/all-interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonProgress } from './entities/progress.entity';
import { Repository } from 'typeorm';
import { Lessons } from 'src/lessons/entities/lesson.entity';
import { plainToInstance } from 'class-transformer';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ProgressService {
  constructor(@InjectRepository(LessonProgress) private progressRepo: Repository<LessonProgress>,
  @InjectRepository(Lessons) private lessonRepo: Repository<Lessons>
){}
  
  async create(lessonId: string,dto: CreateProgressDto, user: UserData) {
    
      let [lesson,progress]= await Promise.all([
          this.lessonRepo.findOneOrFail({where: {id: lessonId}}),
          this.progressRepo.findOne({where: {lessonId, userId: user.id}})
      ])

      const updatedProgress= progress ?
        this.updateExistingProgress(progress,dto) 
      : this.createProgress(user.id,lessonId,dto)

      await this.progressRepo.save(updatedProgress)

      return plainToInstance(LessonProgressResponse,updatedProgress, {excludeExtraneousValues: true})
  
    }

 async findAll(query: PaginateQuery, user: UserData) {
      const progress= await paginate(query,this.progressRepo,{
        sortableColumns: ['completedAt','lastAccessedAt','watchedDuration'],
        filterableColumns: {
          isCompleted: [FilterOperator.IN],
          watchedDuration: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.BTW],
          progressPercentage: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.BTW, FilterOperator.EQ]
        },
        where: {userId: user.id},
        relations: ['lesson'],
        defaultLimit: 10,
        maxLimit: 100,
        defaultSortBy: [['lastAccessedAt','DESC']]
      })
      const dataDto= plainToInstance(LessonProgressResponse, progress.data, {excludeExtraneousValues: true})
      return {
        ...progress,
        data: dataDto
      }
  }

  async findOne(id: string): Promise<LessonProgressResponse> {
    const progress= await this.progressRepo.findOneOrFail({where :{id},relations: ['lesson']})
    return plainToInstance(LessonProgressResponse,progress, {excludeExtraneousValues: true})
  }

  async update(id: string, dto: UpdateProgressDto) {
    let progress= await this.progressRepo.findOneOrFail({where: {id},relations: ['lesson']})
    
    const updatedProgress= this.updateExistingProgress(progress,dto)

    return plainToInstance(LessonProgressResponse,updatedProgress, {excludeExtraneousValues: true})
  }

  async remove(id: string) {
      const progress= await this.progressRepo.findOneOrFail({where: {id}})
      await this.progressRepo.delete({id})
      return
    }


  private updateExistingProgress(progress: LessonProgress, dto: CreateProgressDto | UpdateProgressDto) {
    progress.watchedDuration= dto.watchedDuration ?? progress.watchedDuration
    progress.isCompleted= dto.isCompleted ?? progress.isCompleted
    progress.progressPercentage= dto.progressPercentage ?? progress.progressPercentage
    progress.lastAccessedAt= new Date()
    if(dto.isCompleted && !progress.completedAt) {
      progress.completedAt= new Date()
      progress.isCompleted= true,
      progress.progressPercentage=100
    }
    return progress
  }
  private createProgress(userId: string, lessonId: string,dto: CreateProgressDto) {
    return this.progressRepo.create({
      userId,
      lessonId,
      watchedDuration: dto.watchedDuration  ?? 0,
      progressPercentage: dto.progressPercentage ?? 0,
      completedAt: dto.isCompleted ? new Date() : null,
      isCompleted: dto.isCompleted ?? false,
      lastAccessedAt: new Date()
    })
  }
}
