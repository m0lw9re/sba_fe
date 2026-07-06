import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AssetImageType } from "constant/types";
interface Option {
  label: string;
  value: string | number;
}
export type ConstructionOptions = {
  [key: string | number]: Option[];
};
interface AppraisalFileState {
  assetLevelTwoId: number | null;
  typeCreated?: number | null;
  addressByLos?: string;
  constructionOptions?: ConstructionOptions[];
  isRotatingRedux?: boolean;
  listRedux?: AssetImageType[];
  documentOfParentAppraisalFile: string[]; // contain all ecmId of parent appraisal file
  listAppendixAssets: any[];
  isCompleteSurvey: boolean;
  startProcessReportDate?: string | null; // field check bắt đầu thực hiện tính thời gian (nút Lập tờ trình)
}

const initialState: AppraisalFileState = {
  assetLevelTwoId: null,
  typeCreated: 0,
  addressByLos: "",
  constructionOptions: [],
  isRotatingRedux: false,
  listRedux: [],
  documentOfParentAppraisalFile: [],
  listAppendixAssets: [],
  isCompleteSurvey: false,
  startProcessReportDate: null,
};

export const appraisalFileDetailSlice = createSlice({
  name: "appraisalFileDetail",
  initialState,
  reducers: {
    setAssetLevelTwoId: (state, action: PayloadAction<number | null>) => {
      state.assetLevelTwoId = action.payload;
    },
    setTypeCreated: (
      state,
      action: PayloadAction<number | null | undefined>
    ) => {
      state.typeCreated = action.payload;
    },
    setAddressByLos: (state, action: PayloadAction<string>) => {
      state.addressByLos = action.payload;
    },
    setConstructionOptions: (
      state,
      action: PayloadAction<ConstructionOptions[]>
    ) => {
      state.constructionOptions = [
        ...state.constructionOptions!,
        ...action.payload,
      ];
    },
    setRotating: (state, action: PayloadAction<boolean>) => {
      state.isRotatingRedux = action.payload;
    },
    setListRedux: (state, action: PayloadAction<AssetImageType[]>) => {
      state.listRedux = action.payload;
    },
    setListDocumentOfParentAppraisalFile: (
      state,
      action: PayloadAction<string[]>
    ) => {
      state.documentOfParentAppraisalFile = [...action.payload];
    },
    setListAppendixAssets: (state, action: PayloadAction<any[]>) => {
      state.listAppendixAssets = [...action.payload];
    },
    updateListAppendixAssets: (state, action: PayloadAction<any>) => {
      const dataUpdate = {
        ...state.listAppendixAssets[0],
        ...action.payload,
      };

      state.listAppendixAssets = [dataUpdate];
    },
    setIsCompleteSurvey: (state, action: PayloadAction<boolean>) => {
      state.isCompleteSurvey = action.payload;
    },
    setStartProcessReportDate: (state, action: PayloadAction<any>) => {
      state.startProcessReportDate = action.payload;
    },
  },
});

export const {
  setAssetLevelTwoId,
  setTypeCreated,
  setAddressByLos,
  setConstructionOptions,
  setRotating,
  setListRedux,
  setListDocumentOfParentAppraisalFile,
  setListAppendixAssets,
  updateListAppendixAssets,
  setIsCompleteSurvey,
  setStartProcessReportDate,
} = appraisalFileDetailSlice.actions;

export default appraisalFileDetailSlice.reducer;
