import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import {
  GetNotifyAllSeenPayload,
  GetNotifySuccessPayload,
  NotifyState,
} from "./store.type";
import { GetNotifyParams } from "constants/types/notify.type";

const checkToken = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  if (token) return true;
  else return false;
};

interface Page {
  path: string;
  label: string;
}

interface AppState {
  isLogged: boolean;
  account: object;
  logging: boolean;
  activeTab: string;
  collapsed: boolean;
  selectedKeys: Array<string>;
  breadCrumb: Array<Page>;

  notifyData: NotifyState;
  isReloadTable: boolean;
}

const initialState: AppState = {
  activeTab: "custom",
  logging: false,
  isLogged: checkToken(),
  account: {},
  collapsed: false,
  selectedKeys: [],
  breadCrumb: [],
  notifyData: {
    notifyList: [],
    totalPages: 0,
    currentPage: 0,
    error: "",
    isNotifyLoading: true,
  },
  isReloadTable: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    login: (state, action) => {
      state.logging = false;
      state.isLogged = true;
      state.account = action.payload;
    },
    logout: (state) => {
      state.isLogged = false;
      state.account = {};
      state.logging = false;
    },
    setCollapse: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
    changeActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedkeys: (state, action: PayloadAction<Array<string>>) => {
      state.selectedKeys = action.payload;
    },
    setSelectedBeadCrumb: (state, action: PayloadAction<Array<Page>>) => {
      state.breadCrumb = action.payload;
    },
    reloadTable: (state) => {
      state.isReloadTable = !state.isReloadTable;
    },
    setNotifyAllSeen: (state) => {},
    getNotifyAllSeen: (
      state,
      action: PayloadAction<GetNotifyAllSeenPayload>
    ) => {
      state.notifyData.notifyList = action.payload.notifyList;
    },
    getNotifyList: (state, action: PayloadAction<GetNotifyParams>) => {
      state.notifyData.isNotifyLoading = true;
    },
    getSuccessNotifyList: (
      state,
      action: PayloadAction<GetNotifySuccessPayload>
    ) => {
      state.notifyData = {
        ...state.notifyData,
        notifyList: [
          ...(state?.notifyData?.notifyList || []),
          ...(action?.payload?.notifyList || []),
        ],
        totalPages: action?.payload?.totalPages,
        currentPage: action?.payload?.currentPage,
        isNotifyLoading: false,
      };
    },
  },
});

export const {
  login,
  logout,
  changeActiveTab,
  setCollapse,
  setSelectedkeys,
  setSelectedBeadCrumb,
  reloadTable,
  getNotifyList,
  getSuccessNotifyList,
  setNotifyAllSeen,
  getNotifyAllSeen,
} = appSlice.actions;
export const getAccountLoggedIn = (state: any) => state.appSlice.account;
export const getIsLoggedIn = (state: any) => state.appSlice.isLogged;
export default appSlice.reducer;
