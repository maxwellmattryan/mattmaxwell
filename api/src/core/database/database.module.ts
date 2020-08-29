import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'rxjs';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return ({
                    type: 'postgres',
                    //host: `/cloudsql/${configService.get('POSTGRES_INSTANCE')}`,
                    socketPath: `/cloudsql/${configService.get(`POSTGRES_INSTANCE`)}`,
                    port: configService.get('POSTGRES_PORT'),
                    username: configService.get('POSTGRES_USER'),
                    password: configService.get('POSTGRES_PASSWORD'),
                    database: configService.get('POSTGRES_DB'),
                    namingStrategy: new SnakeNamingStrategy(),
                    entities: [__dirname + '/../../features/**/*.entity{.ts,.js}'],
                    cli: {
                        'migrationsDir': 'migrations'
                    },
                    migrations: ['migrations/*{.ts,.js}'],
                    migrationsTableName: 'typeorm_migration',
                    synchronize: true
                })
            }
        })
    ]
})
export class DatabaseModule { }