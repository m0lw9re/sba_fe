import { memo, useEffect, useState } from "react";
import { columnsTb } from "./config";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import TableAddColEdit from "components/TableAddColEdit";
import { Card, UploadFile } from "antd";
import {
  ComparedAssetProjectCreateType,
  DistrictType,
  WardType,
} from "constant/types";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import {
  defaultItem,
  initialValue,
} from "pages/PriceShared/AssetCreate/ProjectAsset/config";
import {
  useAddressProvince,
  useDataSource,
  useSourceInfor,
  useCategoryPurpose,
  usePositions,
  useRoadTypes,
  useBussinessAdvance,
} from "utils/request";
import { addressApi } from "apis/adress";
import renderRequired from "components/RenderRequire";

type UploadProps = {
  image: UploadFile[];
  index: number;
};

type Props = {
  compareAssets: Array<ComparedAssetProjectCreateType>;
  onChangeCompareAssets: (data: Array<ComparedAssetProjectCreateType>) => void;
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
  PERCENT,
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
  const { data: sourceRoadType } = useRoadTypes();
  const { data: bussinessAdvance } = useBussinessAdvance();
  const { data: sourceUsingPurposes } = useCategoryPurpose({
    limit: 100,
    page: 1,
    direction: 1,
  });
  const [districtOptions, setDistrictOptions] = useState<
    Array<Array<{ label: string; value: string }>>
  >(initialValue.map(() => []));
  const [wardOptions, setWardOptions] = useState<
    Array<Array<{ label: string; value: string }>>
  >(initialValue.map(() => []));
  const [colTable, setColTable] = useState<ColumnsEdit>([]);
  // const [colSpanDefault, setColSpanDefault] = useState(0);

  const handleAddCol = () => {
    onChangeCompareAssets([...compareAssets, defaultItem]);
  };

  const handleSubCol = (index: number) => {
    if (compareAssets.length !== 1) {
      const newCompareAsset = [...compareAssets];
      newCompareAsset.splice(index, 1);
      onChangeCompareAssets(newCompareAsset);
    }
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
        value: ele.code + "-" + ele.name,
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
        value: ele.code + "-" + ele.name,
      };
    });
    return newItemOptions;
  };

  const handleChangeDatasource = async (
    index: number,
    dataIndex: string,
    value: any
  ) => {
    const newData = [...compareAssets];
    if (dataIndex === "addressProvince") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        addressDistrict: null,
        addressWard: null,
        addressStreet: "",
      };
      const newItemOptions = await requestDistrict(
        value.split("-")[0] as string
      );
      handleReplaceDistrictOptions(index, newItemOptions);
    } else if (dataIndex === "addressDistrict") {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value as string,
        addressWard: null,
        addressStreet: "",
      };
      const newItemOptions = await requestWard(value.split("-")[0] as string);
      handleReplaceWardOptions(index, newItemOptions);
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
        setListImage(deduplicatedImages);
      }
    } else {
      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value,
      };
    }

    if (
      dataIndex === "estimatePrice" ||
      dataIndex === "areaWidth" ||
      dataIndex === "constructionPrice" ||
      dataIndex === "constructionUnitPrice" ||
      dataIndex === "totalFloorArea" ||
      dataIndex === "remainQuality"
    ) {
      // Giá trị CTXD constructionPrice
      const resultConstructionPrice =
        Number(newData[index]?.constructionUnitPrice) *
        Number(newData[index]?.totalFloorArea) *
        (Number(newData[index]?.remainQuality) / 100);

      // Đơn giá đất landUnitPrice
      const priceTemp =
        Number(newData[index]?.estimatePrice) -
        (Math.round(resultConstructionPrice) || 0);
      const resultLandUnitPrice = priceTemp / Number(newData[index]?.areaWidth);

      newData[index] = {
        ...compareAssets[index],
        [dataIndex]: value,
        landUnitPrice: Math.round(resultLandUnitPrice) || 0,
        constructionPrice: Math.round(resultConstructionPrice) || 0,
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
    let disable = false;
    let onChange: any = () => {};
    let options: Array<{ label: string; value: string | number }> | null = null;
    let optionsDynamic: Array<Array<{ label: string; value: string }>> | null =
      null;
    let errorsNotify: any = errors?.compareAssets;
    let touchedNotify: any = touched?.compareAssets;

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
      case "infoSourceId": {
        name = "Thông tin tài sản";
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
        name = "Thông tin tài sản";
        lable = renderRequired("Người liên hệ - SĐT");
        order = 4;
        onChange = handleChangeDatasource;
        break;
      }
      case "transactionStatus": {
        name = "Thông tin tài sản";
        lable = renderRequired("Tình trạng giao dịch");
        order = 5;
        onChange = handleChangeDatasource;
        break;
      }
      case "transactionTime": {
        name = "Thông tin tài sản";
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
              value: item.code + "-" + item.name,
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
        lable = renderRequired("Đường phố");
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
      case "roadContiguousTypeId": {
        name = "Địa chỉ";
        lable = "Loại đường tiếp giáp";
        order = 13;
        typeFiled = SELECT;
        options = sourceRoadType?.map((item: any) => {
          return {
            label: item.roadContiguousTypeName,
            value: item.roadContiguousTypeId,
          };
        });
        onChange = handleChangeDatasource;
        break;
      }
      case "mapSheetNumber": {
        name = "Địa chỉ";
        lable = renderRequired("Số tờ");
        typeFiled = INPUT;
        order = 14;
        onChange = handleChangeDatasource;
        break;
      }
      case "landPlotNumber": {
        name = "Địa chỉ";
        lable = renderRequired("Số thửa");
        typeFiled = INPUT;
        order = 15;
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
        lable = "Tên dự án/Khu công nghiệp";
        typeFiled = INPUT;
        order = 16;
        onChange = handleChangeDatasource;
        break;
      }
      case "areaWidth": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích khuôn viên (m²)");
        typeFiled = INPUT_NUMBER;
        order = 17;
        onChange = handleChangeDatasource;
        break;
      }
      case "areaInplan": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích phù hợp quy hoạch (m²)");
        typeFiled = INPUT_NUMBER;
        order = 18;
        onChange = handleChangeDatasource;
        break;
      }
      case "areaUnplan": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích không phù hợp quy hoạch (m²)");
        typeFiled = INPUT_NUMBER;
        order = 19;
        onChange = handleChangeDatasource;
        break;
      }
      case "facadeLength": {
        name = "Chi tiết";
        lable = renderRequired("Kích thước mặt tiền (m)");
        typeFiled = INPUT_NUMBER;
        order = 20;
        onChange = handleChangeDatasource;
        break;
      }
      case "landLength": {
        name = "Chi tiết";
        lable = renderRequired("Kích thước chiều dài (m)");
        typeFiled = INPUT_NUMBER;
        order = 20;
        onChange = handleChangeDatasource;
        break;
      }
      case "numberOfFacade": {
        name = "Chi tiết";
        lable = "Số mặt tiền tiếp giáp";
        typeFiled = INPUT_NUMBER;
        order = 21;
        onChange = handleChangeDatasource;
        break;
      }
      case "shape": {
        name = "Chi tiết";
        lable = "Hình dạng";
        order = 22;
        onChange = handleChangeDatasource;
        break;
      }
      case "widthToMainRoad": {
        name = "Chi tiết";
        lable = "Độ rộng đường/hẻm chính/hẻm phụ (m)";
        typeFiled = INPUT_NUMBER;
        order = 23;
        onChange = handleChangeDatasource;
        break;
      }
      case "distanceToMainRoad": {
        name = "Chi tiết";
        lable = "Khoảng cách tới trục đường chính (m)";
        typeFiled = INPUT_NUMBER;
        order = 24;
        onChange = handleChangeDatasource;
        break;
      }
      case "businessAdvantage": {
        name = "Chi tiết";
        lable = "Lợi thế kinh doanh";
        order = 25;
        typeFiled = SELECT;
        options =
          bussinessAdvance?.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          }) || [];
        onChange = handleChangeDatasource;
        break;
      }
      case "legal": {
        name = "Chi tiết";
        lable = "Pháp lý";
        order = 25;
        onChange = handleChangeDatasource;
        break;
      }
      case "structure": {
        name = "Chi tiết";
        lable = "Cấu trúc";
        order = 25;
        onChange = handleChangeDatasource;
        break;
      }
      case "geographicDescription": {
        name = "Chi tiết";
        lable = "Mô tả địa lý";
        order = 25;
        onChange = handleChangeDatasource;
        break;
      }
      case "usingPurposeName": {
        name = "Chi tiết";
        typeFiled = SELECT;
        lable = renderRequired("Mục đích sử dụng đất");
        order = 26;
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
      case "description": {
        name = "Chi tiết";
        lable = "Yếu tố khác (Hợp pháp, ...)";
        order = 27;
        onChange = handleChangeDatasource;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá rao bán (đồng)");
        typeFiled = INPUT_NUMBER;
        order = 28;
        onChange = handleChangeDatasource;
        // typeFiled = "CURRENCY";
        break;
      }
      case "transactionPrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá thương lượng (đồng)");
        order = 29;
        typeFiled = INPUT_NUMBER;
        onChange = handleChangeDatasource;
        // typeFiled = "CURRENCY";
        break;
      }
      case "totalFloorArea": {
        name = "Chi tiết";
        lable = "Tổng diện tích sàn XD (m²)";
        typeFiled = INPUT_NUMBER;
        order = 30;
        onChange = handleChangeDatasource;
        break;
      }
      case "constructionUnitPrice": {
        name = "Chi tiết";
        lable = "Đơn giá XD (đồng/m²)";
        typeFiled = INPUT_NUMBER;
        order = 31;
        onChange = handleChangeDatasource;
        // typeFiled = "CURRENCY";
        break;
      }
      case "remainQuality": {
        name = "Chi tiết";
        lable = "CLCL (%)";
        typeFiled = PERCENT;
        order = 32;
        onChange = handleChangeDatasource;
        break;
      }
      case "constructionPrice": {
        name = "Chi tiết";
        lable = "Giá trị CTXD (đồng)";
        order = 33;
        disable = true;
        onChange = handleChangeDatasource;
        // typeFiled = "CURRENCY";
        typeFiled = INPUT_NUMBER;
        break;
      }
      case "landUnitPrice": {
        name = "Chi tiết";
        lable = "Đơn giá đất (đồng/m²)";
        order = 34;
        disable = true;
        onChange = handleChangeDatasource;
        // typeFiled = "CURRENCY";
        typeFiled = INPUT_NUMBER;
        break;
      }
      case "priceInPlan": {
        name = "Chi tiết";
        lable = renderRequired("Đơn giá PHQH (đồng/m²)");
        typeFiled = INPUT_NUMBER;
        order = 35;
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
      disable,
    };
  };

  const handleConvertData = (
    data: Array<ComparedAssetProjectCreateType>
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
        disable: renderName_label.disable,
        touchedNotify: renderName_label.touchedNotify,
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
