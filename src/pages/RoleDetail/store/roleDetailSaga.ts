import { roleApi } from "../../../apis/role";
import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { GetDetailCustomerParams } from "../../../constants/types/common.type";
import {
  getDetailRoleSuccess,
  getDetailRole,
  getDetailRoleFailed,
  getListStaff,
  getListStaffFailed,
  getListStaffSuccess,
} from "./roleDetailSlice";
import { GetDetailRoleSuccessPayload, GetStaffListSuccess } from "./store.type";
import { GetStaffListByRoleId } from "../../../constants/types/role.type";
import { accountApi } from "../../../apis/account";

function* getDetailRoleSaga(
  action: PayloadAction<GetDetailCustomerParams>
): unknown {
  try {
    const response = yield call(roleApi.getOne, action.payload);
    const payload: GetDetailRoleSuccessPayload = {
      roleId: response.data.body.roleId,
      roleName: response.data.body.roleName,
      dateCreate: response.data.body.dateCreate,
      dateModify: response.data.body.dateModify,
      departmentId: response.data.body.departmentId,
      departmentName: response.data.body.departmentName,
      description: response.data.body.description,
      permissionGroupDtos: response.data.body.permissionGroupDtos,
      status: response.data.body.status,
    };
    yield put({
      type: getDetailRoleSuccess.type,
      payload,
    });
  } catch (error) {
    yield put({ type: getDetailRoleFailed.type });
  }
}

function* getStaffListByRoleIdSaga(
  action: PayloadAction<GetStaffListByRoleId>
): unknown {
  try {
    const response = yield call(accountApi.getByRoleId, action.payload);
    const payload: GetStaffListSuccess = {
      data: response.data.data,
      limit: response.data.limit,
      page: response.data.page,
      total: response.data.total,
    };

    yield put({
      type: getListStaffSuccess.type,
      payload,
    });
  } catch (error) {
    yield put({ type: getListStaffFailed.type });
  }
}

function* mySaga() {
  yield takeLatest(getDetailRole.type, getDetailRoleSaga);
  yield takeLatest(getListStaff.type, getStaffListByRoleIdSaga);
}

export default mySaga;
