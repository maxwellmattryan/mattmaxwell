import { Controller, Put, HttpCode, UseGuards, Req, Param, Post, Get, Delete } from '@nestjs/common';

import { Request } from 'express';

import { JwtAuthGuard } from '@api/core/auth/jwt/jwt-auth.guard';

import { ProfileService } from '@api/features/profile/services/profile.service';

import { Project } from '../entities/project.entity'
import { ProjectService } from '../services/project.service';
import {
    ProjectWasNotFoundException,
    ProjectCouldNotBeUpdatedException,
    ProjectsWereNotFoundException
} from '../exceptions/project.exception';

@Controller('projects')
export class ProjectController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly projectService: ProjectService
    ) { }

    @Get('')
    @HttpCode(200)
    async getProjects(@Req() request: Request): Promise<Project[]> {
        const projects = await this.projectService.getProjects();
        if(projects.length === 0) throw new ProjectsWereNotFoundException();

        return projects;
    }

    @Post('')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async createProject(@Req() request: Request): Promise<Project> {
        return await this.projectService.createProject(request.body);
    }

    @Get(':id')
    @HttpCode(200)
    async getProject(@Param('id') id: number, @Req() request: Request): Promise<Project> {
        const project = await this.projectService.getProject(id);
        if(!project) throw new ProjectWasNotFoundException();

        return project;
    }


    @Put(':id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateProject(@Param('id') id: number, @Req() request: Request): Promise<Project> {
        const project = await this.projectService.updateProject(id, request.body);
        if(!project) throw new ProjectCouldNotBeUpdatedException();

        return project;
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    async deleteProject(@Param('id') id: number, @Req() request: Request): Promise<void> {
        if(!(await this.projectService.existsInTable(id))) throw new ProjectWasNotFoundException();

        await this.projectService.deleteProject(id);
    }
}