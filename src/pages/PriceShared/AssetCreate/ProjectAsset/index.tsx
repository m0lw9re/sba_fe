import { Button, Space, Typography, message, UploadFile } from "antd";
import { useFormik } from "formik";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useCallback, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { PRICE_SHARED_PROJECT_CREATE_ASSET } from "routes/route.constant";
import { initialValue } from "./config";
import { AssetImageType, ComparedAssetProjectCreateType } from "constant/types";
import "pages/PriceShared/AssetCreate/ProjectAsset/style.scss";
import TableAssetInfo from "pages/PriceShared/AssetCreate/ProjectAsset/TableAssetInfo";
import Commant from "components/Commant";
import { compareAssetsAPI } from "apis/compareAssets";
import * as Yup from "yup";
import { ASSET_PRICES_SHARED_TYPE, BUTTON_CODES } from "constant/common";
import { assetImageAPI } from "apis/assetImage";

// hook
import { useDebounce } from "hooks/useDebounce";
import { RcFile } from "antd/es/upload";
import { RootState } from "configs/configureStore";
import { isNotAllowed } from "utils/permission";

type FormDataType = {
  compareAssets: Array<ComparedAssetProjectCreateType>;
};

type UploadProps = {
  image: UploadFile[],
  index: number;
}

const formCompareAssetSchema = Yup.object().shape({
  compareAssets: Yup.array().of(
    Yup.object().shape({
      dataSourceId: Yup.number().required("Vui lòng chọn nguồn dữ liệu").nullable(),
      infoSourceId: Yup.number().required("Vui lòng chọn nguồn thông tin").nullable(),
      contact: Yup.string().required("Vui lòng nhập SĐT"),
      transactionStatus: Yup.string().required("Vui lòng nhập tình trạng giao dịch"),
      addressProvince: Yup.string().typeError("Vui lòng chọn Tỉnh/TP"),
      addressDistrict: Yup.string().typeError(
        "Vui lòng chọn Quận/Huyện/TP/Thị xã"
      ),
      addressWard: Yup.string()
        .required("Vui lòng chọn Xã/Phường/Thị trấn")
        .typeError("Vui lòng chọn Xã/Phường/Thị trấn"),
      addressStreet: Yup.string().required("Vui lòng nhập đường phố"),
      positionName: Yup.string().required("Vui lòng nhập vị trí"),
      mapSheetNumber: Yup.string().required("Vui lòng nhập số tờ"),
      landPlotNumber: Yup.string().required("Vui lòng nhập số thửa"),
      areaWidth: Yup.number().typeError("Vui lòng nhập diện tích"),
      areaInplan: Yup.number().typeError("Vui lòng nhập diện tích"),
      areaUnplan: Yup.number().typeError("Vui lòng nhập diện tích").test(
        "areaUnplan-validation",
        "Diện tích không phù hợp quy hoạch = Diện tích khuôn viên - Diện tích phù hợp quy hoạch.",
        function (areaUnplan) {
          const { areaWidth, areaInplan } = this.parent;
          if (areaWidth && areaInplan) {
            return areaUnplan === areaWidth - areaInplan;
          }
          return true;
        }
      ),
      facadeLength: Yup.number().typeError("Vui lòng nhập kích thước"),
      priceInPlan: Yup.number().typeError("Vui lòng nhập kích thước"),
      transactionPrice: Yup.number().typeError("Vui lòng nhập giá thương lượng"),
      estimatePrice: Yup.number().typeError("Vui lòng nhập giá rao bán"),
      transactionTime: Yup.string().typeError("Vui lòng chọn thời điểm giao dịch"),
      usingPurposeName: Yup.string().required("Vui lòng chọn mục đích sử dụng đất"),
    })
  ),
});

const ProjectAsset = () => {
  const dispatch = useDispatch();
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice,
  );
  const [note, setNote] = useState<string>("");
  const [listImage, setListImage] = useState<UploadProps[]>([]);

  const formControl = useFormik({
    initialValues: { compareAssets: initialValue } as FormDataType,
    validationSchema: formCompareAssetSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      let newImagesInfor: Array<AssetImageType> = [];
      try {
        if (listImage && listImage.length > 0) {
          const formData = new FormData();
          listImage.map((item) => {
            formData.append("files", item.image[0].originFileObj as RcFile);
            return null;
          });
          try {
            const res = await assetImageAPI.uploadMultiFiles(
              'KhoGia',
              formData
            );
            newImagesInfor = res?.data?.body?.map((item: any) => {
              return {
                ...item,
                assetImageId: null,
                description: "",
              };
            });
          } catch (error: any) {
            console.log(error);
            message.error("Cập nhật ảnh thất bại!");
            return;
          }
        }
        data.compareAssets.map((item: any) => {
          if (newImagesInfor && newImagesInfor.length > 0) {
            newImagesInfor.map((image, index) => {
              item.assetImage = image.ecmId;
              return null;
            })
          }
          let address = [];
          if (item.addressDetail && item.addressDetail !== '') {
            address.push(item.addressDetail);
          }
          if (item.addressStreet && item.addressStreet !== '') {
            address.push(item.addressStreet);
          }
          if (item.addressWard && item.addressWard !== '') {
            address.push(item.addressWard.split("-")[1]);
            item.addressWard = item.addressWard.split("-")[0];
          }
          if (item.addressDistrict && item.addressDistrict !== '') {
            address.push(item.addressDistrict.split("-")[1]);
            item.addressDistrict = item.addressDistrict.split("-")[0];
          }
          if (item.addressProvince && item.addressProvince !== '') {
            address.push(item.addressProvince.split("-")[1]);
            item.addressProvince = item.addressProvince.split("-")[0];
          }
          item.address = address.join(', ');
          return null;
        });
        const response = await compareAssetsAPI.createLandEstateStoredAsset(
          data.compareAssets,
          ASSET_PRICES_SHARED_TYPE.PROJECT
        );
        if (response.data.code === 200) {
          message.success(`Tạo mới ${response.data.message}`);
          window.location.reload();
        } else message.error(`Tạo mới ${response.data.message}`);
      } catch {
        message.error("Lỗi thêm mới tài sản so sánh");
      }
    }
  });

  const debouncedNote = useDebounce(note, 250);

  useEffect(() => {
    formControl.values.compareAssets.map((item: any, index: number) => {
      item.sentiment = note;
      return null;
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNote]);

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Tạo tài sản so sánh",
        path: PRICE_SHARED_PROJECT_CREATE_ASSET,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SHARED_PROJECT_CREATE_ASSET]);

  const handleSubmit = () => {
    formControl.submitForm();
  };

  const handleUpdateCompareAssets = useCallback(
    (data: Array<ComparedAssetProjectCreateType>) => {
      formControl.setValues({ compareAssets: data });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formControl.values]
  );

  return (
    <div
      style={{ width: "100%" }}
      className="priced-shared-device-create-container"
    >
      <div className="page-container">
        <div className="header-wrapper">
          <Space className="title-wrapper" style={{ display: "flex" }} size={8}>
            <Typography className="title">
              Tạo tài sản Dự án
            </Typography>
          </Space>
          <Space
            className="actions-wrapper"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <Button className="btn-save" onClick={handleSubmit}
              disabled={
                isNotAllowed(currentPagePermissions, BUTTON_CODES.duan_gui_duyet)
              }
            >
              Gửi duyệt
            </Button>
          </Space>
        </div>
        <Space direction="vertical" size={"small"} style={{ display: "flex" }}>
          <TableAssetInfo
            errors={formControl.errors}
            compareAssets={formControl.values.compareAssets}
            onChangeCompareAssets={handleUpdateCompareAssets}
            touched={formControl.touched}
            listImage={listImage}
            setListImage={setListImage}
          />
          <Commant value={note} onChange={(e) => {
            setNote(e);
          }} />
        </Space>
      </div>
    </div>
  );
};

export default ProjectAsset;
