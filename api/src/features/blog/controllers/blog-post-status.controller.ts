import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { JwtAuthGuard } from '@api/core/auth/jwt/jwt-auth.guard';

import { BlogPostStatus } from '../entities/blog-post-status.entity';
import { BlogPostStatusService } from '../services/blog-post-status.service';
import { BlogPostStatusesWereNotFoundException } from '../exceptions/blog-post.exception';

@Controller('blog/posts/statuses')
export class BlogPostStatusController {
    constructor(
        private readonly blogPostStatusService: BlogPostStatusService
    ) { }

    @Get('')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async getPostStatuses(@Req() request: Request): Promise<BlogPostStatus[]> {
        const statuses = await this.blogPostStatusService.getStatuses();
        if(statuses.length === 0) throw new BlogPostStatusesWereNotFoundException();

        console.log(statuses);
        return statuses;
    }
}