import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Defining the shape of a single cart item
export interface CartItem {
  _id: string; // Assuming MongoDB ObjectId format from your backend
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

// Defining the shape of our entire Cart state
export interface CartState {
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add an item to the cart (if it exists, increment the quantity)
    // Update the PayloadAction to accept the full CartItem (including quantity)
    addToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item._id === newItem._id);
      
      // Add the incoming quantity instead of just '1'
      state.totalQuantity += newItem.quantity;
      state.totalPrice += (newItem.price * newItem.quantity);

      if (!existingItem) {
        // Push the item exactly as it came in
        state.cartItems.push(newItem);
      } else {
        // Add the new quantity to the existing quantity
        existingItem.quantity += newItem.quantity;
      }
    },
    // Completely remove an item from the cart regardless of quantity
    removeFromCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item._id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= (existingItem.price * existingItem.quantity);
        state.cartItems = state.cartItems.filter(item => item._id !== id);
      }
    },
    
    // Increase or decrease the exact quantity of an existing item
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item._id === id);

      if (existingItem && quantity > 0) {
        const quantityDiff = quantity - existingItem.quantity;
        state.totalQuantity += quantityDiff;
        state.totalPrice += (existingItem.price * quantityDiff);
        existingItem.quantity = quantity;
      }
    },
    
    // Empty out the cart entirely
    clearCart(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;