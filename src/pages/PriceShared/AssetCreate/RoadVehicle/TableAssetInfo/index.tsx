/* eslint-disable react-hooks/exhaustive-deps */
import { Card, message } from "antd";
import { compareAssetsAPI } from "apis/compareAssets";
import renderRequired from "components/RenderRequire";
import TableAddColEdit from "components/TableAddColEdit";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import {
  ASSET_LV2,
  ASSET_LV3,
  DATE_TIME_FORMAT,
  TYPE_FIELD,
} from "constant/enums";
import {
  AssetLevelThreeType,
  ComparedAssetRoadVehicleCreateType,
  DistrictType,
  WardType,
} from "constant/types";
import dayjs from "dayjs";
import { useFormik } from "formik";
import "pages/PriceShared/AssetCreate/RoadVehicle/style.scss";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { isDeepEqual, transformRowSchemaToColumnSchema } from "utils/validate";
import {
  defaultItem,
  initialValue,
  roadVehicleCompareAssetFormSchema,
} from "./config";

import { addressApi } from "apis/adress";
import { RootState } from "configs/configureStore";
import { OptionType, UploadProps } from "constant/types/common";
import { useSelector } from "react-redux";
import { randomId } from "utils";
import { loadSingleImage } from "utils/loadImage";
import {
  useAssetLevelThree,
  useFuels,
  useGearBox,
  useManufactoringCountry,
  useWheelFormulas,
} from "utils/request";
import { handleUploadImages } from "utils/storedAsset";

type FormDataType = {
  compareAssets: ComparedAssetRoadVehicleCreateType[];
};

type Props = {
  formType?: "add" | "edit" | "view";
  assetLevelThreeId: number;
};
type RefProps = {
  onSubmit: () => void;
  setValues: (data: ComparedAssetRoadVehicleCreateType[]) => void;
  values: ComparedAssetRoadVehicleCreateType[];
};

const {
  INPUT,
  SELECT,
  IMAGE,
  DAY_PICKER,
  INPUT_NUMBER,
  PERCENT,
  INPUT_NUMBER_ONLY,
  CALCULATE_INPUT,
} = TYPE_FIELD;
const StoredAssetRoadVehicleForm = forwardRef<RefProps, Props>((props, ref) => {
  const { formType = "add", assetLevelThreeId } = props;
  const isView = formType === "view";
  const {
    provinceOptions,
    dataSourceOptions,
    infoSourceOptions,
    roadVehicleBrandOptions,
  } = useSelector((state: RootState) => state.globalSlice);
  const [districtOptions, setDistrictOptions] = useState<Array<OptionType[]>>(
    initialValue.map(() => [])
  );
  const [wardOptions, setWardOptions] = useState<Array<OptionType[]>>(
    initialValue.map(() => [])
  );
  const { data: manufactoringCountries } = useManufactoringCountry();
  const { data: wheelFormulas } = useWheelFormulas();
  const { data: gearBoxs } = useGearBox();
  const { data: fuels } = useFuels();
  const dataAssetLevelThrees = useAssetLevelThree(ASSET_LV2.VEHICLE);

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

  // check based on assetLevelThreeId
  const isCarVehicle =
    assetLevelThreeId === ASSET_LV3.CAR || assetLevelThreeId === ASSET_LV3.BUS;
  const isTruckRermocVehicle =
    assetLevelThreeId === ASSET_LV3.TRUCK ||
    assetLevelThreeId === ASSET_LV3.SPECIALIZED ||
    assetLevelThreeId === ASSET_LV3.TRACTORTRUCK ||
    assetLevelThreeId === ASSET_LV3.RERMOCTRUCK;

  const [colTable, setColTable] = useState<ColumnsEdit>([]);
  const [listImage, setListImage] = useState<UploadProps[]>([]);

  const formControl = useFormik({
    initialValues: { compareAssets: initialValue } as FormDataType,
    validationSchema: roadVehicleCompareAssetFormSchema,
    validateOnChange: true,
    onSubmit: async (data: FormDataType) => {
      try {
        // upload images
        const { newImagesInfor, isError } = await handleUploadImages(listImage);
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
        }

        if (formType === "edit" || formType === "view") {
          const response = await compareAssetsAPI.updateStoredAssets(
            cloneCompareAssets,
            ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE
          );
          if (response.data.code === 200) {
            message.success(`Cập nhật ${response.data.message}`);
            formControl.resetForm();
            setListImage([]);
            return response.data.data;
          } else {
            message.error(`Cập nhật ${response.data.message}`);
            throw new Error(`Cập nhật ${response.data.message}`);
          }
        } else {
          const response =
            await compareAssetsAPI.createRoadVehicleEstateStoredAsset(
              cloneCompareAssets,
              ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE
            );
          if (response.data.code === 200) {
            message.success(`Tạo mới ${response.data.message}`);
            formControl.resetForm();
            setListImage([]);
            return response.data.data;
          } else {
            message.error(`Tạo mới ${response.data.message}`);
            throw new Error(`Tạo mới ${response.data.message}`);
          }
        }
      } catch {
        message.error("Lỗi thêm mới tài sản so sánh");
      }
    },
  });
  const compareAssets = formControl.values.compareAssets;

  const handleUpdateForm = useCallback(
    (data: Array<ComparedAssetRoadVehicleCreateType>) => {
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
        type: assetLevelThreeId,
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
    }
  };
  const handleCopyCol = (index: number) => {
    const newCompareAssets = [...compareAssets];
    const copyCompareAssets = { ...newCompareAssets[index] };

    // delete copyCompareAssets.assetId
    copyCompareAssets.assetId = null;
    copyCompareAssets.assetCode = null;
    copyCompareAssets.key = randomId();
    copyCompareAssets.storedTypeId = copyCompareAssets.storedTypeId || 2;

    // Cập nhật dữ liệu cho quận/huyện và xã/phường của cột mới
    setDistrictOptions((prev: OptionType[][]) => {
      const newDistrictOptions = prev[index];
      return [...prev, newDistrictOptions];
    });
    setWardOptions((prev: OptionType[][]) => {
      const newWardOptions = prev[index];
      return [...prev, newWardOptions];
    });

    newCompareAssets.splice(index === 0 ? 1 : index, 0, copyCompareAssets);
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
      const response = await addressApi.getDistricts({ code: value as string });
      const newItemOptions = await response?.data?.map((ele: DistrictType) => {
        return {
          label: ele.fullName,
          value: ele.code,
        };
      });
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
      const estimatedPrice = transactionPrice * (estimatedRate / 100);

      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value,
        estimatedPrice: estimatedPrice,
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
    let options: Array<{ label: string; value: string | number }> | null = null;
    let optionsDynamic: Array<OptionType[]> | null = null;
    let errorsNotify: any = formControl.errors?.compareAssets;
    let touchedNotify: any = formControl.touched?.compareAssets;
    let disable = isView;

    switch (key) {
      //Thông tin tài sản
      // case "assetCode": {
      //   name = "Thông tin tài sản";
      //   lable = "Mã kho";
      //   order = 1;
      //   onChange = handleChangeDatasource;
      //   break;
      // }
      case "dataSourceId": {
        name = "Thông tin tài sản";
        typeFiled = SELECT;
        options = dataSourceOptions;
        lable = renderRequired("Nguồn dữ liệu");
        order = 2;
        onChange = handleChangeDataField;
        break;
      }
      case "infoSourceId": {
        name = "Thông tin tài sản";
        typeFiled = SELECT;
        options = infoSourceOptions;
        lable = renderRequired("Nguồn thông tin");
        order = 3;
        onChange = handleChangeDataField;
        break;
      }
      case "contact": {
        name = "Thông tin tài sản";
        lable = renderRequired("Người liên hệ - SĐT");
        order = 4;
        onChange = handleChangeDataField;
        break;
      }
      case "transactionStatus": {
        name = "Thông tin tài sản";
        lable = renderRequired("Tình trạng giao dịch");
        order = 5;
        onChange = handleChangeDataField;
        break;
      }
      case "transactionTime": {
        name = "Thông tin tài sản";
        lable = renderRequired("Thời điểm");
        typeFiled = DAY_PICKER;
        order = 6;
        onChange = handleChangeDataField;
        break;
      }

      //Địa chỉ
      case "addressProvince": {
        name = "Địa chỉ";
        lable = renderRequired("Tỉnh/TP");
        typeFiled = SELECT;
        options = provinceOptions;
        onChange = handleChangeDataField;
        order = 7;
        break;
      }
      case "addressDistrict": {
        name = "Địa chỉ";
        lable = renderRequired("Thành phố/Quận/Huyện/Thị xã");
        typeFiled = SELECT;
        optionsDynamic = districtOptions;
        options = null;
        order = 8;
        onChange = handleChangeDataField;
        break;
      }
      case "addressWard": {
        name = "Địa chỉ";
        lable = renderRequired("Xã/Phường/Thị trấn");
        optionsDynamic = wardOptions;
        typeFiled = SELECT;
        options = null;
        order = 9;
        onChange = handleChangeDataField;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        lable = renderRequired("Mô tả chỉ tiết địa chỉ");
        typeFiled = INPUT;
        order = 10;
        onChange = handleChangeDataField;
        break;
      }

      // Chi tiết
      case "assetImage": {
        name = "Chi tiết";
        lable = "Hình ảnh tài sản";
        typeFiled = IMAGE;
        order = 16;
        onChange = handleChangeDataField;
        break;
      }
      case "type": {
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
        order = 17;
        disable = true;
        // onChange = handleChangeDataField;
        break;
      }
      case "vehicleBrand": {
        name = "Chi tiết";
        lable = renderRequired("Nhãn hiệu");
        options = roadVehicleBrandOptions;
        typeFiled = SELECT;
        order = 18;
        onChange = handleChangeDataField;
        break;
      }
      case "vehicleModel": {
        name = "Chi tiết";
        lable = "Số loại/Model";
        typeFiled = INPUT;
        order = 19;
        onChange = handleChangeDataField;
        break;
      }
      case "vehicleColor": {
        name = "Chi tiết";
        lable = "Màu sơn";
        typeFiled = INPUT;
        order = 20;
        onChange = handleChangeDataField;
        break;
      }
      case "yearMfg": {
        name = "Chi tiết";
        lable = "Năm sản xuất";
        typeFiled = INPUT_NUMBER_ONLY;
        order = 21;
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
        order = 22;
        onChange = handleChangeDataField;
        break;
      }
      case "noteLegalSBA": {
        name = "Chi tiết";
        lable = renderRequired("Pháp lý");
        typeFiled = INPUT;
        order = 22.5;
        onChange = handleChangeDataField;
        break;
      }
      case "gearBoxId": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Hộp số";
          typeFiled = SELECT;
          options = gearBoxs?.map((item: any) => {
            return {
              label: item.gearBoxName,
              value: item.gearBoxId,
            };
          });
          order = 23;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "wheelFormulaId": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Công thức bánh xe";
          typeFiled = SELECT;
          options = wheelFormulas?.map((item: any) => {
            return {
              value: item.wheelFormulaId,
              label: item.wheelFormulaName,
            };
          });
          order = 24;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "fuelId": {
        name = "Chi tiết";
        lable = "Loại nhiên liệu";
        typeFiled = SELECT;
        options = fuels?.map((item: any) => {
          return {
            label: item.fuelName,
            value: item.fuelId,
          };
        });
        order = 25;
        onChange = handleChangeDataField;
        break;
      }
      case "vehicleIdNumber": {
        name = "Chi tiết";
        lable = "Số khung";
        typeFiled = INPUT;
        order = 26;
        onChange = handleChangeDataField;
        break;
      }
      case "engineNumber": {
        name = "Chi tiết";
        lable = "Số máy";
        typeFiled = INPUT;
        order = 27;
        onChange = handleChangeDataField;
        break;
      }
      case "plateNumber": {
        name = "Chi tiết";
        lable = "Biển kiểm soát";
        typeFiled = INPUT;
        order = 28;
        onChange = handleChangeDataField;
        break;
      }
      case "overallDims": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Kích thước bao (mm)";
          typeFiled = INPUT;
          order = 29;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "weightBase": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Khối lượng bản thân (kg)";
          typeFiled = INPUT_NUMBER;
          order = 30;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "weightAll": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Khối lượng toàn bộ theo TK /CP TGGT (kg)";
          typeFiled = INPUT;
          order = 31;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "wheelBase": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Chiều dài cơ sở (mm)";
          typeFiled = INPUT;
          order = 32;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "personCarry": {
        name = "Chi tiết";
        lable = "Số người cho phép chở";
        order = 33;
        typeFiled = INPUT;
        onChange = handleChangeDataField;
        break;
      }
      case "engineDisp": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Thể tích làm việc của động cơ (CC)";
          order = 34;
          typeFiled = INPUT_NUMBER;
          onChange = handleChangeDataField;
          break;
        } else {
          name = "Chi tiết";
          lable = "Dung tích (CC)";
          order = 35;
          typeFiled = INPUT_NUMBER;
          onChange = handleChangeDataField;
          break;
        }
      }
      case "maxOutputRpm": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Công suất lớn nhất /tốc độ quay (kW/vph)";
          typeFiled = INPUT;
          order = 35;
          onChange = handleChangeDataField;
          break;
        } else {
          name = "Chi tiết";
          lable = "Công suất (W)";
          typeFiled = INPUT;
          onChange = handleChangeDataField;
          order = 34;
          break;
        }
      }
      case "numberOfTires": {
        if (isCarVehicle || isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Số lượng lốp/cỡ lốp";
          typeFiled = INPUT;
          onChange = handleChangeDataField;
          order = 35.5;
          break;
        } else {
          return {};
        }
      }
      case "currentUseSituation": {
        name = "Chi tiết";
        lable = "Hiện trạng sử dụng";
        typeFiled = INPUT;
        onChange = handleChangeDataField;
        order = 40;
        break;
      }
      case "numberOfKilometersUsed": {
        name = "Chi tiết";
        lable = "Số km đã qua sử dụng";
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDataField;
        order = 41;
        break;
      }
      case "remainQuality": {
        name = "Chi tiết";
        lable = "CLCL (%)";
        typeFiled = PERCENT;
        onChange = handleChangeDataField;
        order = 42;
        break;
      }

      // ĐỐI VỚI  XE TẢI/ XE CHUYÊN DỤNG/ XE Ô TÔ ĐẦU KÉO/ RƠ - MOOC/ SƠ MI RƠ MOOC
      case "vehicleTrunkSize": {
        if (isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Kích thước lòng thùng xe (mm)";
          typeFiled = INPUT;
          order = 36;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "volumeOfGoodsTransported": {
        if (isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Khối lượng hàng chuyên chở theo TK/CP TGGT (kg)";
          order = 37;
          typeFiled = INPUT;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "volumeOfTowedGoods": {
        if (isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Khối lượng hàng chuyên kéo theo TK/CP TGGT (kg)";
          order = 38;
          typeFiled = INPUT;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "tankCapacity": {
        if (isTruckRermocVehicle) {
          name = "Chi tiết";
          lable = "Dung tích bồn (gallons/lit)";
          order = 39;
          typeFiled = INPUT;
          onChange = handleChangeDataField;
          break;
        } else {
          return {};
        }
      }
      case "transactionPrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá giao dịch/ rao bán (đồng)");
        order = 43;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDataField;
        break;
      }
      case "estimatedRate": {
        name = "Chi tiết";
        lable = renderRequired("Tỷ lệ ước tính (%)");
        order = 44;
        typeFiled = PERCENT;
        onChange = handleChangeDataField;
        break;
      }
      case "estimatedPrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá ước tính (đồng)");
        order = 45;
        typeFiled = CALCULATE_INPUT;
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
      errorsNotify,
      touchedNotify,
      listImage,
      setListImage,
      disable,
    };
  };
  const handleConvertData = (
    data: Array<ComparedAssetRoadVehicleCreateType>
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
        setListImage: setListImage,
        ...value,
      };

      datasource.push(obj);
    }
    return datasource.sort((a, b) => a.order - b.order);
  };
  const handleGetDistrictAndWard = async (
    asset: ComparedAssetRoadVehicleCreateType,
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
      ...compareAssets.map((_: any, index: number) => ({
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
        item.type = assetLevelThreeId;
        return item;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetLevelThreeId]);

  useEffect(() => {
    if (formType === "edit" || formType === "view") {
      handleLoadEditData();
    }
  }, [
    formType,
    JSON.stringify(
      compareAssets?.filter((item) => item.assetId)?.map((item) => item.assetId)
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
        imageList={listImage}
        columns={colTable}
        dataSource={handleConvertData(compareAssets)}
        handleAddCol={handleAddCol}
        handleCoppyCol={handleCopyCol}
        handleSubCol={handleSubCol}
      />
    </Card>
  );
});
export default memo(StoredAssetRoadVehicleForm, (prevProps, nextProps) => {
  return isDeepEqual(prevProps, nextProps);
});
