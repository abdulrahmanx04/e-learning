import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeModule } from 'src/stripe/stripe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollments } from 'src/enrollment/entities/enrollment.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [StripeModule,TypeOrmModule.forFeature([Enrollments,Payment])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
