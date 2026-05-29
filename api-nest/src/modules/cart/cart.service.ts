import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../../database/mongoose/schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  // --- CORE CALCULATION LOGIC ---
  calculateCartSummary(items: any[], couponDiscount = 0) {
    let subtotal = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      subtotal += item.discountPrice * item.quantity;
      totalDiscount += (item.originalPrice - item.discountPrice) * item.quantity;
    });

    const gstAmount = subtotal * 0.18; // 18% GST
    const deliveryCharge = subtotal > 999 ? 0 : 49;
    const platformFee = 9;

    const finalAmount = subtotal + gstAmount + deliveryCharge + platformFee - couponDiscount;

    return {
      subtotal,
      totalDiscount,
      gstAmount,
      deliveryCharge,
      platformFee,
      couponDiscount,
      finalAmount,
    };
  }

  // --- GET CART ---
  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId }).populate('items.productId').lean().exec();
    
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [] });
    }

    const summary = this.calculateCartSummary(cart.items);
    
    return { cart, summary };
  }

  // --- ADD OR UPDATE ITEM ---
  async syncCartItem(userId: string, itemData: any) {
    let cart = await this.cartModel.findOne({ userId });
    
    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === itemData.productId
    );

    if (itemIndex > -1) {
      // If quantity is 0, remove the item
      if (itemData.quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        // Update existing quantity
        cart.items[itemIndex].quantity = itemData.quantity;
      }
    } else if (itemData.quantity > 0) {
      // Add new item
      cart.items.push(itemData);
    }

    await cart.save();
    return this.getCart(userId); // Return updated cart + new summary
  }
}