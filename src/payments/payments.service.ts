import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollments, EnrollStatus } from 'src/enrollment/entities/enrollment.entity';
import { DataSource, Repository } from 'typeorm';
import { Currency, Payment, PaymentStatus } from './entities/payment.entity';
import { UserData } from 'src/common/all-interfaces/all-interfaces';
import { StripeService } from 'src/stripe/stripe.service';
import { sendEmail } from 'src/common/utils/email';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { CreatePaymentDto, PaymentResponseDto, RefundDto } from './dto/create-payment.dto';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class PaymentsService {
  constructor(@InjectRepository(Enrollments) private enrollRepo: Repository<Enrollments>, 
 @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  private stripeService: StripeService,
  private dataSource: DataSource
) {}

  async create( createPaymentDto: CreatePaymentDto,user: UserData) {
   
      return await this.dataSource.transaction(async(manager) => {
        const enrollment = await manager.getRepository(Enrollments).findOneOrFail({where:{
          id: createPaymentDto.enrollId,
          status: EnrollStatus.PENDING
        },relations: ['course']})

        const payment= manager.getRepository(Payment).create({
          enrollment,
          userId: user.id,
          amount: enrollment.course.price,
          status: PaymentStatus.PENDING,
          currency: Currency.EGP
        })

        const session = await this.stripeService.createCheckoutSession({
              amount: payment.amount,
              currency: payment.currency.toLowerCase(),
              enrollId: createPaymentDto.enrollId,
              customerEmail: user.email,
              successUrl: process.env.PAYMENT_SUCCESS_URL!,
              cancelUrl: process.env.PAYMENT_CANCEL_URL
        });
        payment.stripeSessionId = session.id;
      
        await manager.save(payment);
          
        return { id: payment.id,checkOutUrl: session.url };
      })  
  }
  async refundPayment(paymentId: string,refundDto: RefundDto,user: UserData) {
    return await this.dataSource.transaction(async(manager) => {
        const payment= await manager.getRepository(Payment).findOneOrFail({
            where: {
              id: paymentId,
              userId: user.id,
              status: PaymentStatus.SUCCESS
            },
            relations: ['enrollment']
        })
        const createdAt= new Date(payment.createdAt).getTime()

        if(createdAt > Date.now() + 7 * 24 * 60 * 60 * 1000) {
            throw new BadRequestException('Payment cannot be refunded');
        }

        await this.stripeService.refundPayment({paymentIntentId: payment.paymentIntentId,
          amount: payment.amount,
          reason: refundDto.reason
         });

        payment.refundRequestedAt = new Date();
        await manager.save(Payment,payment)

        return { message: 'Refund initiated' };


      })
  }
  async webhook(signature: string,payload: any){
      let event= this.stripeService.constructWebhook(payload,signature)
      switch(event.type) {
        case 'checkout.session.completed':{
          const session= event.data.object

          const payment= await this.paymentRepo.findOneOrFail({where: {stripeSessionId: session.id},
              relations: ['enrollment','user']})

          await this.dataSource.transaction(async(manager) => {
            payment.paymentIntentId= session.payment_intent as string
            payment.status=PaymentStatus.SUCCESS
            payment.enrollment.status=EnrollStatus.ACTIVE
            await manager.save(Payment,payment)
            await manager.save(Enrollments,payment.enrollment)
          })      
           await sendEmail('paymentSuccess', payment.user.email);
          break
        }
        case 'payment_intent.payment_failed': {
            const pi = event.data.object as any;

            const payment= await this.paymentRepo.findOneOrFail({where: {paymentIntentId: pi.id},relations: ['user']})
          
            payment.status = PaymentStatus.FAILED;
            payment.failureMessage = pi.last_payment_error?.message ?? null;

            await Promise.all([ 
              this.paymentRepo.save(payment),
              sendEmail('paymentFailed', payment.user.email)
            ])

           break
        }
        case 'charge.refunded': {
           const charge= event.data.object
           const payment= await this.paymentRepo.findOneOrFail({
              where: {
                  paymentIntentId:  charge.payment_intent as string,
              },
              relations: ['enrollment','user']
          })
          await this.dataSource.transaction(async(manager) => {
              payment.status= PaymentStatus.REFUNDED
              payment.enrollment.status= EnrollStatus.DROPPED
              payment.refundedAt= new Date()

              await manager.save(Payment,payment)
              await manager.save(Enrollments,payment.enrollment)
          })
          await sendEmail('paymentSuccess', payment.user.email);
          break
        }
          case 'checkout.session.expired': {
            const session = event.data.object
            const payment= await this.paymentRepo.findOneOrFail({
                where: {
                      stripeSessionId: session.id,
                },
                  relations: ['enrollment']
            })
            payment.status= PaymentStatus.EXPIRED
            payment.failureMessage = 'Checkout session expired or user cancelled the payment';
            await this.paymentRepo.save(payment);
            break
          }
      }
    return { received: true };
  }

  async findAll(query: PaginateQuery,user: UserData) {
    const payments= await paginate(query,this.paymentRepo, {
      sortableColumns: ['createdAt','amount','currency'],
      searchableColumns: ['currency','amount'],
      filterableColumns: {
        'amount': [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.BTW],
        'currency': [FilterOperator.IN],
        'status': [FilterOperator.IN]
      },
      defaultSortBy: [['createdAt', 'DESC']],
      maxLimit: 10,
      defaultLimit: 10,
      where: {userId: user.id}
    })
    const dataDto= plainToInstance(PaymentResponseDto, payments.data, {excludeExtraneousValues: true})
    return {
      ...payments,
      data: dataDto
    }
  }

  async findOne(id: string,user: UserData) {
    const payment= await this.paymentRepo.findOneOrFail({where: {id,userId: user.id}})
    return plainToInstance(PaymentResponseDto,payment,{excludeExtraneousValues: true})
  }

  async remove(id: string, user: UserData) {
      const payment= await this.paymentRepo.findOneOrFail({where: {id,userId: user.id}})
      await this.paymentRepo.delete({id})
      return 
  }
}
