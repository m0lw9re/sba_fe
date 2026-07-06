/* eslint-disable react-hooks/exhaustive-deps */
import CreateCompareAssetForm from "components/CompareAsset/Land/CreateCompareAssetForm";
import {
  formStoredAssetLandSchema,
  initialValue,
} from "components/CompareAsset/Land/config";
import { ComparedAssetLandType } from "constant/types/compareAsset";
import { useFormik } from "formik";
import useStoredAssetLandFunction from "hooks/useStoredAssetFuction";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { useLocation } from "react-router-dom";
import "./style.scss";
import { message } from "antd";
import { isDeepEqual } from "utils";

type FormDataType = {
  compareAssets: Array<ComparedAssetLandType>;
};
type Props = {
  assetType: number;
  formType?: "add" | "edit";
  data: any;
  initAsset?: any;
};
type RefProps = {
  onCreateAsset: () => void;
};

const CreateLandUsingForm = forwardRef<RefProps, Props>(
  ({ assetType, formType, data: dataEdit, initAsset }: Props, ref) => {
    const { state } = useLocation();
    const { valuationMethodId } = state;

    const formControl = useFormik({
      initialValues: { compareAssets: initialValue } as FormDataType,
      validationSchema: formStoredAssetLandSchema,
      validateOnChange: false,
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

          if (formType === "edit") {
            const result = await handleEditStoredAsset(cloneCompareAssets);
            return result;
          } else {
            const result = await handleCreateStoredAsset(cloneCompareAssets);
            return result;
          }
        } catch (error) {
          message.error("Lỗi thêm mới tài sản so sánh");
          return null;
        }
      },
    });
    const handleUpdateCompareAssets = useCallback(
      (data: Array<ComparedAssetLandType>) => {
        formControl.setValues({ compareAssets: data });
      },
      [JSON.stringify(formControl.values.compareAssets)]
    );

    const {
      handleProcessDuplicatedData,
      handleUploadImages,
      handleCreateStoredAsset,
      handleEditStoredAsset,
      handleCloneStoredAsset,

      listImage,
      setListImage,
      districtOptions,
      onChangeDataField,
      wardOptions,
      setDistrictOptions,
      setWardOptions,
      handleGetDistrictAndWard,
    } = useStoredAssetLandFunction({
      compareAssetsData: formControl.values.compareAssets,
      assetType,
      onResetForm: formControl.resetForm,
      onChangeCompareAssets: handleUpdateCompareAssets,
    });

    useImperativeHandle(ref, () => ({
      onCreateAsset: handleSubmit,
    }));

    const handleSubmit = () => {
      return formControl.submitForm();
    };

    useEffect(() => {
      if (dataEdit && formType === "edit") {
        formControl.setValues({
          compareAssets: [dataEdit],
        });
      }

      if (initAsset && formType === "add") {
        const data = {
          ...initAsset,
          remainQuality: initAsset.remainQuality * 100,
          areaUnplan: initAsset.areaWidth - initAsset.areaInplan,
          usingPurposeConsolidationIds: initAsset?.usingPurposeConsolidationIds
            ? initAsset?.usingPurposeConsolidationIds
                ?.split(",")
                .map((id: string) => Number(id))
            : [],
        };
        delete data.usingPurposeName;
        // delete data.infoSourceId;
        delete data.positionName;

        if (
          formControl.values.compareAssets.length === 1 &&
          isDeepEqual(formControl.values.compareAssets[0], initialValue[0])
        ) {
          formControl.setValues({
            compareAssets: [{ ...data }],
          });
        } else {
          formControl.setValues({
            compareAssets: [...formControl.values.compareAssets, { ...data }],
          });
        }
      }
    }, [JSON.stringify(dataEdit), JSON.stringify(initAsset)]);

    return (
      <CreateCompareAssetForm
        errors={formControl.errors}
        compareAssets={formControl.values.compareAssets}
        onChangeCompareAssets={handleUpdateCompareAssets}
        touched={formControl.touched}
        formType={formType}
        listImage={listImage}
        setListImage={setListImage}
        districtOptions={districtOptions}
        wardOptions={wardOptions}
        valuationMethodId={valuationMethodId}
        setDistrictOptions={setDistrictOptions}
        setWardOptions={setWardOptions}
        onChangeDataField={onChangeDataField}
        handleGetDistrictAndWard={handleGetDistrictAndWard}
      />
    );
  }
);

export default memo(CreateLandUsingForm);
