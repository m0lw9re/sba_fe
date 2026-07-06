/* eslint-disable react-hooks/exhaustive-deps */
import { Card, message } from "antd";
import { addressApi } from "apis/adress";
import { compareAssetsAPI } from "apis/compareAssets";
import renderRequired from "components/RenderRequire";
import TableAddColEdit from "components/TableAddColEdit";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import { ASSET_PRICES_SHARED_TYPE, VIETNAM_ID } from "constant/common";
import { ASSET_LV2, DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import {
  AssetLevelThreeType,
  ComparedAssetWaterVehicleType,
  DistrictType,
  WardType,
} from "constant/types";
import { OptionType, UploadProps } from "constant/types/common";
import dayjs from "dayjs";
import { useFormik } from "formik";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { randomId } from "utils";
import { loadSingleImage } from "utils/loadImage";
import { useAssetLevelThree, useManufactoringCountry } from "utils/request";
import {
  combineStoredAssetAddress,
  handleUploadImages,
} from "utils/storedAsset";
import { isDeepEqual, transformRowSchemaToColumnSchema } from "utils/validate";
import {
  defaultItem,
  initialValue,
  waterVehicleCompareAssetFormSchema,
} from "./config";

type FormDataType = {
  compareAssets: ComparedAssetWaterVehicleType[];
};

type Props = {
  formType?: "add" | "edit" | "view";
  assetLevelThreeId: number;
};
type RefProps = {
  onSubmit: () => void;
  setValues: (data: ComparedAssetWaterVehicleType[]) => void;
  values: ComparedAssetWaterVehicleType[];
};

const {
  INPUT,
  SELECT,
  IMAGE,
  DAY_PICKER,
  INPUT_NUMBER,
  PERCENT,
  INPUT_NUMBER_ONLY,
} = TYPE_FIELD;

const StoredAssetWaterVehicleForm = forwardRef<RefProps, Props>(
  (props, ref) => {
    const { formType = "add", assetLevelThreeId } = props;
    const isView = formType === "view";
    const dataAssetLevelThrees = useAssetLevelThree(ASSET_LV2.WATER_VEHICLE);
    const {
      dataSourceOptions,
      infoSourceOptions,
      provinceOptions,
      waterVehicleBrandOptions,
    } = useSelector((state: RootState) => state.globalSlice);

    const [districtOptions, setDistrictOptions] = useState<OptionType[][]>([]);
    const [wardOptions, setWardOptions] = useState<OptionType[][]>([]);
    const [isMfgInVietnam, setIsMfgInVietnam] = useState<Array<boolean> | null>(
      [true]
    );

    const [colTable, setColTable] = useState<ColumnsEdit>([]);
    const [listImage, setListImage] = useState<UploadProps[]>([]);

    const { data: manufactoringCountries } = useManufactoringCountry();

    const formControl = useFormik({
      initialValues: { compareAssets: initialValue } as FormDataType,
      validationSchema: waterVehicleCompareAssetFormSchema,
      validateOnChange: true,
      onSubmit: async (data: FormDataType) => {
        try {
          // upload images
          const { newImagesInfor, isError } = await handleUploadImages(
            listImage
          );
          if (isError) return;

          // join image, process data before submit
          const cloneCompareAssets: any = [...data.compareAssets].map((el) => ({
            ...el,
            approved: el.approved === false ? null : el.approved,
            key: randomId(),
          }));

          for (let i = 0; i < cloneCompareAssets.length; i++) {
            let item = cloneCompareAssets[i];
            if (newImagesInfor) {
              const newAssetImage = newImagesInfor?.[i]?.image
                .map((element) => element.ecmId)
                .join(";");
              item.assetImage = newAssetImage;
            } else item.assetImage = null;

            item.address = combineStoredAssetAddress(item);
          }

          if (formType === "edit" || formType === "view") {
            const response = await compareAssetsAPI.updateStoredAssets(
              cloneCompareAssets,
              ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE
            );
            if (response.data.code === 200) {
              message.success(`Cập nhật ${response.data.message}`);
              formControl.resetForm();
              setListImage([]);
              return response.data.data;
            } else {
              message.error(`Cập nhật ${response.data.message}`);
            }
          } else {
            const response =
              await compareAssetsAPI.createRoadVehicleEstateStoredAsset(
                cloneCompareAssets,
                ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE
              );
            if (response.data.code === 200) {
              message.success(`Tạo mới ${response.data.message}`);
              formControl.resetForm();
              setListImage([]);
              return response.data.data;
            } else {
              message.error(`Tạo mới ${response.data.message}`);
            }
          }
        } catch {
          // message.error('Lỗi thêm mới tài sản so sánh');
        }
      },
    });

    const handleReplaceDistrictOptions = (
      index: number,
      newItemOptions: OptionType[]
    ) => {
      const newOptions = [...districtOptions];
      newOptions.splice(index, 1, newItemOptions);
      setDistrictOptions(newOptions);
    };

    const handleReplaceWardOptions = (
      index: number,
      newItemOptions: OptionType[]
    ) => {
      const newOptions = [...wardOptions];
      newOptions.splice(index, 1, newItemOptions);
      setWardOptions(newOptions);
    };

    const compareAssets = formControl.values.compareAssets;
    const handleUpdateForm = useCallback(
      (data: Array<ComparedAssetWaterVehicleType>) => {
        formControl.setValues({ compareAssets: data });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [formControl.values]
    );
    // table logic: add, sub, copy,...
    const handleAddCol = () => {
      handleUpdateForm([
        ...compareAssets,
        {
          ...defaultItem,
          shipType: assetLevelThreeId,
          key: randomId(),
        },
      ]);
    };
    const handleSubCol = (index: number) => {
      if (formType === "edit" && index === 0) {
        message.warning("Không thể xoá TSSS gốc khi đang chỉnh sửa");
        return;
      }
      if (compareAssets.length !== 1) {
        const newCompareAsset = [...compareAssets];
        newCompareAsset.splice(index, 1);
        handleUpdateForm(newCompareAsset);
        setIsMfgInVietnam((prev) => {
          if (!prev || prev?.length < 1) return [];
          const tmp = [...prev];
          tmp.splice(index, 1);
          return [...tmp];
        });
      }
    };
    const handleCoppyCol = (index: number) => {
      const newCompareAssets = [...compareAssets];
      const copyCompareAssets = { ...newCompareAssets[index] };

      // delete copyCompareAssets.assetId
      copyCompareAssets.assetId = null;
      copyCompareAssets.assetCode = null;
      copyCompareAssets.key = randomId();
      copyCompareAssets.storedTypeId = copyCompareAssets.storedTypeId || 2;

      newCompareAssets.splice(index === 0 ? 1 : index, 0, copyCompareAssets);

      // Cập nhật dữ liệu cho quận/huyện và xã/phường của cột mới
      setDistrictOptions((prev: OptionType[][]) => {
        const newDistrictOptions = prev[index];
        return [...prev, newDistrictOptions];
      });
      setWardOptions((prev: OptionType[][]) => {
        const newWardOptions = prev[index];
        return [...prev, newWardOptions];
      });
      setIsMfgInVietnam((prev) => {
        if (!prev || prev?.length < 1) return [];
        const tmp = [...prev];
        tmp.splice(index, 0, tmp[index]);
        return [...tmp];
      });

      handleUpdateForm(newCompareAssets);
    };

    const handleChangeDataField = async (
      index: number,
      dataIndex: string,
      value: any,
      label?: string
    ) => {
      const newData = [...compareAssets];
      if (dataIndex === "addressProvince") {
        newData[index] = {
          ...compareAssets[index],
          [dataIndex]: value as string,
          addressDistrict: null,
          addressProvinceName: label,
          addressWard: null,
          addressStreet: "",
        };
        const response = await addressApi.getDistricts({
          code: value as string,
        });
        const newItemOptions = await response?.data?.map(
          (ele: DistrictType) => {
            return {
              label: ele.fullName,
              value: ele.code,
            };
          }
        );
        handleReplaceDistrictOptions(index, newItemOptions);
      } else if (dataIndex === "addressDistrict") {
        newData[index] = {
          ...compareAssets[index],
          [dataIndex]: value as string,
          addressDistrictName: label,
          addressWard: null,
          addressStreet: "",
        };
        const response = await addressApi.getWards({ code: value as string });
        const newItemOptions = await response?.data?.map((ele: WardType) => {
          return {
            label: ele.fullName,
            value: ele.code,
          };
        });
        handleReplaceWardOptions(index, newItemOptions);
      } else if (dataIndex === "addressWard") {
        newData[index] = {
          ...compareAssets[index],
          [dataIndex]: value as string,
          addressWardName: label,
          addressStreet: "",
        };
      } else if (dataIndex === "assetImage") {
        if (setListImage && listImage) {
          if (value?.length === 0) {
            setListImage([]);
            return;
          }
          const newImage: UploadProps[] = [{ index: index, image: value }];
          const combinedImages = [...listImage, ...newImage];

          const uniqueIndexes: Record<string, boolean> = {};

          const deduplicatedImages = combinedImages.reduce((acc: any, item) => {
            const index = item.index;
            if (!uniqueIndexes[index]) {
              uniqueIndexes[index] = true;
              acc.push(item);
            } else {
              const existingIndex = acc.findIndex(
                (existingItem: any) => existingItem.index === index
              );
              if (existingIndex !== -1) {
                acc[existingIndex] = item;
              }
            }
            return acc;
          }, []);

          setListImage(deduplicatedImages);
        }
      } else if (
        dataIndex === "transactionPrice" ||
        dataIndex === "estimatedRate"
      ) {
        // Công thức tính ước tính PTĐb -> tạo mới TSSS
        const transactionPrice =
          dataIndex === "transactionPrice"
            ? value
            : Number(newData[index]?.transactionPrice);
        const estimatedRate =
          dataIndex === "estimatedRate"
            ? value
            : Number(newData[index]?.estimatedRate);
        const estimatePrice = transactionPrice * (estimatedRate / 100);

        newData[index] = {
          ...compareAssets[index],
          [dataIndex]: value,
          estimatePrice: estimatePrice,
        };
      } else if (dataIndex === "countryMfgId") {
        newData[index] = {
          ...compareAssets[index],
          [dataIndex]: value,
          manufacturingLocation: "",
          manufacturingLocationName: "",
        };
      } else {
        newData[index] = {
          ...compareAssets[index],
          [dataIndex]: value,
        };
      }

      handleUpdateForm(newData);
    };

    const renderField = (key: string) => {
      let name = "";
      let lable: any = "";
      let typeFiled = INPUT;
      let order = 1;
      let onChange: any = () => {};
      let options: Array<{ label: string; value: string | number }> | null =
        null;
      let optionsDynamic: Array<OptionType[]> | null = null;
      let errorsNotify: any = formControl.errors?.compareAssets;
      let touchedNotify: any = formControl.touched?.compareAssets;
      let disable = isView;
      let disableDynamic: Array<boolean> | null = null;

      switch (key) {
        case "dataSourceId": {
          name = "Thông tin tham chiếu";
          typeFiled = SELECT;
          options = dataSourceOptions;
          lable = renderRequired("Nguồn dữ liệu");
          order = 2;
          onChange = handleChangeDataField;
          break;
        }
        case "infoSourceId": {
          name = "Thông tin tham chiếu";
          typeFiled = SELECT;
          options = infoSourceOptions;
          lable = renderRequired("Nguồn thông tin");
          order = 3;
          onChange = handleChangeDataField;
          break;
        }
        case "contact": {
          name = "Thông tin tham chiếu";
          lable = renderRequired("Người liên hệ - SĐT");
          order = 4;
          onChange = handleChangeDataField;
          break;
        }
        case "transactionStatus": {
          name = "Thông tin tham chiếu";
          lable = renderRequired("Tình trạng giao dịch");
          order = 5;
          onChange = handleChangeDataField;
          break;
        }
        case "transactionTime": {
          name = "Thông tin tham chiếu";
          lable = renderRequired("Thời điểm");
          typeFiled = DAY_PICKER;
          order = 6;
          onChange = handleChangeDataField;
          break;
        }

        // Địa chỉ
        case "addressProvince": {
          name = "Địa chỉ";
          lable = renderRequired("Tỉnh/TP");
          order = 7;
          onChange = handleChangeDataField;
          typeFiled = SELECT;
          options = provinceOptions;
          optionsDynamic = null;
          break;
        }
        case "addressDistrict": {
          name = "Địa chỉ";
          lable = "Quận/Huyện/TP/Thị xã";
          lable = renderRequired("Quận/Huyện/TP/Thị xã");
          optionsDynamic = districtOptions;
          order = 8;
          typeFiled = SELECT;
          options = null;
          onChange = handleChangeDataField;
          break;
        }
        case "addressWard": {
          name = "Địa chỉ";
          lable = renderRequired("Xã/Phường/Thị trấn");
          optionsDynamic = wardOptions;
          options = null;
          typeFiled = SELECT;
          order = 9;
          onChange = handleChangeDataField;
          break;
        }
        case "addressDetail": {
          name = "Địa chỉ";
          lable = renderRequired("Mô tả chi tiết");
          order = 11;
          onChange = handleChangeDataField;
          break;
        }

        // Chi tiết

        case "assetImage": {
          name = "Chi tiết";
          lable = "Hình ảnh";
          typeFiled = IMAGE;
          order = 16;
          onChange = handleChangeDataField;
          break;
        }
        case "shipType": {
          name = "Chi tiết";
          lable = renderRequired("Phân loại tài sản");
          options =
            dataAssetLevelThrees?.data?.map((item: AssetLevelThreeType) => {
              return {
                label: item.assetLevelThreeName,
                value: item.assetLevelThreeId,
              };
            }) || [];
          typeFiled = SELECT;
          order = 16.2;
          disable = true;
          // onChange = handleChangeDataField;
          break;
        }
        case "name": {
          name = "Chi tiết";
          lable = renderRequired("Tên phương tiện");
          typeFiled = INPUT;
          order = 16.4;
          onChange = handleChangeDataField;
          break;
        }
        case "registerNumber": {
          name = "Chi tiết";
          lable = "Số đăng ký";
          typeFiled = INPUT;
          order = 16.5;
          onChange = handleChangeDataField;
          break;
        }
        case "model": {
          name = "Chi tiết";
          lable = "Số loại/Model";
          typeFiled = INPUT;
          order = 17;
          onChange = handleChangeDataField;
          break;
        }
        case "imoNumber": {
          name = "Chi tiết";
          lable = "Số nhận dạng tàu/Số IMO";
          typeFiled = INPUT;
          order = 17.5;
          onChange = handleChangeDataField;
          break;
        }
        case "brand": {
          name = "Chi tiết";
          lable = "Nhãn hiệu";
          options = waterVehicleBrandOptions;
          typeFiled = SELECT;
          order = 18;
          onChange = handleChangeDataField;
          break;
        }
        case "yearMfg": {
          name = "Chi tiết";
          lable = "Năm sản xuất";
          typeFiled = INPUT_NUMBER_ONLY;
          order = 18.2;
          onChange = handleChangeDataField;
          break;
        }
        case "yearReconstructed": {
          name = "Chi tiết";
          lable = "Năm hoán cải";
          typeFiled = INPUT_NUMBER_ONLY;
          order = 18.6;
          onChange = handleChangeDataField;
          break;
        }
        case "countryMfgId": {
          name = "Chi tiết";
          lable = "Nước sản xuất";
          typeFiled = SELECT;
          options =
            manufactoringCountries?.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            }) || [];
          order = 19;
          onChange = (index: number, dataIndex: string, value: any) => {
            handleChangeDataField(index, dataIndex, value);
            setIsMfgInVietnam((prev) => {
              if (!prev) return prev;
              const newPurposeConsolidation = [...prev];
              newPurposeConsolidation[index] = value !== VIETNAM_ID;
              return newPurposeConsolidation;
            });
          };
          break;
        }
        case "manufacturingLocation": {
          name = "Chi tiết";
          lable = "Nơi đóng tàu";
          typeFiled = SELECT;
          options = provinceOptions;
          order = 19.5;
          disableDynamic = isMfgInVietnam;
          onChange = handleChangeDataField;
          break;
        }
        case "noteLegalSBA": {
          name = "Chi tiết";
          lable = renderRequired("Pháp lý");
          typeFiled = INPUT;
          order = 19.6;
          onChange = handleChangeDataField;
          break;
        }
        case "shipbuildingBrand": {
          name = "Chi tiết";
          lable = "Hãng đóng tàu";
          typeFiled = INPUT;
          order = 20;
          onChange = handleChangeDataField;
          break;
        }
        case "registerCountry": {
          name = "Chi tiết";
          lable = "Quốc gia đăng ký";
          typeFiled = SELECT;
          options =
            manufactoringCountries?.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            }) || [];
          order = 20.5;
          onChange = handleChangeDataField;
          break;
        }
        case "shipUtilities": {
          name = "Chi tiết";
          lable = "Công năng sử dụng";
          typeFiled = INPUT;
          order = 21;
          onChange = handleChangeDataField;
          break;
        }
        case "personCarry": {
          name = "Chi tiết";
          lable = "Số người được phép chở";
          typeFiled = INPUT;
          order = 21.5;
          onChange = handleChangeDataField;
          break;
        }
        case "designLength": {
          name = "Chi tiết";
          lable = "Chiều dài thiết kế (m)";
          typeFiled = INPUT_NUMBER;
          order = 21.6;
          onChange = handleChangeDataField;
          break;
        }
        case "designWidth": {
          name = "Chi tiết";
          lable = "Chiều rộng thiết kế (m)";
          typeFiled = INPUT_NUMBER;
          order = 21.7;
          onChange = handleChangeDataField;
          break;
        }
        case "maxLength": {
          name = "Chi tiết";
          lable = "Chiều dài lớn nhất (m)";
          typeFiled = INPUT_NUMBER;
          order = 22;
          onChange = handleChangeDataField;
          break;
        }
        case "boardHeight": {
          name = "Chi tiết";
          lable = "Chiều cao mạn (m)";
          typeFiled = INPUT_NUMBER;
          order = 22.3;
          onChange = handleChangeDataField;
          break;
        }
        case "sink": {
          name = "Chi tiết";
          lable = "Chiều chìm (m)";
          typeFiled = INPUT_NUMBER;
          order = 22.5;
          onChange = handleChangeDataField;
          break;
        }
        case "freeBoard": {
          name = "Chi tiết";
          lable = "Mạn khô (m)";
          typeFiled = INPUT_NUMBER;
          order = 22.6;
          onChange = handleChangeDataField;
          break;
        }
        case "machineNum": {
          name = "Chi tiết";
          lable = "Số lượng máy chính";
          typeFiled = INPUT_NUMBER;
          order = 22.8;
          onChange = handleChangeDataField;
          break;
        }
        case "machinePower": {
          name = "Chi tiết";
          lable = "Công suất máy chính (kW)";
          typeFiled = INPUT_NUMBER;
          order = 23;
          onChange = handleChangeDataField;
          break;
        }
        case "deadWeight": {
          name = "Chi tiết";
          lable = "Trọng tải toàn phần (MT)";
          typeFiled = INPUT_NUMBER;
          order = 23.5;
          onChange = handleChangeDataField;
          break;
        }
        case "grossTonnage": {
          name = "Chi tiết";
          lable = "Tổng dung tích (GT)";
          typeFiled = INPUT_NUMBER;
          order = 23.8;
          onChange = handleChangeDataField;
          break;
        }
        case "useTonnage": {
          name = "Chi tiết";
          lable = "Dung tích thực dụng (NT)";
          typeFiled = INPUT_NUMBER;
          order = 24;
          onChange = handleChangeDataField;
          break;
        }
        case "speed": {
          name = "Chi tiết";
          lable = "Tốc độ tàu (HL)";
          typeFiled = INPUT_NUMBER;
          order = 25;
          onChange = handleChangeDataField;
          break;
        }
        case "additionalContent": {
          name = "Chi tiết";
          lable = "Nội dung khác";
          typeFiled = INPUT;
          order = 26;
          onChange = handleChangeDataField;
          break;
        }
        case "currentUseSituation": {
          name = "Chi tiết";
          lable = "Hiện trạng sử dụng";
          typeFiled = INPUT;
          order = 27;
          onChange = handleChangeDataField;
          break;
        }
        case "numberOfDaysUsed": {
          name = "Chi tiết";
          lable = "Số thời gian đã qua sử dụng (ngày)";
          typeFiled = INPUT_NUMBER;
          order = 28;
          onChange = handleChangeDataField;
          break;
        }
        case "remainQuality": {
          name = "Chi tiết";
          lable = "Chất lượng còn lại (%)";
          typeFiled = PERCENT;
          order = 29;
          onChange = handleChangeDataField;
          break;
        }
        case "transactionPrice": {
          name = "Chi tiết";
          lable = renderRequired("Giá giao dịch/rao bán (đồng)");
          typeFiled = INPUT_NUMBER;
          order = 30;
          onChange = handleChangeDataField;
          break;
        }
        case "estimatedRate": {
          name = "Chi tiết";
          lable = renderRequired("Tỷ lệ ước tính (%)");
          typeFiled = PERCENT;
          order = 31;
          onChange = handleChangeDataField;
          break;
        }
        case "estimatePrice": {
          name = "Chi tiết";
          lable = renderRequired("Giá ước tính (đồng)");
          typeFiled = INPUT_NUMBER;
          order = 32;
          disable = true;
          break;
        }
      }

      return {
        name,
        lable,
        typeFiled,
        order,
        key,
        onChange,
        options,
        optionsDynamic,
        touchedNotify,
        disableDynamic,
        errorsNotify,
        listImage,
        disable,
        setListImage,
      };
    };

    const handleConvertData = (
      data: Array<ComparedAssetWaterVehicleType>
    ): any[] => {
      if (!data) return [];
      let datasource = [];

      const dataConverted = transformRowSchemaToColumnSchema(data);

      for (const key in dataConverted) {
        const renderName_label = renderField(key);

        const value = dataConverted[key];

        if (key === "transactionTime") {
          for (let i = 0; i < value.length; i++)
            value[i] = value[i]
              ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
              : "";
        }

        if (key === "registerCountry") {
          for (let i = 0; i < value.length; i++) value[i] = parseInt(value[i]);
        }

        if (!renderName_label.name) continue;

        const obj = {
          key: key,
          name: renderName_label.name,
          lable: renderName_label.lable,
          typeFiled: renderName_label.typeFiled,
          order: renderName_label.order,
          onChange: renderName_label.onChange,
          options: renderName_label.options,
          optionsDynamic: renderName_label.optionsDynamic,
          errorsNotify: renderName_label.errorsNotify,
          touchedNotify: renderName_label.touchedNotify,
          listImage: renderName_label.listImage,
          disable: renderName_label.disable,
          disableDynamic: renderName_label.disableDynamic,
          setListImage: setListImage,
          ...value,
        };

        datasource.push(obj);
      }
      return datasource.sort((a, b) => a.order - b.order);
    };

    const handleGetDistrictAndWard = async (
      asset: ComparedAssetWaterVehicleType,
      index: number
    ) => {
      // get district and ward base on provinceCode
      const provinceCode = asset.addressProvince;
      const districtCode = asset.addressDistrict;
      if (!provinceCode || !districtCode) return;

      const responseDistricts = await addressApi.getDistricts({
        code: provinceCode as string,
      });
      const newItemDistrictOptions = await responseDistricts?.data?.map(
        (ele: DistrictType) => {
          return {
            label: ele.fullName,
            value: ele.code,
          };
        }
      );
      handleReplaceDistrictOptions(index, newItemDistrictOptions);

      const responseWards = await addressApi.getWards({
        code: districtCode as string,
      });
      const newItemWardOptions = await responseWards?.data?.map(
        (ele: WardType) => {
          return {
            label: ele.fullName,
            value: ele.code,
          };
        }
      );
      handleReplaceWardOptions(index, newItemWardOptions);
    };
    const handleLoadEditData = async () => {
      let imageItems: UploadProps[] = [];
      for (let index = 0; index < compareAssets.length; index++) {
        const item = compareAssets[index];
        handleGetDistrictAndWard(item, index);

        let loadedImages: any[] = [];
        const ecmIds = item.assetImage?.split(";") || [];
        for (let j = 0; j < ecmIds?.length; j++) {
          const ecmId = ecmIds[j];
          if (!ecmId) continue;
          const loadedImage = await loadSingleImage(ecmId);
          loadedImages.push({
            ecmId: ecmId,
            name: ecmId,
            status: "done",
            url: loadedImage,
          });
        }

        imageItems.push({
          index,
          image: loadedImages,
        });
        setIsMfgInVietnam([item.countryMfgId !== VIETNAM_ID]);
      }
      setListImage && setListImage(imageItems);
    };
    useImperativeHandle(ref, () => ({
      onSubmit: formControl.submitForm,
      setValues: handleUpdateForm,
      values: formControl.values.compareAssets,
    }));

    useEffect(() => {
      const columnsTb: ColumnsEdit = [
        {
          title: "Nội dung",
          dataIndex: "name",
          key: "name",
          colSpan: 2,
        },
        {
          title: "lable",
          dataIndex: "lable",
          key: "lable",
          colSpan: 0,
        },
        ...compareAssets.map((_, index) => ({
          title: `TS ${index + 1}`,
          dataIndex: `ts${index + 1}`,
          key: `ts${index + 1}`,
        })),
        {
          title: "",
          dataIndex: "action",
          key: "action",
        },
      ];
      setColTable(columnsTb);
    }, [compareAssets]);

    //Set Type = assetLevelThreeId
    useEffect(() => {
      if (!compareAssets || !assetLevelThreeId) return;
      const newCompareAssets = [...compareAssets];
      handleUpdateForm(
        newCompareAssets.map((item: any, index: number) => {
          item.assetLevelThreeId = assetLevelThreeId;
          item.shipType = assetLevelThreeId;
          return item;
        })
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetLevelThreeId, JSON.stringify(compareAssets)]);

    useEffect(() => {
      if (formType === "edit" || formType === "view") {
        handleLoadEditData();
      }
    }, [
      formType,
      JSON.stringify(
        compareAssets
          ?.filter((item) => item.assetId)
          ?.map((item) => item.assetId)
      ),
    ]);

    useEffect(() => {
      if (formType === "add") {
        handleLoadEditData();
      }
    }, [
      formType,
      JSON.stringify(compareAssets?.map((item) => item.assetId || null)),
    ]);

    return (
      <Card size="small">
        <TableAddColEdit
          columns={colTable}
          imageList={listImage}
          dataSource={handleConvertData(compareAssets)}
          handleAddCol={handleAddCol}
          handleCoppyCol={handleCoppyCol}
          handleSubCol={handleSubCol}
        />
      </Card>
    );
  }
);

export default memo(StoredAssetWaterVehicleForm, (prevProps, nextProps) => {
  return isDeepEqual(prevProps, nextProps);
});
