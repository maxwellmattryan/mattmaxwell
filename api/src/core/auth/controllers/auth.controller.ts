import { Controller, HttpCode, Post, UseGuards, Body, Res, HttpStatus } from '@nestjs/common';

import { Response } from 'express';

import { Admin } from '@api/modules/admin/entities/admin.entity';

import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { NotAllowedToRegisterException, WrongCredentialsWereProvidedException } from '../exceptions/auth.exception';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() adminData: Admin
    ): Promise<Admin> {
        return await this.authService.registerAdmin(adminData);
        throw new NotAllowedToRegisterException();
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() adminData: Admin,
        @Res() response: Response
    ): Promise<void> {
        const admin = await this.authService.authenticateAdmin(adminData);
        if(!admin) throw new WrongCredentialsWereProvidedException();

        const jwtCookie = this.authService.generateCookieWithJwtToken(admin);
        response.setHeader('Set-Cookie', jwtCookie);

        response.send(admin);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async logout(
        @Res() response: Response
    ): Promise<void> {
        response.clearCookie('Authentication');
        response.send();
    }
}
