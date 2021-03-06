import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@api/core/auth/jwt/jwt-auth.guard';

import { BlogPostStatus } from '../entities/blog-post-status.entity';
import { BlogPostStatusService } from '../services/blog-post-status.service';
import { BlogPostStatusesWereNotFoundException } from '../exceptions/blog-post-status.exception';

@Controller('blog/post-statuses')
export class BlogPostStatusController {
    constructor(
        private readonly blogPostStatusService: BlogPostStatusService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getPostStatuses(): Promise<BlogPostStatus[]> {
        const statuses = await this.blogPostStatusService.getStatuses();
        if(statuses.length === 0) throw new BlogPostStatusesWereNotFoundException();

        return statuses;
    }
}
