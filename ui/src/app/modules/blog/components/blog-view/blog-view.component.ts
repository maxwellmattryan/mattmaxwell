import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { BlogPost, BlogTopic } from '@app/shared/models';
import { ApiService } from '@app/core/http/api.service';
import { AuthService } from '@app/core/authentication';
import { BlogService, ComparisonService, EditorService, NotificationService } from '@app/core/services';

@Component({
    selector: 'app-blog-view',
    templateUrl: './blog-view.component.html',
    styleUrls: ['./blog-view.component.scss']
})
export class BlogViewComponent implements OnInit {
    isAdmin: boolean = false;
    isLoaded: boolean = false;

    posts: BlogPost[];
    topics: BlogTopic[];

    activeTopicId: number = -1;

    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        public blogService: BlogService,
        private comparisonService: ComparisonService,
        private editorService: EditorService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.isAdmin = this.authService.isLoggedIn();

        if(this.isAdmin) {
            this.apiService.getPosts(this.activeTopicId, false).subscribe((res: BlogPost[]) => {
                this.posts = res;
                this.topics = this.getTopicsFromPosts().sort(this.comparisonService.topics);

                this.isLoaded = true;

                if(this.blogService.hasActiveTopic()) {
                    this.filterPosts(this.blogService.getActiveTopicId());
                    this.blogService.setActiveTopic(null);
                }
            }, (error: HttpErrorResponse) => {
                this.notificationService.createNotification(error.error.message);
            });
        } else {
            this.apiService.getPosts(this.activeTopicId).subscribe((res: BlogPost[]) => {
                this.posts = res;
                this.topics = this.getTopicsFromPosts().sort(this.comparisonService.topics);

                this.isLoaded = true;

                if(this.blogService.hasActiveTopic()) {
                    this.filterPosts(this.blogService.getActiveTopicId());
                    this.blogService.setActiveTopic(null);
                }
            }, (error: HttpErrorResponse) => {
                this.notificationService.createNotification(error.error.message);
            });
        }
    }

    private getTopicsFromPosts(): BlogTopic[] {
        let result: BlogTopic[] = [];

        this.posts.forEach(p => {
            p.topics.forEach(t => {
                if(!result.map(bt => bt.id).includes(t.id)) result.push(t);
            });
        });

        return result;
    }

    filterPosts(topicId: number): void {
        this.activeTopicId = topicId;

        if(this.isAdmin) {
            this.apiService.getPosts(topicId, false).subscribe((res: BlogPost[]) => {
                this.posts = res;
            }, (error: HttpErrorResponse) => {
                this.notificationService.createNotification(error.error.message);
            });
        } else {
            this.apiService.getPosts(topicId).subscribe((res: BlogPost[]) => {
                this.posts = res;
            }, (error: HttpErrorResponse) => {
                this.notificationService.createNotification(error.error.message);
            });
        }
    }

    sendTopicToEditor(topic: BlogTopic): void {
        this.editorService.setTopic(topic);
    }

    deleteTopic(topic: BlogTopic): void {
        this.apiService.deleteTopic(topic.id).subscribe((res: any) => {
            this.removeTopic(topic.id);
            this.notificationService.createNotification('Successfully deleted blog topic!');
            this.filterPosts(-1);
        }, (error: HttpErrorResponse) => {
            this.notificationService.createNotification(error.error.message);
        });
    }

    private removeTopic(id: number): void {
        this.topics = this.topics.filter(t => t.id != id);

        this.posts = this.posts.filter(p => !p.topics.map(t => t.id).includes(id));
    }
}
