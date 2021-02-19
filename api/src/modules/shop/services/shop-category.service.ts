import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PostgresErrorCodes } from '@api/core/database/postgres-error-codes.enum';
import { InternalServerErrorException } from '@api/core/http/exceptions/http.exception';

import { ShopCategory } from '../entities/shop-category.entity';
import { ShopCategoryAlreadyExistsException } from '../exceptions/shop-category.exception';

@Injectable()
export class ShopCategoryService {
    constructor(
        @InjectRepository(ShopCategory)
        private readonly shopCategoryRepository: Repository<ShopCategory>
    ) { }

    public async createCategory(categoryData: ShopCategory): Promise<ShopCategory> {
        const category: ShopCategory = this.shopCategoryRepository.create(categoryData);
        await this.shopCategoryRepository.save(category)
            .catch((error) => {
               if(error.code === PostgresErrorCodes.UNIQUE_VIOLATION)
                   throw new ShopCategoryAlreadyExistsException();
               else
                   throw new InternalServerErrorException();
            });

        return await this.getCategory(category.id);
    }

    public async getCategory(id: number): Promise<ShopCategory> {
        return await this.shopCategoryRepository
            .createQueryBuilder('sc')
            .where('sc.id = :id', { id: id })
            .getOne();
    }

    public async getCategories(): Promise<ShopCategory[]> {
        return await this.shopCategoryRepository
            .createQueryBuilder('sc')
            .getMany();
    }

    public async updateCategory(id: number, categoryData: ShopCategory): Promise<ShopCategory> {
        const newCategory = new ShopCategory({ id: id, ...categoryData });
        await this.shopCategoryRepository.save(newCategory);

        return await this.getCategory(id);
    }
}