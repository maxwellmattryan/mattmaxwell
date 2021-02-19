import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ShopCategoryAlreadyExistsException extends BadRequestException {
    constructor() {
        super('Shop category already exists.');
    }
}

export class ShopCategoryCouldNotBeUpdatedException extends BadRequestException {
    constructor() {
        super('Shop category could not be updated.');
    }
}

export class ShopCategoryWasNotFoundException extends NotFoundException {
    constructor() {
        super('Unable to find shop category.');
    }
}

export class ShopCategoriesWereNotFoundException extends NotFoundException {
    constructor() {
        super('Unable to find shop categories.');
    }
}