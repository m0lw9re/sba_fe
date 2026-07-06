import { memo, useCallback, useEffect, useState } from "react";
import { columnsTb } from "./config";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import TableAddCol from "components/TableAddCol";
import { Card, Spin } from "antd";
import { ComparedAssetLandEstateCreateType } from "constant/types";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
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
        name = "Thông tin tài sản";
        lable = "Mã tài sản";
        order = 1;
        break;
      }
      case "dataSourceName": {
        name = "Thông tin tài sản";
        lable = renderRequired("Nguồn dữ liệu");
        order = 2;
        break;
      }
      case "infoSourceName": {
        name = "Thông tin tài sản";
        lable = renderRequired("Nguồn thông tin");
        order = 3;
        break;
      }
      case "contact": {
        name = "Thông tin tài sản";
        lable = renderRequired("Người liên hệ - SĐT");
        order = 4;
        break;
      }
      case "transactionStatus": {
        name = "Thông tin tài sản";
        lable = renderRequired("Tình trạng giao dịch");
        order = 5;
        break;
      }
      case "transactionTime": {
        name = "Thông tin tài sản";
        lable = renderRequired("Thời điểm");
        order = 6;
        break;
      }

      //Địa chỉ
      case "addressProvince": {
        name = "Địa chỉ";
        lable = renderRequired("Tỉnh/TP");
        order = 7;
        break;
      }
      case "addressDistrict": {
        name = "Địa chỉ";
        lable = "Quận/Huyện/TP/Thị xã";
        lable = renderRequired("Quận/Huyện/TP/Thị xã");
        order = 8;
        break;
      }
      case "addressWard": {
        name = "Địa chỉ";
        lable = renderRequired("Xã/Phường/Thị trấn");
        order = 9;
        break;
      }
      case "addressStreet": {
        name = "Địa chỉ";
        lable = renderRequired("Đường phố");
        order = 10;
        break;
      }
      case "positionName": {
        name = "Địa chỉ";
        lable = renderRequired("Vị trí");
        order = 11;
        break;
      }
      case "roadContiguousTypeName": {
        name = "Địa chỉ";
        lable = "Loại đường tiếp giáp";
        order = 11;
        break;
      }
      case "mapSheetNumber": {
        name = "Địa chỉ";
        lable = renderRequired("Số tờ");
        order = 12;
        break;
      }
      case "landPlotNumber": {
        name = "Địa chỉ";
        lable = renderRequired("Số thửa");
        order = 13;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        lable = "Chi tiết";
        order = 14;
        break;
      }
      case "coordinate": {
        name = "Địa chỉ";
        lable = "Định vị";
        typeFiled = LOCAL;
        order = 15;
        break;
      }

      case "assetImage": {
        name = "Chi tiết";
        lable = "Hình ảnh tài sản";
        typeFiled = IMAGE;
        order = 16;
        break;
      }
      case "projectName": {
        name = "Chi tiết";
        lable = "Tên dự án/Khu công nghiệp";
        order = 16;
        break;
      }
      case "areaWidth": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích khuôn viên (m²)");
        order = 17;
        typeFiled = "CURRENCY";
        break;
      }
      case "areaInplan": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích phù hợp quy hoạch (m²)");
        order = 18;
        typeFiled = "CURRENCY";
        break;
      }
      case "areaUnplan": {
        name = "Chi tiết";
        lable = renderRequired("Diện tích không phù hợp quy hoạch (m²)");
        order = 19;
        typeFiled = "CURRENCY";
        break;
      }
      case "facadeLength": {
        name = "Chi tiết";
        lable = renderRequired("Kích thước mặt tiền (m)");
        order = 20;
        typeFiled = "CURRENCY";
        break;
      }
      case "numberOfFacade": {
        name = "Chi tiết";
        lable = "Số mặt tiền tiếp giáp";
        order = 21;
        break;
      }
      case "shape": {
        name = "Chi tiết";
        lable = "Hình dạng";
        order = 22;
        break;
      }
      case "widthToMainRoad": {
        name = "Chi tiết";
        lable = "Độ rộng đường/hẻm chính/hẻm phụ (m)";
        order = 23;
        break;
      }
      case "distanceToMainRoad": {
        name = "Chi tiết";
        lable = "Khoảng cách tới trục đường chính (m)";
        order = 24;
        break;
      }
      case "businessAdvantage": {
        name = "Chi tiết";
        lable = "Lợi thế kinh doanh";
        order = 25;
        break;
      }
      case "legal": {
        name = "Chi tiết";
        lable = "Pháp lý";
        order = 25;
        break;
      }
      case "structure": {
        name = "Chi tiết";
        lable = "Cấu trúc";
        order = 25;
        break;
      }
      case "geographicDescription": {
        name = "Chi tiết";
        lable = "Mô tả địa lý";
        order = 25;
        break;
      }
      case "usingPurposeName": {
        name = "Chi tiết";
        lable = "Mục đích sử dụng đất";
        order = 26;
        break;
      }
      case "combineUsingPurposeConsolidationDetail": {
        name = "Chi tiết";
        lable = "Chi tiết diện tích đất hỗn hợp";
        order = 26.5;
        break;
      }
      case "description": {
        name = "Chi tiết";
        lable = "Yếu tố khác";
        order = 27;
        break;
      }
      case "transactionPrice": {
        name = "Chi tiết";
        typeFiled = "CURRENCY";
        lable = renderRequired("Giá thương lượng (đồng)");
        order = 28;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        typeFiled = "CURRENCY";
        lable = renderRequired("Giá rao bán (đồng)");
        order = 29;
        break;
      }
      case "totalFloorArea": {
        name = "Chi tiết";
        lable = "Tổng diện tích sàn XD (m²)";
        order = 30;
        break;
      }
      case "constructionUnitPrice": {
        name = "Chi tiết";
        lable = "Đơn giá XD (đồng/m²)";
        typeFiled = "CURRENCY";
        order = 31;
        break;
      }
      case "remainQuality": {
        name = "Chi tiết";
        lable = "CLCL (%)";
        order = 32;
        break;
      }
      case "percent": {
        name = "Chi tiết";
        lable = "Tỷ lệ phần trăm (%)";
        order = 32.1;
        break;
      }
      case "lGPrice": {
        name = "Chi tiết";
        lable = "Giá trị LG bằng % giá TT";
        typeFiled = "CURRENCY";
        order = 32.2;
        break;
      }
      case "lGUnitPrice": {
        name = "Chi tiết";
        lable = "Đơn giá trừ LG (đồng/m²)";
        typeFiled = "CURRENCY";
        order = 32.3;
        break;
      }
      case "constructionPrice": {
        name = "Chi tiết";
        lable = "Giá trị CTXD (đồng)";
        typeFiled = "CURRENCY";
        order = 33;
        break;
      }
      case "landUnitPrice": {
        name = "Chi tiết";
        lable = "Đơn giá đất (đồng/m²)";
        typeFiled = "CURRENCY";
        order = 34;
        break;
      }
      case "priceInPlan": {
        name = "Chi tiết";
        lable = "Đơn giá PHQH (đồng/m²)";
        typeFiled = "CURRENCY";
        order = 35;
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
              setColTable(columnsTb);
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
