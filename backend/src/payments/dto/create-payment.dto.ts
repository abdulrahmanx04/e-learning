import { Expose } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsUUID()
    enrollId: string
}

export class RefundDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsOptional()
    @IsString()
    reason?: string
}

export class PaymentResponseDto {
    @Expose()
    id: string

    @Expose()
    status: string

    @Expose()
    failureMessage: null

    @Expose()
    refundedAt: Date

    @Expose()
    amount:string

    @Expose()
    currency: string

    @Expose()
    enrollId: string
}

