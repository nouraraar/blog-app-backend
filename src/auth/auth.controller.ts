import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {loginUserDTO, registerUserDTO } from '../models/user.model';
import { AuthResponse } from 'src/models/user.model';
import { recordResponse } from 'src/models/recordResponse';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService){}

@Post('register')
public async register(@Body(ValidationPipe) createUserDTO: registerUserDTO): Promise <recordResponse<'user',AuthResponse>>
{
    const user = await this.authService.register(createUserDTO);
    return {user};
}


@Post('login')
public async login(@Body(ValidationPipe) loginUserDTO:loginUserDTO):Promise<recordResponse<'user',AuthResponse>>
{
    const user = await this.authService.login(loginUserDTO);
    return {user}
}


}