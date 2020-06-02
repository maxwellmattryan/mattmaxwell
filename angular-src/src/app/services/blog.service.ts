import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Post, Topic } from '../models';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    constructor(
        private httpClient: HttpClient,
    ) { }

    deletePost(requestURL: string, headers: HttpHeaders): Observable<any> {
        return this.httpClient.delete(
            environment.API_URL + requestURL,
            { 
                headers: headers,
                responseType: 'text'
            }
        );
    }

    getPost(requestURL: string): Observable<Post> {
        return this.httpClient.get<Post>(environment.API_URL + requestURL);
    }

    getPosts(): Observable<Post[]> {
        return this.httpClient.get<Post[]>(environment.API_URL + '/blog/posts');
    }

    putPost(post: Object, headers: HttpHeaders): Observable<any> {
        return this.httpClient.put(
            environment.API_URL + '/blog/posts/' + post['uri'], 
            post,
            { 
                headers: headers,
                responseType: 'text'
            }
        );
    }

    getTopic(requestURL: string): Observable<Topic> {
        return this.httpClient.get<Topic>(environment.API_URL + requestURL);
    }

    getTopics(): Observable<Topic[]> {
        return this.httpClient.get<Topic[]>(environment.API_URL + '/blog/topics');
    }
}
