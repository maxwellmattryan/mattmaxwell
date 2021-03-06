import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MarkdownModule } from 'ngx-markdown';

import { CoreModule } from '@ui/core/core.module';
import { MaterialModule } from '@ui/modules/material/material.module';

import { PortfolioComponent } from './portfolio.component';
import { PortfolioRoutingModule } from './portfolio-routing.module';

import {
    PortfolioProfileEditorComponent,
    PortfolioProjectCollectionComponent,
    PortfolioProjectViewComponent,
    PortfolioProjectEditorComponent
} from './components';
import {
    PortfolioApiService,
    PortfolioComparisonService
} from './services';

@NgModule({
    declarations: [
        PortfolioComponent,
        PortfolioProfileEditorComponent,
        PortfolioProjectCollectionComponent,
        PortfolioProjectEditorComponent,
        PortfolioProjectViewComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        MarkdownModule.forRoot(),
        MaterialModule,
        PortfolioRoutingModule,
        ReactiveFormsModule
    ],
    exports: [
        PortfolioProjectCollectionComponent
    ],
    providers: [
        PortfolioApiService,
        PortfolioComparisonService
    ]
})
export class PortfolioModule { }