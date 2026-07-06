import { Button, Space, Typography, message } from "antd";
import Commant from "components/Commant";
import { initialValue } from "components/CompareAsset/Land/config";
import { ASSET_PRICES_SHARED_TYPE, BUTTON_CODES, ROLES } from "constant/common";
import { useFormik } from "formik";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";

import "pages/PriceShared/AssetCreate/LandUsing/style.scss";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateCompareAssetForm from "components/CompareAsset/Land/CreateCompareAssetForm";
import { useDebounce } from "hooks/useDebounce";
import "pages/PriceShared/AssetCreate/EstimateAsset/style.scss";
import { PRICE_SHARED_ESTIMATE_CREATE_ASSET } from "routes/route.constant";
import { isContainRole } from "utils/common";

// hook
import { formStoredAssetLandSchema } from "components/CompareAsset/Land/config";
import { ComparedAssetLandType } from "constant/types/compareAsset";
import useStoredAssetLandFunction from "hooks/useStoredAssetFuction";
import { isNotAllowed } from "utils/permission";
import { RootState } from "configs/configureStore";

type FormDataType = {
  compareAssets: Array<ComparedAssetLandType>;
};
const CreatePriceShared = () => {
  const dispatch = useDispatch();
  const [note, setNote] = useState<string>("");
  const isCvtd = isContainRole(ROLES.CVTD);

  const formControl = useFormik({
    initialValues: { compareAssets: initialValue } as FormDataType,
    validationSchema: formStoredAssetLandSchema,
    onSubmit: async () => {
      const isDuplicated = await handleProcessDuplicatedData();
      if (isDuplicated) return;

      const { newImagesInfor, newListImage, isError } =
        await handleUploadImages();
      if (isError) return;
      try {
        const cloneCompareAssets = handleCloneStoredAsset({
          newImagesInfor,
          newListImage,
        });
        const result = await handleCreateStoredAsset(cloneCompareAssets);
        return result;
      } catch (error) {
        message.error("Lỗi thêm mới tài sản so sánh");
        return null;
      }
    },
  });
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );
  const handleUpdateCompareAssets = useCallback(
    (data: Array<ComparedAssetLandType>) => {
      formControl.setValues({ compareAssets: data });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(formControl.values)]
  );
  const {
    handleProcessDuplicatedData,
    handleUploadImages,
    handleCreateStoredAsset,
    handleCloneStoredAsset,

    listImage,
    districtOptions,
    wardOptions,
    onChangeDataField,
    setWardOptions,
    setDistrictOptions,
    handleGetDistrictAndWard,
  } = useStoredAssetLandFunction({
    compareAssetsData: formControl.values.compareAssets,
    assetType: ASSET_PRICES_SHARED_TYPE.PLAN_USING,
    onResetForm: formControl.resetForm,
    onChangeCompareAssets: handleUpdateCompareAssets,
  });

  const debouncedNote = useDebounce(note, 250);

  useEffect(() => {
    formControl.values.compareAssets.map((item: any, index: number) => {
      item.sentiment = note;
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNote]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Tạo tài sản so sánh",
        path: PRICE_SHARED_ESTIMATE_CREATE_ASSET,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SHARED_ESTIMATE_CREATE_ASSET]);

  const handleSubmit = () => {
    formControl.submitForm();
  };

  return (
    <div
      style={{ width: "100%" }}
      className="priced-shared-land-using-asset-create-container"
    >
      <div className="page-container">
        <div className="header-wrapper">
          <Space className="title-wrapper" style={{ display: "flex" }} size={8}>
            <Typography className="title">Tạo tài sản</Typography>
          </Space>
          <Space
            className="actions-wrapper"
            style={{ display: "flex", justifyContent: "end" }}
            size={4}
          >
            <Button
              className="btn-save"
              onClick={handleSubmit}
              disabled={!isCvtd || isNotAllowed(currentPagePermissions, BUTTON_CODES.bds_gui_duyet)}
            >
              Gửi duyệt
            </Button>
          </Space>
        </div>
        <Space direction="vertical" size="small" style={{ display: "flex" }}>
          <CreateCompareAssetForm
            errors={formControl.errors}
            compareAssets={formControl.values.compareAssets}
            onChangeCompareAssets={handleUpdateCompareAssets}
            touched={formControl.touched}
            formType={"add"}
            listImage={listImage}
            districtOptions={districtOptions}
            wardOptions={wardOptions}
            setDistrictOptions={setDistrictOptions}
            setWardOptions={setWardOptions}
            onChangeDataField={onChangeDataField}
            handleGetDistrictAndWard={handleGetDistrictAndWard}
            isDisabled={!isCvtd}
          />
          <Commant
            value={note}
            onChange={(e) => {
              setNote(e);
            }}
          />
        </Space>
      </div>
    </div>
  );
};

export default CreatePriceShared;
