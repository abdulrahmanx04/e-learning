import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Header, HttpCode, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, RefundDto } from './dto/create-payment.dto';
import  { CurrentUser } from 'src/common/decorators/current-user';
import type { UserData } from 'src/common/all-interfaces/all-interfaces';
import { JwtAuthGuard } from 'src/common/guards/AuthGuard';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';

@Controller('payments')

export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  create(@Body() createPaymentDto: CreatePaymentDto,@CurrentUser() user: UserData) {
    return this.paymentsService.create(createPaymentDto,user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/refund')
  refund(@Param('id') id: string,@Body() refundDto: RefundDto, @CurrentUser() user: UserData) {
    return this.paymentsService.refundPayment(id,refundDto,user)
  }


  @Post('webhook')
  @HttpCode(200)
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: any
    ) {
        return await this.paymentsService.webhook(signature, req.rawBody || req.body);
    }

  @UseGuards(JwtAuthGuard)  
  @Get('')
  findAll(@Paginate() query: PaginateQuery, @CurrentUser() user: UserData) {
    return this.paymentsService.findAll(query,user);
  }

  @UseGuards(JwtAuthGuard)  
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserData) {
    return this.paymentsService.findOne(id,user);
  }

  @UseGuards(JwtAuthGuard)  
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: UserData) {
    return this.paymentsService.remove(id,user);
  }
}


