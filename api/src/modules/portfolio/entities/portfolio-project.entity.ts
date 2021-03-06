import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany, PrimaryColumn
} from 'typeorm';

import { Id } from '@api/core/database/entity.service';

import { PortfolioProfile } from './portfolio-profile.entity';

@Entity('portfolio_project')
export class PortfolioProject {
    constructor(partial: Partial<PortfolioProject>) {
        Object.assign(this, partial);
    }

    @PrimaryColumn({ type: 'varchar', length: 6 })
    public id?: Id;

    @ManyToMany(type => PortfolioProfile, p => p.projects, { onDelete: 'CASCADE' })
    public profiles: PortfolioProfile[];

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    public name: string;

    @Column({ type: 'text', nullable: false })
    public tagline: string;

    @Column({ type: 'text', nullable: false })
    public description: string;

    @Column({ type: 'text', nullable: false })
    public image_url: string;

    @Column({ type: 'text', nullable: false })
    public link_name: string;

    @Column({ type: 'text', nullable: false })
    public link_url: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
    public created_at?: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()' })
    public updated_at?: Date;
}