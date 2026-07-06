import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "configs/rootSaga";
import appSlice from "pages/App/store/appSlice";
import appraisalFileDetailSlice from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import appraisalFileCreateSlice from "pages/AppraisalFileCreate/store/appraisalFileCreateSlice";
import AccountDetailSlice from "pages/AccountDetail/store/AccountDetailSlice";
import accountantDebtDetailSlice from "pages/AccountantDebtDetail/store/accountantDebtDetailSlice";
import roleDetailSlice from "pages/RoleDetail/store/roleDetailSlice";
import PricesSlice from "pages/Prices/store/PricesSlice";
import getMenuPrice from "pages/Prices/subcomponents/PriceMenu/store/PriceMenuSlice";
import commonSlice from "./commonSlice";
import categoryKpiSlice from "../pages/CategoryManage/CategoryKpi/components/ConvertIndex/Store/CategoryKpiSlice";
import fastExpertiseSlice from "pages/FastExpertise/Store/fastExpertise";
import globalSlice from "./globalSlice";
import appendixMethodsSlice from "pages/AppendixMethods/store/appendixMethodsSlice";
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    appSlice,
    appraisalFileDetailSlice,
    accountantDebtDetailSlice,
    appraisalFileCreateSlice,
    AccountDetailSlice,
    roleDetailSlice,
    PricesSlice,
    getMenuPrice,
    commonSlice,
    categoryKpiSlice,
    fastExpertiseSlice,
    globalSlice,
    appendixMethodsSlice,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
