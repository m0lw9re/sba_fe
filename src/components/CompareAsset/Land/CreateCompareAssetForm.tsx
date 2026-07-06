/* eslint-disable react-hooks/exhaustive-deps */
import { Card, message } from "antd";
import TableAddColEdit from "components/TableAddColEdit";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { RootState } from "configs/configureStore";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { OptionType, UploadProps } from "constant/types/common";
import { ComparedAssetLandType } from "constant/types/compareAsset";
import dayjs from "dayjs";
import { ReactNode, memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isDeepEqual, transformRowSchemaToColumnSchema } from "utils/validate";
import { columnsTb, defaultItem } from "./config";
import { getUsername, randomId } from "utils";
import { loadSingleImage } from "utils/loadImage";
import { CompareAssetImagesType } from "hooks/useStoredAssetFuction";
import renderRequired from "components/RenderRequire";
import { run } from "node:test";

type Props = {
  compareAssets: Array<ComparedAssetLandType>;
  onChangeCompareAssets: (data: Array<ComparedAssetLandType>) => void;
  errors: any;
  touched: any;
  formType?: "add" | "edit";
  listImage: UploadProps[];
  setListImage?: (file: any) => void;
  districtOptions: OptionType[][];
  valuationMethodId?: number;
  isDisabled?: boolean;
  onChangeDataField: (index: number, dataIndex: string, value: any) => void;
  wardOptions: OptionType[][];
  setDistrictOptions: any;
  setWardOptions: any;
  handleGetDistrictAndWard: (
    item: ComparedAssetLandType,
    index: number
  ) => void;
};

const {
  INPUT,
  SELECT,
  LOCAL_COORDINATE,
  IMAGE,
  DAY_PICKER,
  INPUT_NUMBER,
  PERCENT,
  CALCULATE_INPUT,
  MULTI_ITEMS,
  POPUP_INPUT,
} = TYPE_FIELD;

const CreateCompareAssetForm: React.FC<Props> = ({
  compareAssets,
  valuationMethodId,
  onChangeCompareAssets,
  errors,
  touched,
  isDisabled = false,
  setListImage,
  formType = "add",
  districtOptions,
  handleGetDistrictAndWard,
  listImage,
  onChangeDataField,
  setDistrictOptions,
  setWardOptions,
  wardOptions,
}) => {
  const [isPurposeConsolidation, setPurposeConsolidation] =
    useState<Array<boolean> | null>([true]);
  const {
    provinceOptions,
    listPositionOptions,
    usingPurposeOptions,
    infoSourceOptions,
    businessAdvantageOptions,
    dataSourceOptions,
  } = useSelector((state: RootState) => state.globalSlice);
  const username = getUsername();
  const [colTable, setColTable] = useState<ColumnsEdit>(columnsTb || []);

  const handleAddCol = () => {
    onChangeCompareAssets([
      ...compareAssets,
      {
        ...defaultItem,
        whoCreate: username,
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
      setPurposeConsolidation((prev) => {
        if (!prev || prev?.length < 1) return [];
        const tmp = [...prev];
        tmp.splice(index, 1);
        return [...tmp];
      });
    }
  };
  const handleCopyCol = (index: number) => {
    const newCompareAssets = [...compareAssets];
    const copyCompareAssets = { ...newCompareAssets[index] };

    delete copyCompareAssets.assetId;
    delete copyCompareAssets.businessAdvantageId;
    delete copyCompareAssets.addressStreetFrom;
    delete copyCompareAssets.addressStreetTo;
    delete copyCompareAssets.codeBook;
    delete copyCompareAssets.commonArea;
    delete copyCompareAssets.constructions;
    delete copyCompareAssets.customerIdentity;
    delete copyCompareAssets.customerName;
    delete copyCompareAssets.description;
    delete copyCompareAssets.districts;
    delete copyCompareAssets.isFastValuation;
    delete copyCompareAssets.optimizePrice;
    delete copyCompareAssets.optimizePrices;
    delete copyCompareAssets.orderBy;
    delete copyCompareAssets.privateArea;
    delete copyCompareAssets.provinces;
    delete copyCompareAssets.radius;
    delete copyCompareAssets.roadContiguousTypeId;
    delete copyCompareAssets.roadContiguousTypeName;
    delete copyCompareAssets.roadInPriceRange;
    delete copyCompareAssets.roadInPriceRangeId;
    delete copyCompareAssets.stt;
    delete copyCompareAssets.unPlanPrice;
    delete copyCompareAssets.utilities;
    delete copyCompareAssets.valuationHistories;
    delete copyCompareAssets.valuationIds;
    delete copyCompareAssets.valuations;
    delete copyCompareAssets.wards;
    delete copyCompareAssets.assetChildId;

    copyCompareAssets.assetCode = null;
    copyCompareAssets.storedTypeId = copyCompareAssets.storedTypeId || 2;
    copyCompareAssets.key = randomId();
    newCompareAssets.splice(index === 0 ? 1 : index, 0, copyCompareAssets);

    const newItemOptionsDistrict = districtOptions[index] || [];
    const newItemOptionsWard = wardOptions[index] || [];

    setDistrictOptions((prev: OptionType[][]) => [
      ...prev,
      newItemOptionsDistrict,
    ]);
    setWardOptions((prev: OptionType[][]) => [...prev, newItemOptionsWard]);
    setPurposeConsolidation((prev) => {
      if (!prev || prev?.length < 1) return [];
      const tmp = [...prev];
      tmp.push(tmp[index]);
      return [...tmp];
    });

    onChangeCompareAssets(newCompareAssets);
  };
  const handleRenderField = (key: string) => {
    let name = "";
    let lable: ReactNode = "";
    let typeFiled = INPUT;
    let order = 1;
    let disable = false;
    let onChange: any = () => {};
    let options: Array<{ label: string; value: string | number }> | null = null;
    let optionsDynamic: OptionType[][] | null = null;
    let disableDynamic: Array<boolean> | null = null;
    let errorsNotify: any = errors?.compareAssets;
    let touchedNotify: any = touched?.compareAssets;
    let maxLength: any = 500;

    switch (key) {
      //Thông tin tham chiếu
      case "dataSourceId": {
        name = "Thông tin tham chiếu";
        typeFiled = SELECT;
        options = dataSourceOptions;
        lable = renderRequired("Nguồn dữ liệu");
        order = 2;
        onChange = onChangeDataField;
        break;
      }
      case "infoSourceId": {
        name = "Thông tin tham chiếu";
        typeFiled = SELECT;
        options = infoSourceOptions;
        lable = renderRequired("Nguồn thông tin");
        order = 3;
        onChange = onChangeDataField;
        break;
      }
      case "contact": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Người liên hệ - SĐT");
        order = 4;
        onChange = onChangeDataField;
        break;
      }
      case "transactionStatus": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Tình trạng giao dịch");
        order = 5;
        onChange = onChangeDataField;
        break;
      }
      case "transactionTime": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Thời điểm");
        typeFiled = DAY_PICKER;
        order = 6;
        onChange = onChangeDataField;
        break;
      }

      //Địa chỉ
      case "addressProvince": {
        name = "Địa chỉ";
        lable = renderRequired("Tỉnh/TP");
        order = 7;
        onChange = onChangeDataField;
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
        onChange = onChangeDataField;
        break;
      }
      case "addressWard": {
        name = "Địa chỉ";
        lable = renderRequired("Xã/Phường/Thị trấn");
        optionsDynamic = wardOptions;
        options = null;
        typeFiled = SELECT;
        order = 9;
        onChange = onChangeDataField;
        break;
      }
      case "addressStreet": {
        name = "Địa chỉ";
        lable = renderRequired("Đường phố");
        order = 10;
        onChange = onChangeDataField;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        lable = "Chi tiết";
        order = 11;
        onChange = onChangeDataField;
        break;
      }
      case "legal": {
        name = "Địa chỉ";
        lable = renderRequired("Pháp lý");
        order = 12;
        onChange = onChangeDataField;
        break;
      }
      case "positionId": {
        name = "Địa chỉ";
        lable = renderRequired("Vị trí");
        order = 13;
        onChange = onChangeDataField;
        options = listPositionOptions;
        typeFiled = SELECT;
        break;
      }
      case "mapSheetNumber": {
        name = "Địa chỉ";
        lable = "Số tờ";
        typeFiled = INPUT;
        order = 14;
        onChange = onChangeDataField;
        break;
      }
      case "landPlotNumber": {
        name = "Địa chỉ";
        lable = "Số thửa";
        typeFiled = INPUT;
        order = 15;
        onChange = onChangeDataField;
        break;
      }
      case "geographicDescription": {
        name = "Địa chỉ";
        lable = renderRequired("Vị trí tiếp giáp");
        order = 16;
        onChange = onChangeDataField;
        break;
      }
      case "coordinate": {
        name = "Địa chỉ";
        lable = "Định vị";
        typeFiled = LOCAL_COORDINATE;
        order = 17;
        onChange = onChangeDataField;
        break;
      }

      // Chi tiết
      case "assetImage": {
        name = "Chi tiết";
        lable = "Hình ảnh tài sản";
        typeFiled = IMAGE;
        order = 18;
        onChange = onChangeDataField;
        break;
      }
      case "projectName": {
        name = "Chi tiết";
        lable = "Tên dự án/Khu công nghiệp";
        typeFiled = INPUT;
        order = 19;
        onChange = onChangeDataField;
        break;
      }
      case "areaWidth": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích khuôn viên (m²)");
        typeFiled = INPUT_NUMBER;
        order = 20;
        onChange = onChangeDataField;
        break;
      }
      case "areaInplan": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích phù hợp quy hoạch (m²)");
        typeFiled = INPUT_NUMBER;
        order = 21;
        onChange = onChangeDataField;
        break;
      }
      case "areaUnplan": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích không phù hợp quy hoạch (m²)");
        disable = true;
        typeFiled = CALCULATE_INPUT;
        order = 22;
        onChange = onChangeDataField;
        break;
      }
      case "facadeLength": {
        name = "Chi tiết";
        lable = "Kích thước mặt tiền";
        typeFiled = INPUT_NUMBER;
        order = 23;
        onChange = onChangeDataField;
        break;
      }
      case "landLength": {
        name = "Chi tiết";
        lable = "Kích thước chiều dài";
        typeFiled = INPUT_NUMBER;
        order = 24;
        onChange = onChangeDataField;
        break;
      }
      case "landLengthDetail": {
        name = "Chi tiết";
        lable = "Chi tiết kích thước";
        typeFiled = POPUP_INPUT;
        maxLength = 500;
        order = 24.5;
        onChange = onChangeDataField;
        break;
      }
      case "numberOfFacade": {
        name = "Chi tiết";
        lable = "Số mặt tiền tiếp giáp";
        typeFiled = INPUT_NUMBER;
        order = 25;
        onChange = onChangeDataField;
        break;
      }
      case "shape": {
        name = "Chi tiết";
        lable = "Hình dạng";
        typeFiled = POPUP_INPUT;
        maxLength = 500;
        order = 26;
        onChange = onChangeDataField;
        break;
      }
      case "widthToMainRoad": {
        name = "Chi tiết";
        lable = "Độ rộng đường/hẻm chính/hẻm phụ (m)";
        typeFiled = INPUT_NUMBER;
        order = 27;
        onChange = onChangeDataField;
        break;
      }
      case "distanceToMainRoad": {
        name = "Chi tiết";
        lable = "Khoảng cách tới trục đường chính (m)";
        typeFiled = INPUT_NUMBER;
        order = 28;
        onChange = onChangeDataField;
        break;
      }
      case "businessAdvantage": {
        name = "Chi tiết";
        lable = "Lợi thế kinh doanh";
        typeFiled = SELECT;
        options = businessAdvantageOptions;
        order = 29;
        onChange = onChangeDataField;
        break;
      }
      case "usingPurposeId": {
        name = "Chi tiết";
        lable = renderRequired("Mục đích sử dụng đất");
        order = 30;
        onChange = (index: number, dataIndex: string, value: any) => {
          onChangeDataField(index, dataIndex, value);
          setPurposeConsolidation((prev) => {
            if (!prev) return prev;
            const newPurposeConsolidation = [...prev];
            newPurposeConsolidation[index] = value !== 80;
            return newPurposeConsolidation;
          });
        };
        optionsDynamic = null;
        options = [
          {
            value: 80,
            label: "Hỗn hợp nhiều loại đất",
          },
          ...usingPurposeOptions?.filter(
            (item: any) => Number(item.value) !== 80
          ),
        ];
        typeFiled = SELECT;
        break;
      }
      case "usingPurposeConsolidationIds": {
        name = "Chi tiết";
        lable = renderRequired("Mục đích sử dụng đất hỗn hợp");
        order = 31;
        onChange = onChangeDataField;
        optionsDynamic = null;
        options = usingPurposeOptions?.filter(
          (item: any) => Number(item.value) !== 80
        );
        typeFiled = MULTI_ITEMS;
        disableDynamic = isPurposeConsolidation;
        break;
      }
      case "combineUsingPurposeConsolidationDetail": {
        name = "Chi tiết";
        lable = "Chi tiết diện tích đất hỗn hợp";
        order = 31.5;
        onChange = onChangeDataField;
        typeFiled = INPUT;
        disableDynamic = isPurposeConsolidation;
        break;
      }

      case "planning": {
        name = "Chi tiết";
        lable = "Quy hoạch";
        order = 31.6;
        onChange = onChangeDataField;
        typeFiled = INPUT;
        break;
      }

      case "usingPeriod": {
        name = "Chi tiết";
        lable = "Thời hạn sử dụng đất";
        order = 31.6;
        onChange = onChangeDataField;
        typeFiled = INPUT;
        break;
      }

      case "transactionPrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá thương lượng (đồng)");
        order = 32.5;
        typeFiled = INPUT_NUMBER;
        onChange = onChangeDataField;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá rao bán (đồng)");
        typeFiled = INPUT_NUMBER;
        order = 32;
        onChange = onChangeDataField;
        // typeFiled = "CURRENCY";
        break;
      }
      case "totalFloorArea": {
        name = "Chi tiết";
        lable = "Tổng diện tích sàn XD (m²)";
        typeFiled = INPUT_NUMBER;
        order = 33;
        onChange = onChangeDataField;
        break;
      }
      case "structure": {
        name = "Chi tiết";
        lable = "Cấu trúc";
        typeFiled = INPUT;
        order = 34;
        onChange = onChangeDataField;
        break;
      }
      case "constructionUnitPrice": {
        name = "Chi tiết";
        lable = "Đơn giá XD (đồng/m²)";
        typeFiled = INPUT_NUMBER;
        order = 35;
        onChange = onChangeDataField;
        // typeFiled = "CURRENCY";
        break;
      }
      case "remainQuality": {
        name = "Chi tiết";
        lable = "CLCL (%)";
        typeFiled = PERCENT;
        order = 36;
        onChange = onChangeDataField;
        break;
      }
      case "constructionPrice": {
        name = "Chi tiết";
        lable = "Giá trị CTXD (đồng)";
        order = 37;
        disable = true;
        onChange = onChangeDataField;
        // typeFiled = "CURRENCY";
        typeFiled = CALCULATE_INPUT;
        break;
      }
      case "landUnitPrice": {
        if (valuationMethodId === 2) {
          return {};
        } else {
          name = "Chi tiết";
          lable = "Đơn giá đất (đồng/m²)";
          order = 38;
          onChange = onChangeDataField;
          disable = true;
          typeFiled = CALCULATE_INPUT;
          break;
        }
      }
      case "percent": {
        name = "Chi tiết";
        lable = "Tỷ lệ phần trăm (%)";
        typeFiled = PERCENT;
        order = 38.1;
        onChange = onChangeDataField;
        break;
      }
      case "lGPrice": {
        name = "Chi tiết";
        lable = "Giá trị LG bằng % giá TT";
        typeFiled = INPUT_NUMBER;
        order = 38.2;
        disable = true;
        onChange = onChangeDataField;
        break;
      }
      case "lGUnitPrice": {
        name = "Chi tiết";
        lable = "Đơn giá trừ LG (đồng/m²)";
        typeFiled = INPUT_NUMBER;
        order = 38.3;
        disable = true;
        onChange = onChangeDataField;
        break;
      }
      case "priceInPlan": {
        if (valuationMethodId === 2) {
          return {};
        } else {
          name = "Chi tiết";
          lable = renderRequired("Đơn giá PHQH (đồng/m²)");
          typeFiled = INPUT_NUMBER;
          order = 39;
          onChange = onChangeDataField;
          break;
        }
      }
      case "rentMonthPrice": {
        if (valuationMethodId === 2) {
          name = "Chi tiết";
          lable = renderRequired("Giá cho thuê (đồng/tháng)");
          typeFiled = INPUT_NUMBER;
          onChange = onChangeDataField;
          order = 40;
          break;
        } else {
          return {};
        }
      }
      case "rentYearPrice": {
        if (valuationMethodId === 2) {
          name = "Chi tiết";
          lable = renderRequired("Giá cho thuê (đồng/năm)");
          typeFiled = INPUT_NUMBER;
          onChange = onChangeDataField;
          order = 41;
          break;
        } else {
          return {};
        }
      }
      case "estimateRentYearPrice": {
        if (valuationMethodId === 2) {
          name = "Chi tiết";
          lable = renderRequired("Giá ước tính cho thuê (đồng/năm)");
          typeFiled = INPUT_NUMBER;
          onChange = onChangeDataField;
          order = 42;
          break;
        } else {
          return {};
        }
      }
      case "rentYearUnitPrice": {
        if (valuationMethodId === 2) {
          name = "Chi tiết";
          lable = renderRequired("Đơn giá cho thuê (đồng/năm)");
          typeFiled = INPUT_NUMBER;
          onChange = onChangeDataField;
          order = 43;
          break;
        } else {
          return {};
        }
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
      disable,
      disableDynamic,
      touchedNotify,
      maxLength,
    };
  };

  const handleConvertData = (data: Array<ComparedAssetLandType>): any[] => {
    if (!data) return [];
    let fields = [];
    const dataConverted = transformRowSchemaToColumnSchema(data);

    for (const key in dataConverted) {
      const renderName_label = handleRenderField(key);

      const value = dataConverted[key];

      if (key === "transactionTime") {
        for (let i = 0; i < value.length; i++)
          value[i] = value[i]
            ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
            : "";
      }

      if (key === "remainQuality") {
        for (let i = 0; i < value.length; i++) {
          const val = !isNaN(value[i]) ? Number(value[i]) : 0;
          if (val && val > 0 && val < 1) value[i] = val * 100;
        }
      }

      if (!renderName_label.name) continue;

      const obj = {
        ...renderName_label,
        ...value,
      };

      fields.push(obj);
    }
    return fields.sort((a, b) => a.order - b.order);
  };
  const handleLoadEditData = async () => {
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
      setPurposeConsolidation([item.usingPurposeId !== 80]);
    }
    setListImage && setListImage(imageItems);
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
  useEffect(() => {
    if (formType === "edit") {
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
    JSON.stringify(compareAssets?.map((item) => item.key || null)),
  ]);

  return (
    <Card size="small">
      <TableAddColEdit
        imageList={listImage}
        columns={colTable}
        dataSource={handleConvertData(compareAssets)}
        handleAddCol={!isDisabled ? handleAddCol : undefined}
        handleCoppyCol={!isDisabled ? handleCopyCol : undefined}
        handleSubCol={!isDisabled ? handleSubCol : undefined}
      />
    </Card>
  );
};
export default memo(CreateCompareAssetForm, (prevProps, nextProps) => {
  return isDeepEqual(prevProps, nextProps);
});
