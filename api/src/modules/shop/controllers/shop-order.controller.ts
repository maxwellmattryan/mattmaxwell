import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { JwtAuthGuard } from '@api/core/auth/jwt/jwt-auth.guard';

import { ShopOrder } from '../entities/shop-order.entity';
import { ShopOrderService } from '../services/shop-order.service';

@Controller('shop/orders')
export class ShopOrderController {
    constructor(
        private readonly shopOrderService: ShopOrderService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    public async createOrder(@Req() request: Request): Promise<ShopOrder> {
        return this.shopOrderService.createOrder(request.body);
    }
}
