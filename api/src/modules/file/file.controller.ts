import {
    Controller,
    Delete,
    HttpCode, HttpStatus,
    Post,
    Query,
    Req,
    UploadedFile,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Request, Express } from 'express';
import { Multer } from 'multer';

import { JwtAuthGuard } from '@api/core/auth/jwt/jwt-auth.guard';
import { BucketType, BucketVisibility, GCloudStorageService } from '@api/core/gcloud/gcloud-storage.service';

import { InvalidFileUriException } from './file.exception';

const fs = require('fs');

type FileResponse = {
    [url: string]: string
};

@Controller('files')
export class FileController {
    private uriRegex: RegExp = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$)).+/;

    constructor(private readonly gCloudStorageService: GCloudStorageService) { }

    @Post('upload')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    public async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Query('bucket') bucket: BucketType,
        @Query('visibility') visibility: BucketVisibility,
        @Query('dir') directory: string,
        @Req() request: Request
    ): Promise<FileResponse> {
        if(!this.uriRegex.test(directory)) throw new InvalidFileUriException();

        return { url: await this.gCloudStorageService.uploadFile(bucket, visibility, file, directory) };
    }

    @Delete('delete')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    public async deleteFile(
        @Query('bucket') bucket: BucketType,
        @Query('uri') uri: string,
        @Req() request: Request
    ): Promise<void> {
        if(!this.uriRegex.test(uri)) throw new InvalidFileUriException();

        await this.gCloudStorageService.deleteFile(bucket, uri);
    }
}
