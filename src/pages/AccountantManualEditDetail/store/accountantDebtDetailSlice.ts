import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Key } from "react";

interface TotalDebtState {
  totalDebtValue: number;
  totalRevenueValue: number;
}

interface AccountantDebtDetailState {
  totalDebt?: TotalDebtState;
  selectedRowKeysRedux: React.Key[];
}

const initialState: AccountantDebtDetailState = {
  totalDebt: {
    totalDebtValue: 0,
    totalRevenueValue: 0,
  },
  selectedRowKeysRedux: [],
};

export const accountantDebtDetailSlice = createSlice({
  name: "accountantDebtDetail",
  initialState,
  reducers: {
    setTotalDebt: (state, action: PayloadAction<TotalDebtState>) => {
      state.totalDebt = action.payload;
    },
    setSelectedRowKeysRedux: (state, action: PayloadAction<React.Key[]>) => {
      state.selectedRowKeysRedux = action.payload;
    },
  },
});

export const { setTotalDebt, setSelectedRowKeysRedux } =
  accountantDebtDetailSlice.actions;

export default accountantDebtDetailSlice.reducer;
