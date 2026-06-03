import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Phone, PhoneState } from "./PhoneTypes";
import { getPhoneByIdApi, getPhonesApi, updatePhoneApi } from "./PhoneApi";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const fetchPhones = createAsyncThunk(
  "phones/fetchPhones",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await getPhonesApi(page, limit);
      return { response, page };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch phones"));
    }
  },
);

export const getPhoneById = createAsyncThunk( "phones/getPhoneById",
  async(id:string,{rejectWithValue})=>{
    try{
      const response = await getPhoneByIdApi(id);
      return response;
    }catch(error:unknown){
      return rejectWithValue(getErrorMessage(error,"Failed to fetch phone"));
    }
  }
)


export const updatePhone = createAsyncThunk(
  "phones/updatePhone",
  async ({ id, data }: { id: string|undefined; data: Partial<Phone> }, { rejectWithValue }) => {
    try {
      return await updatePhoneApi(id, data);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to update phone"));
    }
  },
);

const initialState: PhoneState = {
  phones: [],
  currentPhone: null, // Add this to store the currently viewed phone
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
      // --- FETCH MULTIPLE PHONES ---
      .addCase(fetchPhones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhones.fulfilled, (state, action) => {
        state.loading = false;
        const { response, page } = action.payload;

        if (page === 1) {
          state.phones = response.data;
        } else {
          state.phones = [...state.phones, ...response.data];
        }
        state.meta = response.meta;
      })
      .addCase(fetchPhones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // --- GET PHONE BY ID (ADD THESE LINES) ---
      .addCase(getPhoneById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPhone = null; // Clear old data while loading new one
      })
      .addCase(getPhoneById.fulfilled, (state, action) => {
        state.loading = false;
        // Depending on your API, this might be action.payload.data or just action.payload
        state.currentPhone = action.payload.data || action.payload; 
      })
      .addCase(getPhoneById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- UPDATE PHONE ---
      .addCase(updatePhone.fulfilled, (state, action) => {
        const updatedPhone = action.payload.data;
        const index = state.phones.findIndex((p) => p._id === updatedPhone._id);

        if (index !== -1) {
          state.phones[index] = { ...state.phones[index], ...updatedPhone };
        }
        // If updating the currently viewed phone, update it here too
        if (state.currentPhone?._id === updatedPhone._id) {
           state.currentPhone = { ...state.currentPhone, ...updatedPhone };
        }
      });
  },
});

export default phoneSlice.reducer;
