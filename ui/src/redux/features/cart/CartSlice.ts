import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await API.get('/cart');
  return response.data;
});

export const syncCartItem = createAsyncThunk(
  'cart/syncCartItem',
  async (itemData: any) => {
    const response = await API.post('/cart/sync', itemData);
    return response.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
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
  },
  reducers: {},
  extraReducers: (builder) => {
    const handleSuccess = (state:any, action:any) => {
      state.items = action.payload.cart.items;
      state.summary = action.payload.summary;
      state.loading = false;
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, handleSuccess)
      .addCase(syncCartItem.fulfilled, handleSuccess);
  },
});

export default cartSlice.reducer;