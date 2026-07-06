import { memo, useCallback, useEffect, useState } from "react";
import { columnsTb } from "./config";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import TableAddCol from "components/TableAddCol";
import { Card, Spin } from "antd";
import { ComparedAssetLandEstateCreateType } from "constant/types";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import dayjs from "dayjs";
import {
  DATE_TIME_FORMAT,
  TYPE_FIELD,
  UTILITIES_APARTMENT,
} from "constant/enums";
import { loadSingleImage } from "utils/loadImage";
import renderRequired from "components/RenderRequire";

type Props = {
  compareAssets: Array<any>;
};

const { LOCAL, IMAGE } = TYPE_FIELD;

const TableAssetInfo: React.FC<Props> = ({ compareAssets }) => {
  const [colTable, setColTable] = useState<ColumnsEdit>([]);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  // const [colSpanDefault, setColSpanDefault] = useState(0);

  const getLabelUtilitiesApartment = (value: string) => {
    switch (value) {
      case UTILITIES_APARTMENT.COMMERCIALSERVICEAREA:
        return "Khu thương mại/Dịch vụ";
      case UTILITIES_APARTMENT.ELEVATOR:
        return "Thang máy";
      case UTILITIES_APARTMENT.GARAGE:
        return "Hầm để xe";
      case UTILITIES_APARTMENT.HOSPITAL_SCHOOL_PRESCHOOL:
        return "Bệnh viện/Trường học/Trường mầm non";
      case UTILITIES_APARTMENT.INNER_PARK:
        return "Công viên nội khu";
      case UTILITIES_APARTMENT.POOL:
        return "Hồ bơi";
      case UTILITIES_APARTMENT.RECEPTIONHALL:
        return "Sảnh lễ tân";
    }
  };

  useEffect(() => {
    const columnsTb: ColumnsEdit = [
      {
        title: "Nội dung",
        dataIndex: "name",
        key: "name",
        colSpan: 2,
        width: "30%",
      },
      {
        title: "lable",
        dataIndex: "lable",
        key: "lable",
        colSpan: 0,
      },
      ...compareAssets.map((_, index) => ({
        title: `TSSS`,
        dataIndex: `ts${index + 1}`,
        key: `ts${index + 1}`,
      })),
    ];
    setColTable(columnsTb);
  }, [compareAssets]);

  const renderName_LabelForDataSource = (key: string) => {
    let name = "";
    let lable: any = "";
    let typeFiled = "";
    let order = 1;

    switch (key) {
      //Thông tin tài sản
      case "assetCode": {
        name = "Thông tin tham chiếu";
        lable = "Mã tài sản";
        order = 1;
        break;
      }
      case "dataSourceName": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Nguồn dữ liệu");
        order = 2;
        break;
      }
      case "appraisalUnit": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Đơn vị định giá");
        order = 3;
        break;
      }
      case "infoSourceName": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Nguồn thông tin");
        order = 4;
        break;
      }
      case "contact": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Người liên hệ - SĐT");
        order = 5;
        break;
      }
      case "transactionStatus": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Tình trạng giao dịch");
        order = 6;
        break;
      }
      case "transactionTime": {
        name = "Thông tin tham chiếu";
        lable = renderRequired("Thời điểm giao dịch");
        order = 7;
        break;
      }

      //Địa chỉ
      case "addressProvince": {
        name = "Địa chỉ";
        lable = renderRequired("Tỉnh/TP");
        order = 8;
        break;
      }
      case "addressDistrict": {
        name = "Địa chỉ";
        lable = "Quận/Huyện/TP/Thị xã";
        lable = renderRequired("Quận/Huyện/TP/Thị xã");
        order = 9;
        break;
      }
      case "addressWard": {
        name = "Địa chỉ";
        lable = renderRequired("Xã/Phường/Thị trấn");
        order = 10;
        break;
      }
      case "addressStreet": {
        name = "Địa chỉ";
        lable = renderRequired("Đường phố");
        order = 11;
        break;
      }
      case "positionName": {
        name = "Địa chỉ";
        lable = renderRequired("Vị trí");
        order = 12;
        break;
      }
      case "mapSheetNumber": {
        name = "Địa chỉ";
        lable = renderRequired("Số tờ");
        order = 13;
        break;
      }
      case "landPlotNumber": {
        name = "Địa chỉ";
        lable = renderRequired("Số thửa");
        order = 14;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        lable = "Chi tiết";
        order = 15;
        break;
      }
      case "legal": {
        name = "Địa chỉ";
        lable = "Pháp lý";
        order = 16;
        break;
      }
      case "geographicDescription": {
        name = "Địa chỉ";
        lable = "Mô tả vị trí địa lý";
        order = 17;
        break;
      }
      case "coordinate": {
        name = "Địa chỉ";
        lable = "Định vị";
        typeFiled = LOCAL;
        order = 18;
        break;
      }

      case "assetImage": {
        name = "Chi tiết";
        lable = "Hình ảnh tài sản";
        typeFiled = IMAGE;
        order = 19;
        break;
      }
      case "projectName": {
        name = "Chi tiết";
        lable = "Tên chung cư / dự án";
        order = 20;
        break;
      }
      case "building": {
        name = "Chi tiết";
        lable = renderRequired("Tòa nhà thực tế");
        order = 21;
        break;
      }
      case "apartmentCode": {
        name = "Chi tiết";
        lable = renderRequired("Mã căn hộ");
        order = 22;
        break;
      }
      case "numberApartment": {
        name = "Chi tiết";
        lable = "Số căn hộ";
        order = 23;
        break;
      }
      case "floorNo": {
        name = "Chi tiết";
        lable = "Tầng số";
        order = 24;
        break;
      }
      case "totalFloor": {
        name = "Chi tiết";
        lable = "Số tầng tòa nhà";
        order = 24;
        break;
      }
      case "surfaces": {
        name = "Chi tiết";
        lable = "Số mặt thoáng căn hộ";
        order = 22;
        break;
      }
      case "toilets": {
        name = "Chi tiết";
        lable = "Số phòng WC";
        order = 22;
        break;
      }
      case "bedrooms": {
        name = "Chi tiết";
        lable = "Số phòng ngủ";
        order = 22;
        break;
      }
      case "kitchens": {
        name = "Chi tiết";
        lable = "Số phòng bếp";
        order = 22;
        break;
      }
      case "furniture": {
        name = "Chi tiết";
        lable = "Nội thất";
        order = 23;
        break;
      }
      case "utilities": {
        name = "Chi tiết";
        lable = "Tiện ích";
        order = 23;
        break;
      }
      case "businessAdvantage": {
        name = "Chi tiết";
        lable = "Lợi thế kinh doanh";
        order = 24;
        break;
      }
      case "otherFactor": {
        name = "Chi tiết";
        lable = "Yếu tố khác";
        order = 25;
        break;
      }
      case "privateUseArea": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích sử dụng riêng (m²)");
        order = 26;
        break;
      }
      case "extendArea": {
        name = "Chi tiết";
        lable = "Diện tích cơi nới (m²)";
        order = 27;
        lable = renderRequired("Diện tích thông thuỷ (m²)");
        break;
      }
      case "clearanceArea": {
        name = "Chi tiết";
        lable = "Diện tích quy đổi (m²)";
        order = 28;
        lable = renderRequired("Diện tích thông thuỷ (m²)");
        break;
      }
      case "buildupArea": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích tim tường (m²)");
        order = 30;
        break;
      }
      case "transactionPrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá thương lượng (đồng)");
        typeFiled = "CURRENCY";
        order = 31;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        lable = renderRequired("Giá rao bán (đồng)");
        typeFiled = "CURRENCY";
        order = 32;
        break;
      }
      case "unitPrice": {
        name = "Chi tiết";
        lable = renderRequired("Đơn giá ước tính QSH căn hộ (đồng/m²)");
        typeFiled = "CURRENCY";
        order = 33;
        break;
      }
    }

    return {
      name,
      lable,
      typeFiled,
      order,
      key,
    };
  };

  // const handleConvertData = (
  //   data: Array<ComparedAssetLandEstateCreateType>
  // ): any[] => {
  //   if (!data) return [];
  //   let datasource = [];

  //   const dataConverted = transformRowSchemaToColumnSchema(data);

  //   for (const key in dataConverted) {
  //     const renderName_label = renderName_LabelForDataSource(key);

  //     const value = dataConverted[key];

  //     if (key === "transactionTime") {
  //       for (let i = 0; i < value.length; i++)
  //         value[i] = value[i]
  //           ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
  //           : "";
  //     } else if (key === "utilities") {
  //       for (let i = 0; i < value.length; i++) {
  //         if (value[i] && value[i].includes(",")) {
  //           let label = [];
  //           const values = value[i].split(",");
  //           for (let index = 0; index < values.length; index++) {
  //             label.push(getLabelUtilitiesApartment(values[index]));
  //           }
  //           value[i] = label.join(", ");
  //         } else if (value[i]) value[i] = getLabelUtilitiesApartment(value[i]);
  //       }
  //     }

  //     if (!renderName_label.name) continue;

  //     const obj = {
  //       key: key,
  //       name: renderName_label.name,
  //       lable: renderName_label.lable,
  //       typeFiled: renderName_label.typeFiled,
  //       order: renderName_label.order,
  //       ...value,
  //     };

  //     datasource.push(obj);
  //   }
  //   return datasource.sort((a, b) => a.order - b.order);
  // };

  const handleConvertData = useCallback(
    async (data: Array<any>) => {
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
        if (key === "utilities") {
          for (let i = 0; i < value.length; i++) {
            if (value[i] && value[i].includes(",")) {
              let label = [];
              const values = value[i].split(",");
              for (let index = 0; index < values.length; index++) {
                label.push(getLabelUtilitiesApartment(values[index]));
              }
              value[i] = label.join(", ");
            } else if (value[i])
              value[i] = getLabelUtilitiesApartment(value[i]);
          }
        }

        if (key === "assetImage") {
          for (let i = 0; i < value?.length; i++) {
            if (value[i]) {
              let loadedImages = [];
              const ecmIds = value[i]?.split(";") || [];

              for (let j = 0; j < ecmIds?.length; j++) {
                const image = ecmIds[j];
                if (!image) continue;
                const loadImage = await loadSingleImage(image);
                if (loadImage) loadedImages.push(loadImage);
              }
              value[i] = loadedImages;
            }
          }
        }

        if (!renderName_label.name) continue;

        const obj = {
          key: key,
          name: renderName_label.name,
          lable: renderName_label.lable,
          typeFiled: renderName_label.typeFiled,
          order: renderName_label.order,
          ...value,
        };

        datasource.push(obj);
      }
      const arr = datasource.sort((a, b) => a.order - b.order);
      setDataTable(arr);
      setLoadingImage(false);
    },
    [renderName_LabelForDataSource]
  );

  useEffect(() => {
    if (compareAssets) {
      handleConvertData(compareAssets);
    }
  }, [compareAssets]);

  useEffect(() => {
    // const colSpan = columnsTb[0]?.colSpan ? columnsTb[0]?.colSpan : 0;
    setColTable(columnsTb);
    // setColSpanDefault(colSpan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsTb]);

  return (
    <Card size="small">
      <Spin spinning={loadingImage}>
        <TableAddCol
          columns={colTable}
          dataSource={dataTable}
          handleAddCol={() => {}}
          // handleCoppyCol={handleCoppyCol}
          handleSubCol={() => {}}
        />
      </Spin>
    </Card>
  );
};

export default memo(TableAssetInfo);
