import { PassportStrategy } from "@nestjs/passport";
import {Strategy,ExtractJwt} from 'passport-jwt'
import { Injectable } from "@nestjs/common";
import {  UserData } from "../all-interfaces/all-interfaces";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT'),
            ignoreExpiration: false                     
        })
    }
    async validate(payload: any) {
        return {id: payload.id, role: payload.role} as UserData
    }
}