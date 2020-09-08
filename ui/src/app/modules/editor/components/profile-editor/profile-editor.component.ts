import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Profile, ProfileStatus, ProfileTechnology, Project } from '@app/shared/models';
import { AuthService } from '@app/core/auth';
import { ApiService } from '@app/core/http';
import { ComparisonService, EditorService, NotificationService, ValidationService } from '@app/core/services';

@Component({
    selector: 'app-profile-editor',
    templateUrl: './profile-editor.component.html',
    styleUrls: ['../../editor.component.scss']
})
export class ProfileEditorComponent implements OnDestroy, OnInit {
    profileData: Profile;
    projectData: Project[] = [];
    statusData: ProfileStatus[] = [];
    technologyData: ProfileTechnology[] = [];

    profileForm: FormGroup;

    @Input() id: number;

    isLoaded: boolean = false;

    constructor(
        private router: Router,
        private changeDetectionRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private authService: AuthService,
        private comparisonService: ComparisonService,
        private editorService: EditorService,
        private notificationService: NotificationService,
        private validationService: ValidationService
    ) { }

    ngOnDestroy(): void {
        this.editorService.setProfile(null);
    }

    ngOnInit(): void {
        this.checkForAdmin();

        this.setUnloadEvent();

        this.initProfileForm();

        this.isLoaded = true;
    }

    private checkForAdmin(): void {
        if(!this.authService.isLoggedIn())
            this.router.navigate(['']);
    }

    private setUnloadEvent(): void {
        window.onbeforeunload = () => {
            this.editorService.setProfile(null);
        }
    }

    private initProfileForm(): void {
        this.loadProfileData();
        this.loadProjectData();
        this.loadStatusData();
        this.loadTechnologyData();

        this.buildProfileForm();
    }

    private loadProfileData(): void {
        this.profileData = this.editorService.getProfile();
    }

    private loadProjectData(): void {
        this.apiService.getProjects().subscribe((res: Project[]) => {
            this.projectData = res.sort(this.comparisonService.projects);

            if(this.id && this.profileData) {
                this.setProjectControls(this.profileData.projects.map(p => p.id));
            } else {
                this.setProjectControls([]);
            }

            this.isLoaded = true;
        }, (error: HttpErrorResponse) => {
            this.notificationService.createNotification(error.error.message);
        });
    }

    private setProjectControls(associatedProjectIds: number[]): void {
        this.projectData.forEach(p => {
            const control: FormControl = this.formBuilder.control(associatedProjectIds.includes(p.id));
            (this.profileForm.controls.projects as FormArray).push(control);
        });
    }

    private loadStatusData(): void {
        this.apiService.getProfileStatuses().subscribe((res: ProfileStatus[]) => {
            this.statusData = res;
        }, (error: HttpErrorResponse) => {
            this.notificationService.createNotification(error.error.message);
        });
    }

    private loadTechnologyData(): void {
        if(this.profileData) this.technologyData = this.profileData.technologies.sort(this.comparisonService.profileTechnologies);
    }

    private buildProfileForm(): void {
        if(this.profileData) {
            this.profileForm = this.formBuilder.group({
                name:         this.formBuilder.control(this.profileData.name,                [Validators.required]),
                status:       this.formBuilder.control(this.profileData.status.status,       [Validators.required]),
                projects:     this.formBuilder.array  (this.projectData,                     [this.validationService.hasMinElements(1)]),
                tagline:      this.formBuilder.control(this.profileData.tagline,             [Validators.required]),
                landing:      this.formBuilder.control(this.profileData.landing,             [Validators.required]),
                about:        this.formBuilder.control(this.profileData.about,               [Validators.required]),
                technologies: this.formBuilder.array  (this.technologyData.map(t => t.name), [Validators.required]),
                image_url:    this.formBuilder.control(this.profileData.image_url,           [Validators.required])
            });
        } else {
            this.profileForm = this.formBuilder.group({
                name:         this.formBuilder.control('',         [Validators.required]),
                status:       this.formBuilder.control('ACTIVE',   [Validators.required]),
                projects:     this.formBuilder.array  ([],         [this.validationService.hasMinElements(1)]),
                tagline:      this.formBuilder.control('',         [Validators.required]),
                landing:      this.formBuilder.control('',         [Validators.required]),
                about:        this.formBuilder.control('',         [Validators.required]),
                technologies: this.formBuilder.array  ([''],       [Validators.required]),
                image_url:    this.formBuilder.control('',         [Validators.required])
            });
        }
    }

    onSubmit(): void {
        const profile = this.buildFormProfileData();

        if(profile.id === undefined) {
            this.apiService.createProfile(profile).subscribe((res: Profile) => {
                this.notificationService.createNotification('Successfully created new profile!');
                this.router.navigate(['admin']);
            }, (error: HttpErrorResponse) => {
                this.notificationService.createNotification(error.error.message);
            });
        } else {
            this.apiService.updateProfile(profile).subscribe((res: Profile) => {
                this.notificationService.createNotification('Successfully updated existing profile!');
                this.router.navigate(['admin']);
            }, (error: HttpErrorResponse) => {
                this.notificationService.createNotification(error.error.message);
            });
        }
    }

    private buildFormProfileData(): Profile {
        const projects = this.buildFormProjectData();
        const status = this.buildFormStatusData();
        const technologies = this.buildFormTechnologyData();

        return new Profile({
            ...this.profileForm.value,
            id: this.profileData ? this.profileData.id : undefined,
            projects: projects,
            status: status,
            technologies: technologies
        });
    }

    private buildFormProjectData(): Project[] {
        return this.profileForm.value.projects.map((p, idx) => {
            if(p) return this.projectData[idx];
        }).filter(p => p !== undefined);
    }

    private buildFormStatusData(): ProfileStatus {
        return this.statusData.find(s => s.status === this.profileForm.value.status);
    }

    private buildFormTechnologyData(): ProfileTechnology[] {
        return this.profileForm.value.technologies.map((t, idx) => {
            return new ProfileTechnology({ name: t, display_order: idx + 1 });
        });
    }

    addTechnologyToForm(): void {
        const control: FormControl = this.formBuilder.control('', [Validators.required]);
        (this.profileForm.controls.technologies as FormArray).push(control);

        // CAUTION: Angular will throw an ExpressionChangedAfterItWasCheckedException after adding new control (b/c array becomes invalid)
        this.changeDetectionRef.detectChanges();
    }

    changeTechnologyDisplayOrder(oldIdx: number, newIdx: number): void {
        const technologyFormArray = this.profileForm.get('technologies') as FormArray;
        const technologies = [...technologyFormArray.value];
        [technologies[oldIdx], technologies[newIdx]] = [technologies[newIdx], technologies[oldIdx]];
        technologyFormArray.setValue(technologies);
    }

    removeTechnology(idx: number): void {
        (this.profileForm.controls.technologies as FormArray).removeAt(idx);
    }
}
