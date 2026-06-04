import { Controller, Get, Post, Body, UseGuards, Request, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../core/guards/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('sync')
  syncCartItem(@Request() req, @Body() itemData: any) {
    return this.cartService.syncCartItem(req.user.id, itemData);
  }

  // =============== CHECKOUT ENDPOINT ===============
  @Post('checkout')
  async processCheckout(@Req() req: any) {
    const userId = req.user.id || req.user._id; 
    return await this.cartService.checkoutCart(userId);
  }
}