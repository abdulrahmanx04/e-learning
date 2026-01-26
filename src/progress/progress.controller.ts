import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put, HttpCode } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { CurrentUser } from 'src/common/decorators/current-user';
import type { UserData } from 'src/common/all-interfaces/all-interfaces';
import { JwtAuthGuard } from 'src/common/guards/AuthGuard';
import { ActiveEnrollment } from 'src/common/guards/active-enrollment.guard';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';

@UseGuards(JwtAuthGuard,ActiveEnrollment)
@Controller('courses/:courseId/lessons/:lessonId/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('')
  create(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string
  ,@Body() createProgressDto: CreateProgressDto,@CurrentUser() user: UserData) {
    return this.progressService.create(lessonId,createProgressDto,user);
  }

  @Get('')
  findAll(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Paginate() query: PaginateQuery, @CurrentUser() user: UserData) {
    return this.progressService.findAll(query,user);
  }

  @Get(':id')
  findOne(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Param('id') id: string, @Body() dto: UpdateProgressDto) {
    return this.progressService.update(id, dto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Param('id') id: string)
    {
    return this.progressService.remove(id);
  }
}
