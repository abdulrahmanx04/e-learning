import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckoutData, RefundData } from 'src/common/all-interfaces/all-interfaces';
import { InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class StripeService {
    private stripe : Stripe
    private webhookSecret: string
     constructor(private readonly configService: ConfigService) {
        this.stripe= new Stripe(this.configService.getOrThrow<string>("STRIPE_SECRET_KEY"))
        this.webhookSecret= this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET')
    }
    async createCheckoutSession(params: CheckoutData) {
        try {
            return await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: params.currency.toLowerCase() || 'egp',
                            product_data: {
                                name: 'Course payment',
                                description: `Enrollment for ${params.enrollId}`
                            },
                            unit_amount: Math.round(params.amount*100)
                        },
                        quantity: 1 
                    }
                ],
                mode: 'payment',
                success_url: params.successUrl,
                cancel_url: params.cancelUrl,
                customer_email: params.customerEmail,
                metadata: {
                    enrollId: params.enrollId,
                }
            })
            
        }catch(err){
            console.error('Stripe session creation error:', err);
            throw new InternalServerErrorException(`Error creating session: ${err.message}`)
        }
    }

    async retrieveSession(sessionId: string) {
        return this.stripe.checkout.sessions.retrieve(sessionId)
    }

    async expireCheckoutSession(sessionId: string) {
        try {
            return await this.stripe.checkout.sessions.expire(sessionId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to expire checkout session');
        }
    }

    async refundPayment(params: RefundData) {
        try {
            return await this.stripe.refunds.create({
                payment_intent: params.paymentIntentId,
                amount: params.amount ? Math.round(params.amount * 100) : undefined,
                reason: params.reason as any
            })
        }catch(err){
            throw new InternalServerErrorException('Failed to refund payment');
        }
    }

    async constructWebhook(payload: Buffer,signature: string) {
       try {
        return await this.stripe.webhooks.constructEvent(
            payload,
            signature,
            this.webhookSecret
        )
        } catch (error) {
            throw new BadRequestException('Invalid webhook signature');
        }
    }
}
