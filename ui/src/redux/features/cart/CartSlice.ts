import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';

// --- TYPES ---
export interface CartItemPayload {
  productId: string;
  productModel: 'Phone' | 'Laptop';
  quantity: number;
  originalPrice: number;
  discountPrice: number;
}

export interface CartSummary {
  subtotal: number;
  totalDiscount: number;
  gstAmount: number;
  deliveryCharge: number;
  platformFee: number;
  couponDiscount: number;
  finalAmount: number;
}

interface CartState {
  items: any[]; // You can type this stricter based on your Mongoose populated response
  summary: CartSummary;
  loading: boolean;
  error: string | null;
}

// --- ASYNC THUNKS (Calls to NestJS) ---

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/cart');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

// This single endpoint handles Add, Update Quantity, and Remove (if quantity is 0)
export const syncCartItem = createAsyncThunk(
  'cart/syncCartItem',
  async (itemData: CartItemPayload, { rejectWithValue }) => {
    try {
      const response = await API.post('/cart/sync', itemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync cart');
    }
  }
);

// --- INITIAL STATE ---

const initialState: CartState = {
  items: [],
  summary: {
    subtotal: 0,
    totalDiscount: 0,
    gstAmount: 0,
    deliveryCharge: 0,
    platformFee: 0,
    couponDiscount: 0,
    finalAmount: 0,
  },
  loading: false,
  error: null,
};

// --- SLICE ---

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Only use this when a user logs out to empty the UI
    clearLocalCart(state) {
      state.items = [];
      state.summary = initialState.summary;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Reusable success handler for both fetching and syncing
    const handleSuccess = (state: CartState, action: PayloadAction<any>) => {
      // We take the exactly calculated cart and summary directly from the NestJS response
      state.items = action.payload.cart.items;
      state.summary = action.payload.summary;
      state.loading = false;
      state.error = null;
    };

    builder
      // --- Fetch Cart Handlers ---
      .addCase(fetchCart.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, handleSuccess)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // --- Sync Cart Handlers ---
      .addCase(syncCartItem.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(syncCartItem.fulfilled, handleSuccess)
      .addCase(syncCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;