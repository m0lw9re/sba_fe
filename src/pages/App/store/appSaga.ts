import { PayloadAction } from "@reduxjs/toolkit";
import { notifyApi } from "apis/notify";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { GetNotifyAllSeenPayload, GetNotifySuccessPayload } from "./store.type";
import {
  getNotifyAllSeen,
  getNotifyList,
  getSuccessNotifyList,
  setNotifyAllSeen,
} from "./appSlice";
import { GetNotifyParams } from "constants/types/notify.type";
import { RootState } from "configs/configureStore";
import { NotifyType } from "constant/types/notity";
import { useNotifyList } from "utils/request";
import { mutate } from "swr";

function* getNotifyListSaga(action: PayloadAction<GetNotifyParams>): unknown {
  try {
    const res = yield call(notifyApi.getNotifyList, action.payload);
    const payload: GetNotifySuccessPayload = {
      notifyList: res.data.data.data,
      totalPages: res.data.data.totalPages,
      currentPage: res.data.data.page,
    };
    yield put({
      type: getSuccessNotifyList.type,
      payload,
    });
  } catch (error) {
    yield put({ type: getSuccessNotifyList.type });
  }
}

function* setNotifyAllSeenSaga(): unknown {
  try {
    const notifyListState = yield select(
      (state: RootState) => state.appSlice.notifyData.notifyList
    );
    const res = yield call(notifyApi.updateAllSeen);
    if ((res.data.data = true)) {
      yield call(mutate, "/bussiness/api/v1/filestatushistory/countnotseen");

      const payload: GetNotifyAllSeenPayload = {
        notifyList: notifyListState.map((item: NotifyType) => ({
          ...item,
          status: 1,
        })),
      };

      yield put({
        type: getNotifyAllSeen.type,
        payload,
      });
    }
  } catch (error) {}
}

function* appSaga() {
  yield takeLatest(getNotifyList.type, getNotifyListSaga);
  yield takeLatest(setNotifyAllSeen.type, setNotifyAllSeenSaga);
}

export default appSaga;
