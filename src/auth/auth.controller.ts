import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, RegisterDto, EmailDto, ResetPasswordDto, ChangePasswordDto } from './dto/auth-dto';
import { CurrentUser } from 'src/common/decorators/current-user';
import type { UserData } from 'src/common/all-interfaces/all-interfaces';
import { JwtAuthGuard } from 'src/common/guards/AuthGuard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@Throttle({ default: { limit: 10, ttl: 60000 } })

export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post('/register')
    register(@Body() dto: RegisterDto ) {
       return this.authService.register(dto)
    }
    
    @Get('/verify-email/:token')
    verifyEmail(@Param('token') token: string) {
        return this.authService.verifyEmail(token)
    }

    @Post('/resend-email')
    resendVerificaiton(@Body() dto: EmailDto ) {
        return this.authService.resendVerification(dto)
    }
    
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('/login')
    login(@Body() dto: loginDto) {
        return this.authService.login(dto)
    }

    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post('/forgot-password')
    forgotPassword(@Body() dto: EmailDto) {
        return this.authService.forgotPassword(dto)
    }

    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post('/reset-password/:token')
    resetPassword(@Param('token') token: string ,@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(token,dto)
    }

    @UseGuards(JwtAuthGuard)
    @Put('/change-password')
    changePassword(@Body() dto: ChangePasswordDto, @CurrentUser() userData: UserData) {
        return this.authService.changePassword(dto,userData)
    }

}