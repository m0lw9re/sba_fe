/* eslint-disable react-hooks/exhaustive-deps */
import { Card, message } from "antd";
import { addressApi } from "apis/adress";
import renderRequired from "components/RenderRequire";
import TableAddColEdit from "components/TableAddColEdit";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import {
  DATE_TIME_FORMAT,
  TYPE_FIELD,
  UTILITIES_APARTMENT,
} from "constant/enums";
import {
  ComparedAssetAppartmentCreateType,
  DistrictType,
  WardType,
} from "constant/types";
import { UploadProps } from "constant/types/common";
import dayjs from "dayjs";
import { CompareAssetImagesType } from "hooks/useStoredAssetFuction";
import {
  defaultItem,
  initialValue,
} from "pages/PriceShared/AssetCreate/Appartment/config";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { randomId } from "utils";
import { loadSingleImage } from "utils/loadImage";
import { isDeepEqual, transformRowSchemaToColumnSchema } from "utils/validate";
import { columnsTb } from "./config";

type Props = {
  compareAssets: Array<ComparedAssetAppartmentCreateType>;
  onChangeCompareAssets: (
    data: Array<ComparedAssetAppartmentCreateType>
  ) => void;
  errors: any;
  touched: any;
  listImage?: UploadProps[];
  setListImage?: (file: any) => void;
  formType?: "add" | "edit";
};

const {
  INPUT,
  SELECT,
  IMAGE,
  INPUT_NUMBER,
  DAY_PICKER,
  LOCAL_COORDINATE,
  CALCULATE_INPUT,
  CHECKBOX_GROUP,
} = TYPE_FIELD;

const TableAssetInfo: React.FC<Props> = ({
  compareAssets,
  onChangeCompareAssets,
  errors,
  touched,
  listImage,
  setListImage,
  formType = "add",
}) => {
  const {
    provinceOptions,
    dataSourceOptions,
    infoSourceOptions,
    businessAdvantageOptions,
    listPositionOptions,
  } = useSelector((state: RootState) => state.globalSlice);

  const [districtOptions, setDistrictOptions] = useState<
    Array<Array<{ label: string; value: string }>>
  >(initialValue.map(() => []));
  const [wardOptions, setWardOptions] = useState<
    Array<Array<{ label: string; value: string }>>
  >(initialValue.map(() => []));
  const [colTable, setColTable] = useState<ColumnsEdit>([]);

  const handleAddCol = () => {
    onChangeCompareAssets([
      ...compareAssets,
      {
        ...defaultItem,
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
      onChangeCompareAssets(newCompareAsset);

      // Xóa image ở index
      if (listImage && setListImage) {
        const foundIndex = listImage.findIndex((item) => item.index === index);
        if (foundIndex !== -1) {
          // Check xem đây có phải vị trí cuối cùng
          if (foundIndex === listImage.length - 1) {
            const newListImage = [...listImage];
            newListImage.splice(foundIndex, 1);
            setListImage(newListImage.sort((a, b) => a.index - b.index));
          }
          // Nếu không phải vị trí cuối thì index các phần tử bên phải trừ 1
          else {
            const newListImage = listImage.map((item) => {
              if (item.index > foundIndex) {
                return {
                  ...item,
                  index: item.index - 1,
                };
              } else return item;
            });
            newListImage.splice(foundIndex, 1);
            setListImage(newListImage.sort((a, b) => a.index - b.index));
          }
        }
        // Trường hợp không tìm thấy phần tử,
        // nhưng xóa cột ở giữa nên index các item bên phải trừ 1
        else {
          const newListImage = listImage.map((item) => {
            if (item.index > index) {
              return {
                ...item,
                index: item.index - 1,
              };
            } else return item;
          });
          setListImage(newListImage.sort((a, b) => a.index - b.index));
        }
      }
    }
  };

  const handleCopyCol = (index: number) => {
    const newCompareAssets = [...compareAssets];
    const copyCompareAsset: ComparedAssetAppartmentCreateType = {
      ...newCompareAssets[index],
    };

    delete (copyCompareAsset as any)?.assetId;

    copyCompareAsset.assetCode = null;
    copyCompareAsset.storedTypeId = copyCompareAsset.storedTypeId || 2;
    copyCompareAsset.key = randomId();
    newCompareAssets.splice(index === 0 ? 1 : index, 0, copyCompareAsset);

    // Cập nhật dữ liệu cho quận/huyện và xã/phường của cột mới
    const newItemOptionsDistrict = districtOptions[index] || [];
    const newItemOptionsWard = wardOptions[index] || [];

    setDistrictOptions((prev: any) => [...prev, newItemOptionsDistrict]);
    setWardOptions((prev: any) => [...prev, newItemOptionsWard]);

    onChangeCompareAssets(newCompareAssets);
  };

  const handleReplaceDistrictOptions = (
    index: number,
    newItemOptions: Array<{ label: string; value: string }>
  ) => {
    const newOptions = [...districtOptions];
    newOptions.splice(index, 1, newItemOptions);
    setDistrictOptions(newOptions);
  };

  const handleReplaceWardOptions = (
    index: number,
    newItemOptions: Array<{ label: string; value: string }>
  ) => {
    const newOptions = [...wardOptions];
    newOptions.splice(index, 1, newItemOptions);
    setWardOptions(newOptions);
  };

  const handleChangeDatasource = async (
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
    } else if (dataIndex === "coordinate") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as any,
        latitude: value?.latitude,
        longitude: value?.longitude,
      };
    } else if (dataIndex === "assetImage") {
      if (setListImage && listImage) {
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

        setListImage(
          deduplicatedImages.sort((a: any, b: any) => a.index - b.index)
        );
      }
    } else if (dataIndex === "utilities") {
      // Sắp xếp các dịch vụ theo thứ tự từ a => z
      const sortedValue = [...value].sort();
      const utilitiesString = sortedValue.join(",").toString();
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: utilitiesString as string,
      };
    } else {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value,
      };
    }
    if (dataIndex === "transactionPrice" || dataIndex === "privateUseArea") {
      // Giá trị CTXD constructionPrice
      const unitPriceValue =
        Number(newData[index]?.transactionPrice) /
        Number(newData[index]?.privateUseArea);

      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value,
        unitPrice: Math.round(unitPriceValue) || 0,
      };
    }
    onChangeCompareAssets(newData);
  };

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
  }, [compareAssets, districtOptions, wardOptions]);

  const renderName_LabelForDataSource = (key: string) => {
    let name = "";
    let lable: any = "";
    let typeFiled = INPUT;
    let order = 1;
    let onChange: any = () => {};
    let options: Array<{ label: string; value: string | number }> | null = null;
    let optionsDynamic: Array<Array<{ label: string; value: string }>> | null =
      null;
    let errorsNotify: any = errors?.compareAssets;
    let touchedNotify: any = touched?.compareAssets;

    switch (key) {
      //Thông tin tài sản
      case "dataSourceId": {
        name = "Thông tin tham chiếu";
        typeFiled = SELECT;
        options = dataSourceOptions;
        lable = renderRequired("Nguồn dữ liệu");
        order = 2;
        onChange = handleChangeDatasource;
        break;
      }
      // case "appraisalUnit": {
      //   name = "Thông tin tham chiếu";
      //   typeFiled = SELECT;
      //   options = companyBranchsData || [];
      //   lable = renderRequired("Đơn vị định giá");
      //   order = 2;
      //   onChange = handleChangeDatasource;
      //   break;
      // }
      case "infoSourceId": {
        name = "Thông tin tham chiếu";
        typeFiled = SELECT;
        options = infoSourceOptions;
        lable = renderRequired("Nguồn thông tin");
        order = 3;
        onChange = handleChangeDatasource;
        break;
      }
      case "contact": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Người liên hệ - SĐT");
        order = 4;
        onChange = handleChangeDatasource;
        break;
      }
      case "transactionStatus": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Tình trạng giao dịch");
        order = 5;
        onChange = handleChangeDatasource;
        break;
      }
      case "transactionTime": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Thời điểm giao dịch");
        typeFiled = DAY_PICKER;
        order = 6;
        onChange = handleChangeDatasource;
        break;
      }

      //Địa chỉ
      case "addressProvince": {
        name = "Địa chỉ";
        lable = renderRequired("Tỉnh/TP");
        order = 7;
        onChange = handleChangeDatasource;
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
        onChange = handleChangeDatasource;
        break;
      }
      case "addressWard": {
        name = "Địa chỉ";
        lable = renderRequired("Xã/Phường/Thị trấn");
        optionsDynamic = wardOptions;
        options = null;
        typeFiled = SELECT;
        order = 9;
        onChange = handleChangeDatasource;
        break;
      }
      case "addressStreet": {
        name = "Địa chỉ";
        lable = renderRequired("Đường phố");
        order = 10;
        onChange = handleChangeDatasource;
        break;
      }
      case "positionId": {
        name = "Địa chỉ";
        lable = renderRequired("Vị trí");
        order = 11;
        onChange = handleChangeDatasource;
        optionsDynamic = null;
        options = listPositionOptions;
        typeFiled = SELECT;
        break;
      }
      case "mapSheetNumber": {
        name = "Địa chỉ";
        lable = "Số tờ";
        typeFiled = INPUT;
        order = 12;
        onChange = handleChangeDatasource;
        break;
      }
      case "landPlotNumber": {
        name = "Địa chỉ";
        lable = "Số thửa";
        typeFiled = INPUT;
        order = 13;
        onChange = handleChangeDatasource;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        lable = "Địa chỉ Chi tiết";
        order = 14;
        onChange = handleChangeDatasource;
        break;
      }
      case "legal": {
        name = "Địa chỉ";
        lable = renderRequired("Pháp lý");
        order = 14;
        onChange = handleChangeDatasource;
        break;
      }
      case "description": {
        name = "Địa chỉ";
        lable = "Mô tả chi tiết vị trí";
        order = 14.5;
        onChange = handleChangeDatasource;
        break;
      }
      case "distanceToAsset": {
        name = "Địa chỉ";
        lable = "Khoảng cách tới TSTĐ";
        order = 14.6;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        break;
      }
      case "coordinate": {
        name = "Địa chỉ";
        lable = "Định vị";
        typeFiled = LOCAL_COORDINATE;
        order = 15;
        onChange = handleChangeDatasource;
        break;
      }

      // Chi tiết
      case "assetImage": {
        name = "Chi tiết";
        lable = "Hình ảnh tài sản";
        typeFiled = IMAGE;
        order = 16;
        onChange = handleChangeDatasource;
        break;
      }
      case "projectName": {
        name = "Chi tiết";
        lable = "Tên chung cư/Dự án";
        typeFiled = INPUT;
        order = 16;
        onChange = handleChangeDatasource;
        break;
      }
      case "building": {
        name = "Chi tiết";
        lable = "Tòa nhà thực tế";
        typeFiled = INPUT;
        order = 17;
        onChange = handleChangeDatasource;
        break;
      }
      case "apartmentCode": {
        name = "Chi tiết";
        lable = "Mã căn hộ";
        typeFiled = INPUT;
        order = 18;
        onChange = handleChangeDatasource;
        break;
      }
      case "floorNo": {
        name = "Chi tiết";
        lable = "Tầng số";
        typeFiled = INPUT_NUMBER;
        order = 19;
        onChange = handleChangeDatasource;
        break;
      }
      case "surfaces": {
        name = "Chi tiết";
        lable = "Số mặt thoáng căn hộ";
        typeFiled = INPUT_NUMBER;
        order = 20;
        onChange = handleChangeDatasource;
        break;
      }
      case "furniture": {
        name = "Chi tiết";
        lable = "Nội thất";
        typeFiled = INPUT;
        order = 21;
        onChange = handleChangeDatasource;
        break;
      }
      case "utilities": {
        name = "Chi tiết";
        lable = "Tiện ích";
        typeFiled = CHECKBOX_GROUP;
        options = [
          { value: UTILITIES_APARTMENT.GARAGE, label: "Hầm để xe" },
          { value: UTILITIES_APARTMENT.POOL, label: "Hồ bơi" },
          { value: UTILITIES_APARTMENT.INNER_PARK, label: "Công viên nội khu" },
          {
            value: UTILITIES_APARTMENT.COMMERCIALSERVICEAREA,
            label: "Khu thương mại/Dịch vụ",
          },
          {
            value: UTILITIES_APARTMENT.ELEVATOR,
            label: "Thang máy",
          },
          {
            value: UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL,
            label: "Bệnh viện/Trường học/Trường mầm non",
          },
          { value: UTILITIES_APARTMENT.RECEPTIONHALL, label: "Sảnh lễ tân" },
        ];
        order = 21;
        onChange = handleChangeDatasource;
        break;
      }
      case "otherFactor": {
        name = "Chi tiết";
        lable = "Yếu tố khác";
        order = 24;
        onChange = handleChangeDatasource;
        break;
      }
      case "businessAdvantage": {
        name = "Chi tiết";
        lable = "Lợi thế kinh doanh";
        typeFiled = SELECT;
        options = businessAdvantageOptions;
        order = 25;
        onChange = handleChangeDatasource;
        break;
      }
      // case "totalFloorArea": {
      //   name = "Chi tiết";
      //   lable = "Diện tích theo hồ sơ pháp lý (m²)";
      //   order = 26;
      //   typeFiled = INPUT_NUMBER;
      //   onChange = handleChangeDatasource;
      //   break;
      // }
      case "privateUseArea": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích sử dụng riêng (m²)");
        order = 27;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        break;
      }
      case "clearanceArea": {
        name = "Chi tiết";
        lable = "Diện tích thông thủy (m²)";
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        order = 28;
        break;
      }
      case "buildupArea": {
        name = "Chi tiết";
        lable = "Diện tích tim tường (m²)";
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        order = 29;
        break;
      }
      case "extendArea": {
        name = "Chi tiết";
        lable = "Diện tích cơi nới (m²)";
        order = 30;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá rao bán (đồng)");
        typeFiled = INPUT_NUMBER;
        order = 31;
        onChange = handleChangeDatasource;
        break;
      }
      case "transactionPrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá thương lượng (đồng)");
        typeFiled = INPUT_NUMBER;
        order = 32;
        onChange = handleChangeDatasource;
        // typeFiled = "CURRENCY";
        break;
      }
      case "unitPrice": {
        name = "Chi tiết";
        lable = renderRequired("Đơn giá ước tính QSH căn hộ (đồng/m²)");
        typeFiled = CALCULATE_INPUT;
        order = 33;
        onChange = handleChangeDatasource;
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
    };
  };

  const handleConvertData = (
    data: Array<ComparedAssetAppartmentCreateType>
  ): any[] => {
    if (!data) return [];
    let datasource = [];

    const dataConverted = transformRowSchemaToColumnSchema(data);

    for (const key in dataConverted) {
      const renderName_label = renderName_LabelForDataSource(key);

      const value = dataConverted[key];

      if (key === "transactionTime") {
        for (let i = 0; i < value.length; i++)
          value[i] = value[i]
            ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
            : "";
      }

      if (key === "unitPrice") {
        value.disable = true;
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
        ...value,
      };

      datasource.push(obj);
    }
    return datasource.sort((a, b) => a.order - b.order);
  };
  const handleGetDistrictAndWard = async (
    asset: ComparedAssetAppartmentCreateType,
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
  const hanleLoadEditData = async () => {
    let imageItems: CompareAssetImagesType[] = [];
    for (let index = 0; index < compareAssets.length; index++) {
      const item = compareAssets[index];
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

      handleGetDistrictAndWard(item, index);
    }
    setListImage && setListImage(imageItems);
  };
  useEffect(() => {
    if (formType === "edit") {
      hanleLoadEditData();
    }
  }, [
    formType,
    JSON.stringify(
      compareAssets?.filter((item) => item.assetId)?.map((item) => item.assetId)
    ),
  ]);

  useEffect(() => {
    if (formType === "add") {
      hanleLoadEditData();
    }
  }, [
    formType,
    JSON.stringify(compareAssets?.map((item) => item.assetId || null)),
  ]);

  useEffect(() => {
    setColTable(columnsTb);
  }, [columnsTb]);

  return (
    <Card size="small">
      <TableAddColEdit
        imageList={listImage || []}
        columns={colTable}
        dataSource={handleConvertData(compareAssets)}
        handleAddCol={handleAddCol}
        handleCoppyCol={handleCopyCol}
        handleSubCol={handleSubCol}
      />
    </Card>
  );
};

export default memo(TableAssetInfo, (prevProps, nextProps) => {
  return isDeepEqual(prevProps, nextProps);
});
