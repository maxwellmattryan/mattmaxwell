import {
    Entity,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable, PrimaryColumn
} from 'typeorm';

import { Id } from '@api/core/database/entity.service';

import { BlogAuthor } from './blog-author.entity';
import { BlogPostStatus } from './blog-post-status.entity';
import { BlogTopic } from './blog-topic.entity';

@Entity('blog_post')
export class BlogPost {
    constructor(partial: Partial<BlogPost>) {
        Object.assign(this, partial);
    }

    @PrimaryColumn({ type: 'varchar', length: 6 })
    public id?: Id;

    @ManyToOne(type => BlogAuthor, ba => ba.id)
    public author: BlogAuthor;

    @ManyToOne(type => BlogPostStatus, bps => bps.post)
    public status: BlogPostStatus;

    @ManyToMany(type => BlogTopic, bt => bt.posts, { onDelete: 'CASCADE' })
    @JoinTable()
    public topics: BlogTopic[];

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    public title: string;

    @Column({ type: 'text', nullable: false })
    public subtitle: string;

    @Column({ type: 'text', nullable: false })
    public preview: string;

    @Column({ type: 'text', nullable: false })
    public content: string;

    @Column({ type: 'text', nullable: false })
    public image_url: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
    public created_at?: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()' })
    public updated_at?: Date;
}
