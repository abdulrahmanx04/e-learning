import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Put, HttpCode } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/course.dto';
import { UpdateCourseDto } from './dto/course.dto';
import { JwtAuthGuard } from 'src/common/guards/AuthGuard';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Paginate  } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/decorators/current-user';
import type { UserData } from 'src/common/all-interfaces/all-interfaces';
import { Throttle } from '@nestjs/throttler';

@Controller('courses')
@Throttle({ default: { limit: 50, ttl: 60000 } })
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}


  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('instructor')
  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([
      {name: 'thumbnail', maxCount: 1},
      {name: 'materials', maxCount: 10}
    ])
  )
  create(@Body() createCourseDto: CreateCourseDto, 
  @CurrentUser() user: UserData
  ,@UploadedFiles()
  files?: {thumbnail: Express.Multer.File[], materials: Express.Multer.File[]}
  ) {
      return this.coursesService.create(createCourseDto,user,files);
    }

  @Get('')
  findAll(@Paginate() query: PaginateQuery) {
    return this.coursesService.findAll(query);
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('admin','instructor')
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      {name: 'thumbnail', maxCount: 1},
      {name: 'materials',maxCount: 10}])
  )
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto,
  @CurrentUser() user: UserData,
  @UploadedFiles() files?: {
    thumbnail?: Express.Multer.File[], materials?: Express.Multer.File[]
  }
) {
    return this.coursesService.update(id,updateCourseDto,user,files);
  }
  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('admin', 'instructor')
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: UserData) {
    return this.coursesService.delete(id,user);
  }
}
