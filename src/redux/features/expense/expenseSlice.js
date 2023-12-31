import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../services/supabase";

export const fetchExpense = createAsyncThunk(
  "expense/fetchExpense",
  async () => {
    try {
      let { data: expense, error } = await supabase
        .from("expense")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        return error;
      }
      return expense;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
);

export const insertExpense = createAsyncThunk(
  "expense/insertExpense",
  async (data, { dispatch }) => {
    try {
      const { error } = await supabase.from("expense").insert({
        name: data.expenseName,
        amount: data.expenseAmount,
        categories: data.expenseCategories,
        date: data.expenseDate,
      });
      dispatch(fetchExpense());
    } catch (error) {
      return error;
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async (id, { dispatch }) => {
    try {
      const { error } = await supabase.from("expense").delete().eq("id", id);
      dispatch(fetchExpense());
    } catch (error) {
      return error;
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expense/updateExpense",
  async (params, { dispatch }) => {
    try {
      const { error } = await supabase
        .from("expense")
        .update({
          name: params.data.expenseName,
          amount: params.data.expenseAmount,
          categories: params.data.expenseCategories,
          date: params.data.expenseDate,
        })
        .eq("id", params.id);
      dispatch(fetchExpense());
      if (error) {
        console.log(error);
      }
    } catch (error) {
      return error;
    }
  }
);

const initialState = {
  contents: [],
  isLoading: false,
  error: null,
};

export const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExpense.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchExpense.fulfilled, (state, action) => {
      state.isLoading = false;
      state.contents = action.payload;
    });
    builder.addCase(fetchExpense.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(insertExpense.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(insertExpense.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(insertExpense.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(deleteExpense.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateExpense.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});

export default expenseSlice.reducer;
