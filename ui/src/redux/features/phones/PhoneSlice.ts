import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { fetchPhonesApi, updatePhoneApi } from "./PhoneApi";

import type { PhoneState } from "./PhoneTypes";

// ================= FETCH PHONES =================

export const fetchPhones = createAsyncThunk(
  "phones/fetchPhones",

  async (_, thunkAPI) => {
    try {
      return await fetchPhonesApi();

    } catch (error: any) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch phones"
      );
    }
  }
);

// ================= INITIAL STATE =================

const initialState: PhoneState = {
  phones: [],

  loading: false,

  error: null,
};

// ================= SLICE =================

const phoneSlice = createSlice({
  name: "phones",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    // ================= PENDING =================

    builder.addCase(fetchPhones.pending, (state) => {
      state.loading = true;

      state.error = null;
    });

    // ================= SUCCESS =================

    builder.addCase(fetchPhones.fulfilled, (state, action) => {

      state.loading = false;

      state.phones = action.payload;
    });

    // ================= FAILED =================

    builder.addCase(fetchPhones.rejected, (state, action: any) => {

      state.loading = false;

      state.error = action.payload;
    });
  },
});


export const updatePhone =
  createAsyncThunk(

    "phones/updatePhone",

    async (
      {
        id,
        data,
      }: {
        id: string;
        data: any;
      },

      thunkAPI
    ) => {

      try {

        return await updatePhoneApi(
          id,
          data,
        );

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to update phone"
        );
      }
    }
  );

export default phoneSlice.reducer;