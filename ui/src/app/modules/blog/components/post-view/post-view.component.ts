import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BlogPost } from '@app/shared/models';
import { ApiService } from '@app/core/http';
import { AuthService } from '@app/core/authentication';
import { BlogService, EditorService, NotificationService, ComparisonService } from '@app/core/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-post-view',
    templateUrl: './post-view.component.html',
    styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit {
    isAdmin: boolean = false;
    isLoaded: boolean = false;

    post: BlogPost;

    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        public blogService: BlogService,
        private comparisonService: ComparisonService,
        private editorService: EditorService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.isAdmin = this.authService.isLoggedIn();

        this.apiService.getPost(this.router.url).subscribe(post => {
            this.post = post;
            this.post.topics.sort(this.comparisonService.topics);

            this.isLoaded = true;
        });
    }

    sendPostToEditor(): void {
        this.editorService.setPost(this.post);
    }

    deletePost(): void {
        this.apiService.deletePost(this.router.url).subscribe((res: any) => {
            this.notificationService.createNotification('Successfully deleted blog post!');
            this.router.navigate(['/blog']);
        }, (error: HttpErrorResponse) => {
            this.notificationService.createNotification(error.error.message);
        });
    }
}
