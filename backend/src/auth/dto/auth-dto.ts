
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min, MinLength } from "class-validator";


export class CreateAuthDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string

    @IsNotEmpty()
    @IsString()
    @Length(3,30)
    name: string

    @IsOptional()
    @IsString()
    @MaxLength(12)
    phone?: string

}


export class EmailDto {
    @IsEmail()
    email: string

}


export class LoginDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
    
}

export class PasswordDto {
    @IsNotEmpty()
    @IsString()
    password: string
}

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string
}


export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    newPassword: string
}