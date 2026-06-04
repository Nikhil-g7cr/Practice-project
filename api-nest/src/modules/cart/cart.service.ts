import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../../database/mongoose/schemas/cart.schema';
import { Phone } from '../../database/mongoose/schemas/phones.schema';
import { Laptop } from '../../database/mongoose/schemas/laptops.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel('Phone') private phoneModel: Model<Phone>,
    @InjectModel('Laptop') private laptopModel: Model<Laptop>,
  ) {}

  // --- CORE CALCULATION LOGIC ---
  calculateCartSummary(items: any[], couponDiscount = 0) {
    let subtotal = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      subtotal += item.discountPrice * item.quantity;
      totalDiscount +=
        (item.originalPrice - item.discountPrice) * item.quantity;
    });

    const gstAmount = subtotal * 0.18; // 18% GST
    const deliveryCharge = subtotal > 999 ? 0 : 49;
    const platformFee = 9;

    const finalAmount =
      subtotal + gstAmount + deliveryCharge + platformFee - couponDiscount;

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
    let cart = await this.cartModel
      .findOne({ userId })
      .populate('items.productId')
      .lean()
      .exec();

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
      (item) => item.productId.toString() === itemData.productId,
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

  // =========== CHECKOUT LOGIC ============
  async checkoutCart(userId: string) {
    // 1. Find the user's cart
    const cart = await this.cartModel.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    // 2. Process Inventory Deduction
    // We loop through the items array you defined in your schema
    // 2. Process Inventory Deduction
    for (const item of cart.items) {
      let product;

      // Execute the query safely on the specific model
      if (item.productModel === 'Phone') {
        product = await this.phoneModel.findById(item.productId);
      } else {
        product = await this.laptopModel.findById(item.productId);
      }

      if (!product) {
        throw new NotFoundException(`A product in your cart no longer exists.`);
      }

      // Check if enough stock exists (assuming stock is in storageVariants[0])
      const currentStock = product.storageVariants[0].stock;

      if (currentStock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${product.name}. Only ${currentStock} remaining.`,
        );
      }

      // Deduct the stock and save the product
      product.storageVariants[0].stock -= item.quantity;
      await product.save();
    }

    // 3. Clear the user's cart
    // Since you don't have a summary field in the schema, we just clear the items array
    cart.items = [];
    await cart.save();

    return {
      status: 'Success',
      message:
        'Payment processed successfully. Inventory updated and cart cleared.',
    };
  }
}
