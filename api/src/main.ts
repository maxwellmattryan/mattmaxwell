import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

import { AppModule } from '@api/app.module';
import { ExtendedLogger } from '@api/core/utils/extended-logger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: [/http:\/\/localhost/, /https?:\/\/([a-z0-9]+[.])*mattmaxwell.dev/],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    app.useLogger(app.get(ExtendedLogger));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(
        app.get(Reflector)
    ));

    app.use(cookieParser(process.env.JWT_SECRET));
    app.use(compression());
    app.use(helmet());

    app.setGlobalPrefix('api');

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
}

bootstrap();
