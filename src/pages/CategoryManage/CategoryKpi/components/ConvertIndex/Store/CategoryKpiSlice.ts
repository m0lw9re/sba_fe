import {PayloadAction, createSlice} from "@reduxjs/toolkit";

interface State {
  activeKeyModal: string;
  kpiGroupId: any;
  modalType: "add" | "edit" | null;
  record?: any;
}

const initialState: State = {
  activeKeyModal: "1",
  kpiGroupId: null,
  modalType: null,
  record: null,
};

export const categoryKpiSlice = createSlice({
  name: "categoryKpi",
  initialState,
  reducers: {
    setActiveKeyModal: (state = initialState, action: PayloadAction<any>) => {
      state.activeKeyModal = action.payload;
    },
    setKpiGroupId: (state = initialState, action: PayloadAction<any>) => {
      state.kpiGroupId = action.payload;
    },
    setModalType: (state = initialState, action: PayloadAction<any>) => {
      state.modalType = action.payload;
    },
    setRecord: (state = initialState, action: PayloadAction<any>) => {
      state.record = action.payload;
    },
  },
});

export const {setActiveKeyModal, setKpiGroupId, setModalType, setRecord} =
  categoryKpiSlice.actions;

export default categoryKpiSlice.reducer;