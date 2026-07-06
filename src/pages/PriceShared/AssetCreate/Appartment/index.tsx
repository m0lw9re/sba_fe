import {
  Button,
  Space,
  Typography,
  message,
  UploadFile,
  Tabs,
  Modal,
} from "antd";
import type { TabsProps } from "antd";
import { useFormik } from "formik";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PRICE_SHARED_APPARTMENT_CREATE_ASSET } from "routes/route.constant";
import Commant from "components/Commant";
import * as Yup from "yup";
import {
  ComparedAssetAppartmentCreateType,
  AssetImageType,
} from "constant/types";
import TableAssetInfo from "pages/PriceShared/AssetCreate/Appartment/TableAssetInfo";
import { initialValue } from "./config";
import { compareAssetsAPI } from "apis/compareAssets";
import { ASSET_PRICES_SHARED_TYPE, BUTTON_CODES } from "constant/common";
import { assetImageAPI } from "apis/assetImage";
import "./style.scss";
import { RcFile } from "antd/es/upload";
import { CommonGetAllParams } from "constants/types/common.type";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import TableCustom from "components/TableCustom";
import { ColumnsType } from "antd/es/table";

// hook
import { useDebounce } from "hooks/useDebounce";
import { validateCurrencyMaxLength } from "utils/validate";
import { isNotAllowed } from "utils/permission";
import { RootState } from "configs/configureStore";

const formCompareAssetSchema = Yup.object().shape({
  compareAssets: Yup.array().of(
    Yup.object().shape({
      dataSourceId: Yup.number()
        .required("Vui lòng nhập nguồn dữ liệu")
        .nullable(),
      infoSourceId: Yup.number()
        .required("Vui lòng nhập nguồn thông tin")
        .nullable(),
      contact: Yup.string().required("Vui lòng nhập SĐT"),
      transactionStatus: Yup.string().required("Vui lòng nhập tình trạng"),
      addressProvince: Yup.string().typeError("Vui lòng chọn Tỉnh/TP"),
      addressDistrict: Yup.string().typeError(
        "Vui lòng chọn Quận/Huyện/TP/Thị xã"
      ),
      addressWard: Yup.string()
        .required("Vui lòng chọn Xã/Phường/Thị trấn")
        .typeError("Vui lòng chọn Xã/Phường/Thị trấn"),
      // addressStreet: Yup.string().required("Vui lòng nhập đường phố"),
      positionName: Yup.string().required("Vui lòng nhập vị trí"),
      // mapSheetNumber: Yup.string().required("Vui lòng nhập số tờ"),
      // landPlotNumber: Yup.string().required("Vui lòng nhập số thửa"),
      privateUseArea: Yup.number().typeError("Vui lòng nhập diện tích"),
      buildupArea: Yup.number().nullable(),
      clearanceArea: Yup.number().nullable(),
      //.typeError("Vui lòng nhập diện tích 888"),
      // apartmentCode: Yup.number().typeError("Vui lòng mã căn hộ"),
      transactionPrice: validateCurrencyMaxLength.typeError(
        "Vui lòng nhập giá thương lượng"
      ),
      appraisalUnit: Yup.string().required("Vui lòng chọn đơn vị định giá"),
      // building: Yup.string().required("Vui lòng nhập thông tin tòa nhà"),
      // numberAppartment: Yup.number().typeError("Vui lòng nhập Số căn hộ/văn phòng"),
      estimatePrice: validateCurrencyMaxLength.typeError(
        "Vui lòng nhập giá rao bán"
      ),
      extendArea: Yup.string().nullable(),
      transactionTime: Yup.string().typeError(
        "Vui lòng chọn thời điểm giao dịch"
      ),
      unitPrice: validateCurrencyMaxLength
        .required("Vui lòng nhập đơn giá")
        .nullable(),
      latitude: Yup.number().typeError("Vui lòng nhập toạ độ X"),
      longitude: Yup.number().typeError("Vui lòng nhập toạ độ Y"),
    })
  ),
});

type FormDataType = {
  compareAssets: Array<ComparedAssetAppartmentCreateType>;
};

type UploadProps = {
  image: UploadFile[];
  index: number;
};

const Appartment = () => {
  const dispatch = useDispatch();
  const [note, setNote] = useState<string>("");
  const [listImage, setListImage] = useState<UploadProps[]>([]);

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "key",
      align: "center",
    },
    {
      key: 2,
      title: "Mã tài sản",
      dataIndex: "assetCode",
      align: "center",
    },
    {
      key: 3,
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
    },
  ];

  const checkDuplicatedData = async (
    data: Array<ComparedAssetAppartmentCreateType>
  ) => {
    const duplicateIndexes = [];
    // Iterate through each object in the array
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
      } else {
        // Nếu các dữ liệu tạo ra không trùng nhau thì check tiếp trên hệ thống đã tồn tại chưa
        let filters = {
          assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT,
          approved: true,
          addressProvince: currentObject.addressProvince?.split("-")[0],
          addressDistrict: currentObject.addressDistrict?.split("-")[0],
          addressWard: currentObject.addressWard?.split("-")[0],
          addressStreet: currentObject.addressStreet
            ? currentObject.addressStreet
            : "",
          addressDetail: currentObject.addressDetail
            ? currentObject.addressDetail
            : "",
          mapSheetNumber: currentObject.mapSheetNumber
            ? currentObject.mapSheetNumber
            : "",
          landPlotNumber: currentObject.landPlotNumber
            ? currentObject.landPlotNumber
            : "",
          positionId: currentObject.positionId,
        };
        const isDuplicateRes = await compareAssetsAPI.checkDuplicatedData(
          { ...params, page: params?.page ? params.page - 1 : 0 },
          filters
        );
        // If a duplicate is found, add the index to the result array
        if (
          isDuplicateRes.data.data?.length > 0 &&
          isDuplicateRes.data.message === "Thành công"
        ) {
          duplicateIndexes.push({
            data: isDuplicateRes.data,
            index: i,
          });
        }
      }
    }

    return duplicateIndexes;
  };
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const formControl = useFormik({
    initialValues: { compareAssets: initialValue } as FormDataType,
    validationSchema: formCompareAssetSchema,
    validateOnChange: true,
    onSubmit: async (data: FormDataType) => {
      let newImagesInfor: Array<AssetImageType> = [];
      try {
        const duplicateIndexes = await checkDuplicatedData(data.compareAssets);
        if (duplicateIndexes.length > 0) {
          const duplicateString = duplicateIndexes
            .map((item) => `Tài sản ${item.index + 1}`)
            .join(", ");
          message.error(
            `Dữ liệu giữa các tài sản trùng nhau: ${duplicateString}`
          ); // message alert
          if (duplicateIndexes[0].data !== "") {
            duplicateIndexes.map((item) =>
              item.data.data.map(
                (sub: any, index: number) => (sub.key = index + 1)
              )
            );

            const tabItems: TabsProps["items"] = duplicateIndexes.map(
              (item) => {
                const data = {
                  key: (item.index + 1).toString(),
                  label: `Tài sản ${item.index + 1}`,
                  children: (
                    <TableCustom
                      dataSource={item.data?.data}
                      columns={columns}
                      bordered
                      isLoading={false}
                      limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                      total={item.data?.data ? item.data?.totalCount : 0}
                      onLimitChange={(limit) => {
                        setParams({ ...params, limit });
                      }}
                      onPageChange={(page) => {
                        setParams({ ...params, page });
                      }}
                      page={params?.page ? params.page : 1}
                      scroll={{ x: 1366 }}
                    />
                  ),
                };
                return data;
              }
            );
            Modal.confirm({
              width: "70%",
              title: "Danh sách tài sản trùng lặp",
              okText: "Cập nhật",
              async onOk() {
                const dataUpdate: any = [];

                duplicateIndexes.map(async (item) => {
                  item.data.data.map((sub: any, index: number) => {
                    dataUpdate.push(data.compareAssets[index]);
                    dataUpdate.map((item: any) => {
                      item.assetId = sub.assetId; // Thêm assetId tài sản cập nhật
                      item.assetCode = sub.assetCode;
                      if (newImagesInfor && newImagesInfor.length > 0) {
                        newImagesInfor.map((image, index) => {
                          item.assetImage = image.ecmId;
                          return null;
                        });
                      }
                      let address = [];
                      if (item.addressDetail && item.addressDetail !== "") {
                        address.push(item.addressDetail);
                      }
                      if (item.addressStreet && item.addressStreet !== "") {
                        address.push(item.addressStreet);
                      }
                      if (item.addressWard && item.addressWard !== "") {
                        address.push(item.addressWard.split("-")[1]);
                        item.addressWard = item.addressWard.split("-")[0];
                      }
                      if (item.addressDistrict && item.addressDistrict !== "") {
                        address.push(item.addressDistrict.split("-")[1]);
                        item.addressDistrict =
                          item.addressDistrict.split("-")[0];
                      }
                      if (item.addressProvince && item.addressProvince !== "") {
                        address.push(item.addressProvince.split("-")[1]);
                        item.addressProvince =
                          item.addressProvince.split("-")[0];
                      }
                      item.address = address.join(", ");
                      return null;
                    });
                    return null;
                  });

                  const response = await compareAssetsAPI.updateStoredAssets(
                    dataUpdate,
                    ASSET_PRICES_SHARED_TYPE.APARTMENT
                  );
                  if (response.data.code === 200) {
                    message.success(`Cập nhật ${response.data.message}`);
                    duplicateIndexes.map((item, index) => {
                      const newCompareAsset = [...data.compareAssets];
                      newCompareAsset.splice(index, 1);
                      handleUpdateCompareAssets(newCompareAsset);
                      return null;
                    });
                  } else message.error(`Cập nhật ${response.data.message}`);
                  return null;
                });
              },
              cancelText: "Hủy",
              content: <Tabs defaultActiveKey="1" items={tabItems} />,
            });
          }
          return;
        }

        if (listImage && listImage.length > 0) {
          const formData = new FormData();
          listImage.map((item) => {
            formData.append("files", item.image[0].originFileObj as RcFile);
            return null;
          });
          try {
            const res = await assetImageAPI.uploadMultiFiles(
              "KhoGia",
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
            message.error("Cập nhật ảnh thất bại!");
            return;
          }
        }
        data.compareAssets.map((item, index) => {
          if (newImagesInfor && newImagesInfor.length > 0) {
            newImagesInfor.map((image, index) => {
              item.assetImage = image.ecmId;
              return null;
            });
          }
          let address = [];
          if (item.addressDetail && item.addressDetail !== "") {
            address.push(item.addressDetail);
          }
          if (item.addressStreet && item.addressStreet !== "") {
            address.push(item.addressStreet);
          }
          if (item.addressWard && item.addressWard !== "") {
            address.push(item.addressWard.split("-")[1]);
            item.addressWard = item.addressWard.split("-")[0];
          }
          if (item.addressDistrict && item.addressDistrict !== "") {
            address.push(item.addressDistrict.split("-")[1]);
            item.addressDistrict = item.addressDistrict.split("-")[0];
          }
          if (item.addressProvince && item.addressProvince !== "") {
            address.push(item.addressProvince.split("-")[1]);
            item.addressProvince = item.addressProvince.split("-")[0];
          }
          item.address = address.join(", ");
          return null;
        });
        const response =
          await compareAssetsAPI.createApartmentEstateStoredAsset(
            data.compareAssets,
            ASSET_PRICES_SHARED_TYPE.APARTMENT
          );
        if (response.data.code === 200) {
          message.success(`Tạo mới ${response.data.message}`);
          window.location.reload();
        } else message.error(`Tạo mới ${response.data.message}`);
      } catch {
        message.error("Lỗi thêm mới tài sản so sánh");
      }
    },
  });

  const debouncedNote = useDebounce(note, 250);

  useEffect(() => {
    formControl.values.compareAssets.map((item, index) => {
      item.sentiment = note;
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNote]);

  const handleUpdateCompareAssets = useCallback(
    (data: Array<ComparedAssetAppartmentCreateType>) => {
      formControl.setValues({ compareAssets: data });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formControl.values]
  );

  const handleSubmit = () => {
    formControl.submitForm();
  };

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Tạo tài sản",
        path: PRICE_SHARED_APPARTMENT_CREATE_ASSET,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SHARED_APPARTMENT_CREATE_ASSET]);

  return (
    <div
      style={{ width: "100%" }}
      className="priced-shared-appartment-asset-create-container"
    >
      <div className="page-container">
        <div className="header-wrapper">
          <Space className="title-wrapper" style={{ display: "flex" }} size={8}>
            <Typography className="title">
              Tạo tài sản căn hộ chung cư
            </Typography>
          </Space>
          <Space
            className="actions-wrapper"
            style={{ display: "flex", justifyContent: "end" }}
            size={4}
          >
            <Button
              className="btn-save"
              onClick={handleSubmit}
              disabled={isNotAllowed(
                currentPagePermissions,
                BUTTON_CODES.chcc_gui_duyet
              )}
            >
              Gửi duyệt
            </Button>
          </Space>
        </div>
        <Space direction="vertical" size="small" style={{ display: "flex" }}>
          <TableAssetInfo
            errors={formControl.errors}
            compareAssets={formControl.values.compareAssets}
            onChangeCompareAssets={handleUpdateCompareAssets}
            touched={formControl.touched}
            listImage={listImage}
            setListImage={setListImage}
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

export default Appartment;
