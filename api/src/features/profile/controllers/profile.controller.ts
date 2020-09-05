import { Controller, Get, HttpCode, Param, Post, Put, Req, UseGuards, Delete } from '@nestjs/common';

import { Request } from 'express';

import { JwtAuthGuard } from '@api/core/auth/jwt/jwt-auth.guard';

import { Profile } from '../entities/profile.entity';
import { ProfileService } from '../services/profile.service';
import {
    ProfilesWereNotFoundException,
    ProfileWasNotFoundException,
    ProfileCouldNotBeUpdatedException
} from '../exceptions/profile.exception';

@Controller('profiles')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @Get('')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async getProfiles(@Req() request: Request): Promise<Profile[]> {
        const profiles = await this.profileService.getProfiles();
        if(profiles.length == 0) throw new ProfilesWereNotFoundException();

        return profiles;
    }

    @Post('')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async createProfile(@Req() request: Request): Promise<Profile> {
        return await this.profileService.createProfile(request.body);
    }

    @Put(':id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Param('id') id: number, @Req() request: Request): Promise<Profile> {
        const profile = await this.profileService.updateProfile(id, request.body);
        if(!profile) throw new ProfileCouldNotBeUpdatedException();

        return profile;
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    async deleteProfile(@Param('id') id: number, @Req() request: Request): Promise<void> {
        if(!(await this.profileService.existsInTable(id))) throw new ProfileWasNotFoundException();

        await this.profileService.deleteProfile(id);
    }

    @Put(':id/activate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async activateProfile(@Param('id') id: number, @Req() request: Request): Promise<Profile> {
        // CAUTION: This check is required because all rows will be updated
        if(!(await this.profileService.existsInTable(id))) {
            throw new ProfileWasNotFoundException();
        }

        await this.profileService.resetProfileStatuses(id);

        return await this.profileService.getProfile(id);
    }
}
