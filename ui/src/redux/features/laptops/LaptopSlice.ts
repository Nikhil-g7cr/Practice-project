import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getLaptopsApi, updateLaptopApi } from "./LaptopApi";
import type { Laptop, LaptopState } from "./LaptopTypes";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const fetchLaptops = createAsyncThunk(
  "laptops/fetchLaptops",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await getLaptopsApi(page, limit);
      return { response, page };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch laptops"));
    }
  },
);

export const updateLaptop = createAsyncThunk(
  "laptops/updateLaptop",
  async (
    { id, data }: { id: string; data: Partial<Laptop> },
    { rejectWithValue },
  ) => {
    try {
      return await updateLaptopApi(id, data);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to update laptop"));
    }
  },
);

const initialState: LaptopState = {
  laptops: [],
  meta: null,
  loading: false,
  error: null,
};

const laptopSlice = createSlice({
  name: "laptops",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaptops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaptops.fulfilled, (state, action) => {
        state.loading = false;
        const { response, page } = action.payload;

        if (page === 1) {
          state.laptops = response.data;
        } else {
          state.laptops = [...state.laptops, ...response.data];
        }

        state.meta = response.meta;
      })
      .addCase(fetchLaptops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLaptop.fulfilled, (state, action) => {
        const updatedLaptop = action.payload.data;
        const index = state.laptops.findIndex(
          (laptop) => laptop._id === updatedLaptop._id,
        );

        if (index !== -1) {
          state.laptops[index] = {
            ...state.laptops[index],
            ...updatedLaptop,
          };
        }
      });
  },
});

export default laptopSlice.reducer;
