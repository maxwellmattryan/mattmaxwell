import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortfolioComponent } from './portfolio.component';

import { PortfolioProjectEditorComponent, PortfolioProjectViewComponent } from './components';

export const routes: Routes = [
    {
        path: '',
        component: PortfolioComponent,
        children: [
            {
                path: 'projects/editor',
                component: PortfolioProjectEditorComponent
            },
            {
                path: 'projects/:id/:uri',
                component: PortfolioProjectViewComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class PortfolioRoutingModule { }