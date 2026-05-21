// ui/src/redux/features/phones/PhoneSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Ensure you import your axios instance
import type { PhoneState } from "./PhoneTypes";

// 1. FETCH PHONES THUNK (With Pagination)
export const fetchPhones = createAsyncThunk(
  "phones/fetchPhones",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/phones?page=${page}&limit=${limit}`);
      return { response: response.data, page }; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
  }
);

// 2. UPDATE PHONE THUNK (Missing export fixed here)
export const updatePhone = createAsyncThunk(
  "phones/updatePhone",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/phones/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update phone");
    }
  }
);

const initialState: PhoneState = {
  phones: [],
  meta: null,
  loading: false,
  error: null,
};

const phoneSlice = createSlice({
  name: "phones",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch Phones Cases ---
      .addCase(fetchPhones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhones.fulfilled, (state, action) => {
        state.loading = false;
        const { response, page } = action.payload;
        
        if (page === 1) {
          state.phones = response.data; // First load: replace array
        } else {
          state.phones = [...state.phones, ...response.data]; // Load more: append
        }
        state.meta = response.meta; 
      })
      .addCase(fetchPhones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Update Phone Cases ---
      .addCase(updatePhone.fulfilled, (state, action) => {
        // Find the phone in the state array and update it so the UI reflects the change immediately
        const updatedPhone = action.payload.data;
        const index = state.phones.findIndex((p) => p._id === updatedPhone._id);
        
        if (index !== -1) {
          state.phones[index] = { ...state.phones[index], ...updatedPhone };
        }
      });
  },
});

export default phoneSlice.reducer;