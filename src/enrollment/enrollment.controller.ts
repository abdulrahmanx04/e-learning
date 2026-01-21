import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-authguard';
import { CurrentUser } from 'src/common/decorators/current-user';
import type { UserData } from 'src/common/all-interfaces/all-interfaces';
import { Paginate} from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';


@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class  EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}
  @Get('me')
  findAll(@Paginate() query: PaginateQuery, @CurrentUser() user: UserData) {
    return this.enrollmentService.findAll(query,user);
  }
  @Get(':id')
  findOne(@Param('id') id: string,@CurrentUser() user: UserData) {
    return this.enrollmentService.findOne(id,user);
  }
}

  @Controller('courses')
  @UseGuards(JwtAuthGuard)
  export class CourseEnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) {}

    @Post(':courseId/enroll')
    create(@Param('courseId') courseId: string
    ,@CurrentUser() user: UserData
  ) {
      return this.enrollmentService.create(courseId,user);
    }
 

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentDto) {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentService.remove(+id);
  }
}

