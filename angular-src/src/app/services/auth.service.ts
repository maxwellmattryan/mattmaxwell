import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    admin: any;
    authToken: any;

    // TODO: put in a better place specifically for API URLs
    public rootUrl: string = 'http://localhost:3000/';
    public authenticationUrl: string = this.rootUrl + 'admin/auth';
    public registrationUrl: string = this.rootUrl + 'admin/register';

    constructor(private httpClient: HttpClient) { }

    getAdmin() {
        return this.admin;
    }

    getToken() {
        return this.authToken;
    }

    isLoggedIn() {
        this.loadAdminData();
        return this.authToken != null;
    }

    registerAdmin(admin) {
        let headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');

        return this.httpClient.post(this.registrationUrl, admin, { headers: headers })
            .pipe(map((res: any) => { return res; }));
    }

    authenticateAdmin(admin) {
        let headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');

        return this.httpClient.post(this.authenticationUrl, admin, { headers: headers })
            .pipe(map((res: any) => { return res; }));
    }

    logoutAdmin() {
        this.admin = null;
        this.authToken = null;

        localStorage.clear();
    }

    storeAdminData(token, admin) {
        this.authToken = token;
        this.admin = admin;

        localStorage.setItem('id_token', token);
        localStorage.setItem('admin', JSON.stringify(admin));
    }

    loadAdminData() {
        const token = localStorage.getItem('id_token');
        const admin = JSON.parse(localStorage.getItem('admin'));
        
        this.authToken = token;
        this.admin = admin;
    }
}
