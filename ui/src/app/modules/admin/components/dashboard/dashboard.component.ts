import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Profile } from '@app/shared/models';
import { ApiService } from '@app/core/http';
import { AuthService } from '@app/core/authentication';
import { NotificationService, ProfileService, ComparisonService } from '@app/core/services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(
        private router: Router,
        private apiService: ApiService,
        public authService: AuthService,
        private comparisonService: ComparisonService,
        private notificationService: NotificationService,
        public profileService: ProfileService
    ) { }

    ngOnInit(): void {
        this.apiService.getProfiles().subscribe(profiles => {
            this.profileService.setProfiles(profiles.sort(this.comparisonService.profiles));
        });
    }

    changeProfile(profile: Profile): void {
        if(profile.active) return;

        profile = this.profileService.activateProfile(profile);

        const headers = this.authService.getAuthHeaders();

        this.apiService.putProfile(profile, headers).subscribe(res => {
            this.notificationService.createNotification(res.msg);
        });
    }

    onLogoutClick(): void {
        const message = `Bye, ${this.authService.getAdmin()}!`;
        this.notificationService.createNotification(message);

        this.authService.logoutAdmin();
        
        this.router.navigate(['admin'])
    }
}