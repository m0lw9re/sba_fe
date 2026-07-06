/* eslint-disable react-hooks/exhaustive-deps */
import {
  AssetImageType,
  ComparedAssetAppartmentCreateType,
} from "constant/types";
import { useFormik } from "formik";
import TableAssetInfo from "./TableAssetInfo";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as Yup from "yup";
import { initialValue } from "./config";
import "./style.scss";
import { message } from "antd";
import { UploadProps } from "constant/types/common";
import { assetImageAPI } from "apis/assetImage";
import { RcFile } from "antd/es/upload";
import { compareAssetsAPI } from "apis/compareAssets";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { isDeepEqual, randomId } from "utils";
import { combineStoredAssetAddress } from "utils/storedAsset";
import { CompareAssetImagesType } from "hooks/useStoredAssetFuction";

const formSchema = Yup.object().shape({
  compareAssets: Yup.array().of(
    Yup.object().shape({
      dataSourceId: Yup.number()
        .required("Vui lòng nhập nguồn dữ liệu")
        .nullable(),
      infoSourceId: Yup.number()
        .required("Vui lòng nhập nguồn thông tin")
        .nullable(),
      contact: Yup.string().required("Vui lòng nhập SĐT").nullable(),
      transactionStatus: Yup.string()
        .required("Vui lòng nhập tình trạng")
        .nullable(),
      transactionTime: Yup.string()
        .required("Vui lòng nhập thời gian giao dịch")
        .nullable(),
      addressProvince: Yup.string()
        .required("Vui lòng chọn Tỉnh/TP")
        .nullable(),
      addressDistrict: Yup.string()
        .required("Vui lòng chọn Quận/Huyện/TP/Thị xã")
        .nullable(),
      addressWard: Yup.string()
        .required("Vui lòng chọn Xã/Phường/Thị trấn")
        .nullable(),
      addressStreet: Yup.string()
        .required("Vui lòng nhập đường phố")
        .nullable(),
      positionId: Yup.string().required("Vui lòng nhập vị trí").nullable(),
      // building: Yup.string()
      //   .required("Vui lòng nhập thông tin tòa nhà")
      //   .nullable(),
      // apartmentCode: Yup.string()
      //   .required("Vui lòng nhập mã căn hộ")
      //   .nullable(),
      // floorNo: Yup.number().required("Vui lòng nhập tầng số").nullable(),
      transactionPrice: Yup.number()
        .required("Vui lòng nhập giá giao dịch")
        .nullable(),
      estimatePrice: Yup.number()
        .required("Vui lòng nhập giá ước tính giao dịch")
        .nullable(),
      unitPrice: Yup.number().required("Vui lòng nhập đơn giá").nullable(),
      privateUseArea: Yup.number()
        .required("Vui lòng nhập diện tích sử dụng riêng")
        .nullable(),
      legal: Yup.string().nullable().required("Vui lòng nhập pháp lý"),
    })
  ),
});

type FormDataType = {
  compareAssets: Array<ComparedAssetAppartmentCreateType>;
};
type Props = {
  formType?: "add" | "edit";
  data: any;
  initAsset?: any;
};
type RefProps = {
  onCreateAsset: () => void;
};
const Apartment = forwardRef<RefProps, Props>(
  ({ formType, data: dataEdit, initAsset }: Props, ref) => {
    const [listImage, setListImage] = useState<UploadProps[]>([]);
    const checkDuplicatedData = async (
      data: Array<ComparedAssetAppartmentCreateType>
    ) => {
      const duplicateIndexes = [];
      for (let i = 0; i < data.length; i++) {
        const currentObject = data[i];

        // Check if the current object has the same values for the specified fields
        const isDuplicate = data.some(
          (obj, index) =>
            index !== i &&
            obj.apartmentCode === currentObject.apartmentCode &&
            obj.floorNo === currentObject.floorNo
        );
        if (isDuplicate) {
          duplicateIndexes.push({
            data: "",
            index: i,
          });
        }
      }
      return duplicateIndexes;
    };
    const formControl = useFormik({
      initialValues: { compareAssets: initialValue } as FormDataType,
      validationSchema: formSchema,
      validateOnChange: true,
      onSubmit: async (data: any) => {
        let newImagesInfor: CompareAssetImagesType[] = [];
        try {
          const duplicateIndexes = await checkDuplicatedData(
            data.compareAssets
          );
          if (duplicateIndexes.length > 0) {
            const duplicateString = duplicateIndexes
              .map((item) => `Tài sản ${item.index + 1}`)
              .join(", ");
            message.error(
              `Dữ liệu giữa các tài sản trùng nhau: ${duplicateString}`
            ); // message alert
            return;
          }

          const newListImage = listImage.filter(
            (item) => item.image.length !== 0
          );
          if (newListImage && newListImage.length > 0) {
            for (let index = 0; index < newListImage.length; index++) {
              const item = newListImage[index];
              const uploadedImages: AssetImageType[] = [];
              // append image to formData
              const formData = new FormData();
              item.image.forEach((element: any) => {
                if (element?.originFileObj) {
                  formData.append("files", element.originFileObj as RcFile);
                } else {
                  uploadedImages.push(element);
                }
              });
              // check item in formData
              if (formData.getAll("files").length > 0) {
                try {
                  // call upload api
                  const res = await assetImageAPI.uploadMultiFiles(
                    "KhoGia",
                    formData
                  );
                  // push uploaded image to list
                  uploadedImages.push(
                    ...res?.data?.body?.map((item: any) => {
                      return {
                        ...item,
                        assetImageId: null,
                        description: "",
                      };
                    })
                  );
                } catch (error: any) {
                  console.log(error);
                  message.error("Cập nhật ảnh thất bại!");
                }
              }

              newImagesInfor.push({
                index,
                image: uploadedImages,
              });
            }
          }

          const cloneCompareAssets = [...data.compareAssets].map((el) => ({
            ...el,
            key: randomId(),
          }));
          for (let i = 0; i < cloneCompareAssets.length; i++) {
            let item = cloneCompareAssets[i];

            if (newImagesInfor) {
              const newAssetImage = newImagesInfor?.[i]?.image
                .map((element) => element.ecmId)
                .join(";");
              // item.assetImage = newImagesInfor[indexImage]?.ecmId;
              item.assetImage = newAssetImage;
            } else item.assetImage = null;

            item.address = combineStoredAssetAddress(item);
          }

          if (formType === "edit") {
            const response = await compareAssetsAPI.updateStoredAssets(
              cloneCompareAssets,
              ASSET_PRICES_SHARED_TYPE.APARTMENT
            );
            if (response.data.code === 200) {
              message.success(`Cập nhật ${response.data.message}`);
              formControl.resetForm();
              // reset image list
              setListImage([]);
            } else {
              message.error(`Cập nhật ${response.data.message}`);
            }
            return response.data.data;
          } else {
            const response = await compareAssetsAPI.createLandEstateStoredAsset(
              cloneCompareAssets,
              ASSET_PRICES_SHARED_TYPE.APARTMENT
            );
            if (response.data.code === 200) {
              message.success(`Tạo mới ${response.data.message}`);
              formControl.resetForm();
              // reset image list
              setListImage([]);
            } else {
              message.error(`Tạo mới ${response.data.message}`);
            }
            return response.data.data;
          }
        } catch {
          message.error("Lỗi thêm mới tài sản so sánh");
          return null;
        }
      },
    });

    const handleUpdateCompareAssets = useCallback(
      (data: Array<any>) => {
        formControl.setValues({ compareAssets: data });
      },
      [JSON.stringify(formControl.values.compareAssets)]
    );
    useImperativeHandle(ref, () => ({
      onCreateAsset: handleSubmit,
    }));
    const handleSubmit = () => {
      return formControl.submitForm();
    };

    useEffect(() => {
      if (dataEdit && formType === "edit") {
        const data = {
          ...dataEdit,
          dataSourceId: dataEdit.dataSourceId,
          infoSourceId: dataEdit.infoSourceId,
          remainQuality: dataEdit.remainQuality * 100,
        };
        delete data.usingPurposeName;
        delete data.positionName;
        formControl.setValues({
          compareAssets: [data],
        });
      }

      if (initAsset && formType === "add") {
        const data = {
          ...initAsset,
          remainQuality: initAsset.remainQuality * 100,
        };
        delete data.usingPurposeName;
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
      <TableAssetInfo
        errors={formControl.errors}
        compareAssets={formControl.values.compareAssets}
        onChangeCompareAssets={handleUpdateCompareAssets}
        touched={formControl.touched}
        listImage={listImage}
        setListImage={setListImage}
        formType={formType}
      />
    );
  }
);

export default memo(Apartment);
