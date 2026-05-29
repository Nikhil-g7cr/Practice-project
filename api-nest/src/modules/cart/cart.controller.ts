import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
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
    // itemData should look like: { productId, productModel: "Phone", quantity, originalPrice, discountPrice }
    return this.cartService.syncCartItem(req.user.id, itemData);
  }
}