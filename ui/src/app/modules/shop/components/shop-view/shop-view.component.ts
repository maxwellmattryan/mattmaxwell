import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService } from '@ui/core/auth';
import { Id } from '@ui/core/models/model';
import { NotificationService, TrackingService } from '@ui/core/services';

import { ShopApiService, ShopCategoryService, ShopComparisonService, ShopEditorService } from '../../services';
import { ShopCategory, ShopProduct, ShopProductStatus, ShopProductStatuses } from '../../models';

@Component({
    selector: 'ui-shop-view',
    templateUrl: './shop-view.component.html',
    styleUrls: ['./shop-view.component.scss']
})
export class ShopViewComponent implements OnInit {
    public isAdmin: boolean = false;
    public isLoaded: boolean = false;

    public categories: ShopCategory[];
    public products: ShopProduct[];
    public statuses: ShopProductStatus[];

    activeCategoryId: Id = -1;
    activeStatusId: Id = ShopProductStatuses.AVAILABLE;

    public isLoadingByCategory: boolean = false;
    public isLoadingByStatus: boolean = false;

    constructor(
        private router: Router,
        private authService: AuthService,
        private notificationService: NotificationService,
        private shopApiService: ShopApiService,
        private shopCategoryService: ShopCategoryService,
        private shopComparisonService: ShopComparisonService,
        private shopEditorService: ShopEditorService,
        private titleService: Title,
        public trackingService: TrackingService
    ) { }

    ngOnInit(): void {
        this.titleService.setTitle(`Digital Audio Shop | Matthew Maxwell`);

        this.isAdmin = this.authService.isLoggedIn();

        this.shopApiService.getProducts(ShopProductStatuses.AVAILABLE).subscribe((res: ShopProduct[]) => {
            this.products = res.sort(this.shopComparisonService.products);

            if(this.isAdmin) {
                this.shopApiService.getCategories().subscribe((res: ShopCategory[]) => {
                    this.categories = res.sort(this.shopComparisonService.categories);
                });
                this.shopApiService.getProductStatuses().subscribe((res: ShopProductStatus[]) => {
                    this.statuses = res.filter(s => s.status !== 'REMOVED');
                });
            }
            else
                this.categories = this.getCategoriesFromProducts();

            if(this.shopCategoryService.hasActiveCategory())
                this.activeCategoryId = this.shopCategoryService.getActiveCategoryId();

            this.isLoaded = true;

        }, (error: HttpErrorResponse) => {
            this.notificationService.createNotification(error.error.message);
            this.router.navigate(['']);
        });
    }

    public getCategoriesFromProducts(): ShopCategory[] {
        let categories = new Map<string, ShopCategory>();
        this.products.forEach((val, idx, arr) => {
            if(!categories.has(val.category.name))
                categories.set(val.category.name, val.category);
        });
        return Array.from(categories.values()).sort(this.shopComparisonService.categories);
    }

    public filterProductsByCategory(categoryId: Id): void {
        const previousCategoryId = this.activeCategoryId;
        this.activeCategoryId = categoryId;
        this.isLoadingByCategory = true;

        this.shopApiService.getProducts(this.activeStatusId.toString(), this.activeCategoryId.toString()).subscribe((res: ShopProduct[]) => {
            this.products = res;
            this.isLoadingByCategory = false;
        }, (error: HttpErrorResponse) => {
            this.notificationService.createNotification(error.error.message);
            this.isLoadingByCategory = false;
            this.activeCategoryId = previousCategoryId;
        });
    }

    public loadProductsByStatus(statusId: Id): void {
        const previousStatusId = this.activeStatusId;
        this.activeStatusId = statusId;
        this.isLoadingByStatus = true;

        this.shopApiService.getProducts(this.activeStatusId.toString(), '').subscribe((res: ShopProduct[]) => {
            if(res.length < 1) {
                this.notificationService.createNotification('No shop products contain this status.');
                return;
            }

            this.products = res.sort(this.shopComparisonService.products);
            this.activeCategoryId = -1;
            this.isLoadingByStatus = false;
        }, (error: HttpErrorResponse) => {
            this.notificationService.createNotification(error.error.message);
            this.activeStatusId = previousStatusId;
            this.isLoadingByStatus = false;
        });
    }

    public sendCategoryToEditor(category: ShopCategory): void {
        const associatedProducts = this.products.filter((p, idx, arr) => p.category.id === category.id);
        this.shopEditorService.setCategory(new ShopCategory({
            ...category,
            products: associatedProducts
        }));
    }

    public deleteCategory(category: ShopCategory): void {
        if(!this.notificationService.deleteConfirmation('shop category')) return;

        this.shopApiService.deleteCategory(category.id).subscribe((res: any) => {
            this.categories = this.categories.filter(c => c.id !== category.id);

            this.notificationService.createNotification('Successfully deleted shop category!');
        }, (error: HttpErrorResponse) => {
            this.notificationService.createNotification(error.error.message, '', 3600);
        });
    }
}
