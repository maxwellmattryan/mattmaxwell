import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShopComponent } from './shop.component';

import {
    ShopCategoryEditorComponent,
    ShopCheckoutViewComponent,
    ShopFaqViewComponent,
    ShopProductEditorComponent,
    ShopViewComponent
} from './components';

const routes: Routes = [
    {
        path: '',
        component: ShopComponent,
        children: [
            {
                path: '',
                component: ShopViewComponent
            },
            {
                path: 'categories/editor',
                component: ShopCategoryEditorComponent
            },
            {
                path: 'checkout',
                component: ShopCheckoutViewComponent
            },
            {
                path: 'faq',
                component: ShopFaqViewComponent
            },
            {
                path: 'products/editor',
                component: ShopProductEditorComponent
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
export class ShopRoutingModule { }
