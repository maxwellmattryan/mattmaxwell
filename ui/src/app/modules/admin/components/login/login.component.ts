import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Admin } from '@app/shared/interfaces';
import { ApiService } from '@app/core/http';
import { AuthService } from '@app/core/authentication';
import { NotificationService, ValidationService } from '@app/core/services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username: string = '';
    password: string = '';

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private notificationService: NotificationService,
        public validationService: ValidationService
    ) { }

    ngOnInit(): void {
        if(this.authService.isLoggedIn()) {
          this.notificationService.createNotification('Already logged in.');
          this.router.navigate(['admin']);
        }
    }

    onLoginSubmit(): void {
        const admin: Admin = {
            username: this.username,
            password: this.password
        };

        this.apiService.loginAdmin(admin).subscribe(res => {
          this.authService.loginAdmin(res.id, res.username);
          this.notificationService.createNotification(`Welcome back, ${res.username}!`);
          this.router.navigate(['admin']);
        }, (error: HttpErrorResponse) => {
          this.notificationService.createNotification(error.error.message);
        });
    }
}
