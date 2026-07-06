import { memo, useEffect, useState } from "react";
import { columnsTb } from "./config";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import TableAddColEdit from "components/TableAddColEdit";
import { Card, UploadFile } from "antd";
import {
  ComparedAssetAppartmentCreateType,
  DistrictType,
  WardType,
} from "constant/types";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import dayjs from "dayjs";
import {
  DATE_TIME_FORMAT,
  TYPE_FIELD,
  UTILITIES_APARTMENT,
} from "constant/enums";
import {
  defaultItem,
  initialValue,
} from "pages/PriceShared/AssetCreate/Appartment/config";
import {
  useAddressProvince,
  useDataSource,
  useSourceInfor,
  usePositions,
  useCategoryPurpose,
  useBussinessAdvance,
} from "utils/request";
import { addressApi } from "apis/adress";
import { categoryApi } from "apis/category";
import { Suggestion, getGeocode, getLatLng } from "use-places-autocomplete";
import renderRequired from "components/RenderRequire";

interface LatLng {
  lat: number;
  lng: number;
}

type UploadProps = {
  image: UploadFile[];
  index: number;
};

type Props = {
  compareAssets: Array<ComparedAssetAppartmentCreateType>;
  onChangeCompareAssets: (
    data: Array<ComparedAssetAppartmentCreateType>
  ) => void;
  errors: any;
  touched: any;
  listImage?: UploadProps[];
  setListImage?: (file: any) => void;
};

const {
  INPUT,
  SELECT,
  LOCAL_COORDINATE,
  IMAGE,
  DAY_PICKER,
  INPUT_NUMBER,
  CHECKBOX_GROUP,
} = TYPE_FIELD;

const TableAssetInfo: React.FC<Props> = ({
  compareAssets,
  onChangeCompareAssets,
  errors,
  touched,
  listImage,
  setListImage,
}) => {
  const { data: provinces } = useAddressProvince();
  const { data: dataSources } = useDataSource();
  const { data: sourceInfors } = useSourceInfor();
  const { data: sourcePosition } = usePositions();
  const { data: bussinessAdvance } = useBussinessAdvance();
  const { data: sourceUsingPurposes } = useCategoryPurpose({
    limit: 100,
    page: 1,
    direction: 1,
  });

  const [categoryData, setCategoryData] = useState<{
    companyBranchs: Array<any>;
  }>({
    companyBranchs: [],
  });

  const [districtOptions, setDistrictOptions] = useState<
    Array<Array<{ label: string; value: string }>>
  >(initialValue.map(() => []));
  const [wardOptions, setWardOptions] = useState<
    Array<Array<{ label: string; value: string }>>
  >(initialValue.map(() => []));
  const [colTable, setColTable] = useState<ColumnsEdit>([]);
  const [searchAddress, setSearchAddress] = useState<string[]>([]);

  const getCordinateFromAddress = (
    { description }: Suggestion,
    autoFillAddress?: boolean
  ): Promise<LatLng> => {
    let latValue: number = 21.035856;
    let lngValue: number = 105.7757954545131241423424;

    return new Promise((resolve, reject) => {
      getGeocode({ address: description })
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          latValue = lat;
          lngValue = lng;
          resolve({ lat: latValue, lng: lngValue });
        })
        .catch((error) => {
          resolve({ lat: latValue, lng: lngValue });
          // reject(error);
        });
    });
  };

  const handleCoppyCol = async (index: number) => {
    const newCompareAsset = [...compareAssets];
    newCompareAsset.splice(index, 0, newCompareAsset[index]);
    onChangeCompareAssets(newCompareAsset);
    const newItemOptions = await requestDistrict(
      newCompareAsset[index].addressProvince?.split("-")[0] as string
    );
    handleReplaceDistrictOptions(index + 1, newItemOptions);
    const newItemOptionsWard = await requestWard(
      newCompareAsset[index].addressDistrict?.split("-")[0] as string
    );
    handleReplaceWardOptions(index + 1, newItemOptionsWard);
  };

  const handleAddCol = () => {
    onChangeCompareAssets([...compareAssets, defaultItem]);
  };

  const getCategoryData = async () => {
    try {
      const companyBranchRes = await categoryApi.getCompanyBranchs();
      const companyBranchs = companyBranchRes.data?.map((item: any) => ({
        value: item.companyBranchId,
        label: item.companyBranchName,
      }));

      setCategoryData({
        ...categoryData,
        companyBranchs,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubCol = (index: number) => {
    if (compareAssets.length !== 1) {
      const newCompareAsset = [...compareAssets];
      newCompareAsset.splice(index, 1);
      onChangeCompareAssets(newCompareAsset);
    }
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

  // request district when change province
  const requestDistrict = async (code: string) => {
    const response = await addressApi.getDistricts({ code: code });
    const newItemOptions = await response?.data?.map((ele: DistrictType) => {
      return {
        label: ele.fullName,
        value: ele.code + "-" + ele.fullName,
      };
    });
    return newItemOptions;
  };
  // request ward when change district
  const requestWard = async (code: string) => {
    const response = await addressApi.getWards({ code: code });
    const newItemOptions = await response?.data?.map((ele: WardType) => {
      return {
        label: ele.fullName,
        value: ele.code + "-" + ele.fullName,
      };
    });
    return newItemOptions;
  };

  const handleChangeDatasource = async (
    index: number,
    dataIndex: string,
    value: any,
    label?: string
  ) => {
    const newData = [...compareAssets];
    if (dataIndex === "addressProvince") {
      const coordinate = await getCordinateFromAddress(
        {
          description: value.split("-")[1],
        } as Suggestion,
        false
      );

      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        addressDistrict: null,
        addressProvinceName: label,
        addressWard: null,
        addressStreet: "",
        addressDetail: "",
        positionName: "",
        latitude: coordinate?.lat as number,
        longitude: coordinate?.lng as number,
      };
      setSearchAddress([
        coordinate?.lat.toString(),
        coordinate?.lng.toString(),
      ]);
      const newItemOptions = await requestDistrict(
        value.split("-")[0] as string
      );
      handleReplaceDistrictOptions(index, newItemOptions);
    } else if (dataIndex === "addressDistrict") {
      const coordinate = await getCordinateFromAddress(
        {
          description:
            value.split("-")[1] +
            ", " +
            newData[index].addressProvince?.split("-")[1],
        } as Suggestion,
        false
      );

      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        addressDistrictName: label,
        addressWard: null,
        addressStreet: "",
        addressDetail: "",
        positionName: "",
        latitude: coordinate.lat as number,
        longitude: coordinate.lng as number,
      };
      setSearchAddress([
        coordinate?.lat.toString(),
        coordinate?.lng.toString(),
      ]);
      const newItemOptions = await requestWard(value.split("-")[0] as string);
      handleReplaceWardOptions(index, newItemOptions);
    } else if (dataIndex === "addressWard") {
      const coordinate = await getCordinateFromAddress(
        {
          description:
            value.split("-")[1] +
            ", " +
            newData[index].addressDistrict?.split("-")[1] +
            ", " +
            newData[index].addressProvince?.split("-")[1],
        } as Suggestion,
        false
      );

      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        addressWardName: label,
        addressStreet: "",
        addressDetail: "",
        positionName: "",
        latitude: coordinate.lat as number,
        longitude: coordinate.lng as number,
      };
      setSearchAddress([
        coordinate?.lat.toString(),
        coordinate?.lng.toString(),
      ]);
    } else if (dataIndex === "addressStreet") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        addressDetail: "",
        positionName: "",
      };
    } else if (dataIndex === "addressDetail") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        positionName: "",
      };
    } else if (dataIndex === "positionName") {
      const coordinate = await getCordinateFromAddress(
        {
          description:
            newData[index].addressDetail +
            ", " +
            newData[index].addressStreet +
            ", " +
            newData[index].addressWard?.split("-")[1] +
            ", " +
            newData[index].addressDistrict?.split("-")[1] +
            ", " +
            newData[index].addressProvince?.split("-")[1],
        } as Suggestion,
        false
      );
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        latitude: coordinate.lat as number,
        longitude: coordinate.lng as number,
      };
      setSearchAddress([
        coordinate?.lat.toString(),
        coordinate?.lng.toString(),
      ]);
    } else if (dataIndex === "coordinate") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as any,
        latitude: value?.latitude,
        longitude: value?.longitude,
      };
    } else if (dataIndex === "latitude") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as number,
        longitude: newData[index]?.longitude as number,
      };
      setSearchAddress([
        value.toString(),
        newData[index]?.longitude?.toString(),
      ]);
    } else if (dataIndex === "longitude") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as number,
        latitude: newData[index]?.latitude as number,
      };
      setSearchAddress([
        newData[index]?.latitude?.toString(),
        value.toString(),
      ]);
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
        setListImage(deduplicatedImages);
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
  }, [compareAssets]);

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
    let address: string = "";
    if (searchAddress.length > 0) {
      address = searchAddress.join(", ");
    }
    switch (key) {
      case "dataSourceId": {
        name = "Thông tin tham chiếu";
        typeFiled = SELECT;
        options = dataSources?.data?.map((item: any) => {
          return {
            label: item.dataSourceName,
            value: item.dataSourceId,
          };
        });
        lable = renderRequired("Nguồn dữ liệu");
        order = 2;
        onChange = handleChangeDatasource;
        break;
      }
      case "appraisalUnit": {
        name = "Thông tin tham chiếu";
        typeFiled = SELECT;
        options = categoryData.companyBranchs;
        lable = renderRequired("Đơn vị định giá");
        order = 2;
        onChange = handleChangeDatasource;
        break;
      }
      case "infoSourceId": {
        name = "Thông tin tham chiếu";
        typeFiled = SELECT;
        options =
          sourceInfors?.data?.map((item: any) => {
            return {
              label: item.infoSourceName,
              value: item.infoSourceId,
            };
          }) || [];
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
        lable = renderRequired("Thời điểm");
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
        options = provinces
          ? provinces.map((item: any) => ({
              label: item.fullName,
              value: item.code + "-" + item.fullName,
            }))
          : [];
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
        lable = "Đường phố";
        order = 10;
        onChange = handleChangeDatasource;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        lable = "Chi tiết";
        order = 11;
        onChange = handleChangeDatasource;
        break;
      }
      case "positionName": {
        name = "Địa chỉ";
        lable = renderRequired("Vị trí");
        order = 12;
        typeFiled = SELECT;
        options = sourcePosition?.map((item: any) => {
          return {
            label: item.positionName,
            value: item.positionId,
          };
        });
        onChange = handleChangeDatasource;
        break;
      }
      case "mapSheetNumber": {
        name = "Địa chỉ";
        lable = "Số tờ";
        typeFiled = INPUT;
        order = 13;
        onChange = handleChangeDatasource;
        break;
      }
      case "landPlotNumber": {
        name = "Địa chỉ";
        lable = "Số thửa";
        typeFiled = INPUT;
        order = 14;
        onChange = handleChangeDatasource;
        break;
      }
      case "latitude": {
        name = "Địa chỉ";
        lable = renderRequired("Toạ độ X");
        typeFiled = INPUT;
        order = 15;
        onChange = handleChangeDatasource;
        break;
      }
      case "longitude": {
        name = "Địa chỉ";
        lable = renderRequired("Toạ độ Y");
        typeFiled = INPUT;
        order = 16;
        onChange = handleChangeDatasource;
        break;
      }
      case "legal": {
        name = "Địa chỉ";
        lable = "Pháp lý";
        order = 17;
        onChange = handleChangeDatasource;
        break;
      }
      case "geographicDescription": {
        name = "Địa chỉ";
        lable = "Mô tả vị trí địa lý";
        order = 18;
        onChange = handleChangeDatasource;
        break;
      }
      case "coordinate": {
        name = "Địa chỉ";
        lable = "Định vị";
        typeFiled = LOCAL_COORDINATE;
        order = 19;
        onChange = handleChangeDatasource;
        address = address;
        break;
      }
      // Chi tiết
      case "assetImage": {
        name = "Chi tiết";
        lable = "Hình ảnh tài sản";
        typeFiled = IMAGE;
        order = 20;
        onChange = handleChangeDatasource;
        break;
      }
      case "projectName": {
        name = "Chi tiết";
        lable = "Tên chung cư / dự án";
        typeFiled = INPUT;
        order = 21;
        onChange = handleChangeDatasource;
        break;
      }
      case "building": {
        name = "Chi tiết";
        lable = "Tòa nhà thực tế";
        typeFiled = INPUT;
        order = 22;
        onChange = handleChangeDatasource;
        break;
      }
      case "apartmentCode": {
        name = "Chi tiết";
        lable = "Mã căn hộ";
        typeFiled = INPUT;
        order = 23;
        onChange = handleChangeDatasource;
        break;
      }
      case "numberApartment": {
        name = "Chi tiết";
        lable = "Số căn hộ";
        typeFiled = INPUT_NUMBER;
        order = 24;
        onChange = handleChangeDatasource;
        break;
      }
      case "floorNo": {
        name = "Chi tiết";
        lable = "Tầng số";
        typeFiled = INPUT_NUMBER;
        order = 25;
        onChange = handleChangeDatasource;
        break;
      }
      case "totalFloor": {
        name = "Chi tiết";
        lable = "Số tầng tòa nhà";
        typeFiled = INPUT_NUMBER;
        order = 26;
        onChange = handleChangeDatasource;
        break;
      }
      case "surfaces": {
        name = "Chi tiết";
        lable = "Số mặt thoáng căn hộ";
        typeFiled = INPUT_NUMBER;
        order = 27;
        onChange = handleChangeDatasource;
        break;
      }
      case "toilets": {
        name = "Chi tiết";
        lable = "Số phòng WC";
        typeFiled = INPUT_NUMBER;
        order = 28;
        onChange = handleChangeDatasource;
        break;
      }
      case "kitchens": {
        name = "Chi tiết";
        lable = "Số phòng bếp";
        typeFiled = INPUT_NUMBER;
        order = 29;
        onChange = handleChangeDatasource;
        break;
      }
      case "bedrooms": {
        name = "Chi tiết";
        lable = "Số phòng ngủ";
        typeFiled = INPUT_NUMBER;
        order = 30;
        onChange = handleChangeDatasource;
        break;
      }
      case "furniture": {
        name = "Chi tiết";
        lable = "Nội thất";
        typeFiled = INPUT;
        order = 31;
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
        order = 32;
        onChange = handleChangeDatasource;
        break;
      }
      case "otherFactor": {
        name = "Chi tiết";
        lable = "Yếu tố khác";
        order = 33;
        onChange = handleChangeDatasource;
        break;
      }
      case "businessAdvantage": {
        name = "Chi tiết";
        lable = "Lợi thế kinh doanh";
        typeFiled = SELECT;
        options =
          bussinessAdvance?.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          }) || [];
        order = 34;
        onChange = handleChangeDatasource;
        break;
      }
      case "usingPurposeName": {
        name = "Chi tiết";
        typeFiled = SELECT;
        lable = renderRequired("Mục đích sử dụng đất");
        order = 35;
        options =
          sourceUsingPurposes?.data?.content?.map((item: any) => {
            return {
              label: item.usingPurposeName,
              value: item.usingPurposeId.toString(),
            };
          }) || [];
        onChange = handleChangeDatasource;
        break;
      }
      case "privateUseArea": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích sử dụng riêng (m²)");
        order = 36;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        break;
      }
      case "clearanceArea": {
        name = "Chi tiết";
        lable = "Diện tích thông thủy (m²)";
        order = 37;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        break;
      }
      case "buildupArea": {
        name = "Chi tiết";
        lable = "Diện tích tim tường (m²)";
        order = 38;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        break;
      }
      case "extendArea": {
        name = "Chi tiết";
        lable = "Diện tích cơi nới (m²)";
        order = 39;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá rao bán (đồng)");
        typeFiled = INPUT_NUMBER;
        order = 40;
        onChange = handleChangeDatasource;
        break;
      }
      case "transactionPrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá thương lượng (đồng)");
        typeFiled = INPUT_NUMBER;
        order = 41;
        onChange = handleChangeDatasource;
        break;
      }
      case "unitPrice": {
        name = "Chi tiết";
        lable = renderRequired("Đơn giá ước tính QSH căn hộ (đồng/m²)");
        typeFiled = INPUT_NUMBER;
        order = 42;
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
      listImage,
      address,
      setListImage,
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
        for (let i = 0; i < value.length; i++) {
          value[i] = value[i]
            ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
            : "";
        }
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
        setListImage: setListImage,
        address: renderName_label.address,
        ...value,
      };

      datasource.push(obj);
    }
    return datasource.sort((a, b) => a.order - b.order);
  };

  useEffect(() => {
    // const colSpan = columnsTb[0]?.colSpan ? columnsTb[0]?.colSpan : 0;
    setColTable(columnsTb);
    // setColSpanDefault(colSpan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsTb]);

  return (
    <Card size="small">
      <TableAddColEdit
        columns={colTable}
        dataSource={handleConvertData(compareAssets)}
        handleAddCol={handleAddCol}
        handleCoppyCol={handleCoppyCol}
        handleSubCol={handleSubCol}
      />
    </Card>
  );
};

export default memo(TableAssetInfo);
