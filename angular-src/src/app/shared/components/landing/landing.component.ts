import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
    @Input() content: any;

    constructor() { }

    ngOnInit(): void { }
}