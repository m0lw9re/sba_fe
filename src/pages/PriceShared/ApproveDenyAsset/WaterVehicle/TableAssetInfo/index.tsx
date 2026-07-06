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

const { IMAGE } = TYPE_FIELD;

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
        width: '30%'
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
      let label: any = "";
      let typeFiled = "";
      let order = 1;

      // @type {ComparedAssetRoadVehicleCreateType}
      switch (key) {
        //Thông tin tham chiếu
        case "dataSourceName": {
          name = "Thông tin tham chiếu";
          label = renderRequired("Nguồn dữ liệu");
          order = 1;
          break;
        }
        case "infoSourceName": {
          name = "Thông tin tham chiếu";
          label = renderRequired("Nguồn thông tin");
          order = 2;
          break;
        }
        case "contact": {
          name = "Thông tin tham chiếu";
          label = renderRequired("Người liên hệ - SĐT");
          order = 3;
          break;
        }
        // case 'transactionStatus': {
        //   name = 'Thông tin tham chiếu';
        //   label = 'Tình trạng giao dịch';
        //   order = 5;
        //   break;
        // }
        case "transactionTime": {
          name = "Thông tin tham chiếu";
          label = renderRequired("Thời điểm");
          order = 4;
          break;
        }

        //Địa chỉ
        case "addressProvinceName": {
          name = "Địa chỉ";
          label = renderRequired("Tỉnh/TP");
          order = 7;
          break;
        }
        case "addressDistrictName": {
          name = "Địa chỉ";
          label = renderRequired("Thành phố/Quận/Huyện/Thị xã");
          order = 8;
          break;
        }
        case "addressWardName": {
          name = "Địa chỉ";
          label = renderRequired("Xã/Phường/Thị trấn");
          order = 9;
          break;
        }
        case "addressDetail": {
          name = "Địa chỉ";
          label = renderRequired("Mô tả chỉ tiết");
          order = 10;
          break;
        }

        //Chi tiết
        case "assetImage": {
          name = "Chi tiết";
          label = "Hình ảnh tài sản";
          typeFiled = "IMAGE";
          order = 18;
          break;
        }
        case "name": {
          name = "Chi tiết";
          label = renderRequired("Tên phương tiện");
          order = 19;
          break;
        }
        case "registerNumber": {
          name = "Chi tiết";
          label = renderRequired("Số đăng ký");
          order = 20;
          break;
        }
        case "model": {
          name = "Chi tiết";
          label = renderRequired("Số loại/Model");
          order = 21;
          break;
        }
        case "imoNumber": {
          name = "Chi tiết";
          label = renderRequired("Số nhận dạng tàu/Số IMO");
          order = 22;
          break;
        }
        case "brandName": {
          name = "Chi tiết";
          label = renderRequired("Nhãn hiệu");
          order = 23;
          break;
        }
        case "yearMfg": {
          name = "Chi tiết";
          label = renderRequired("Năm sản xuất");
          order = 24;
          break;
        }
        case "yearReconstructed": {
          name = "Chi tiết";
          label = renderRequired("Năm hoán cải");
          order = 25;
          break;
        }
        case "countryMfg": {
          name = "Chi tiết";
          label = renderRequired("Nước sản xuất");
          order = 26;
          break;
        }
        case "manufacturingLocation": {
          name = "Chi tiết";
          label = renderRequired("Nơi đóng tàu");
          order = 27;
          break;
        }
        case "shipbuildingBrand": {
          name = "Chi tiết";
          label = renderRequired("Hãng đóng tàu");
          order = 28;
          break;
        }
        case "registerCountry": {
          name = "Chi tiết";
          label = renderRequired("Quốc gia đăng ký");
          order = 29;
          break;
        }
        case "shipType": {
          name = "Chi tiết";
          label = renderRequired("Công năng sử dụng");
          order = 30 ;
          break;
        }
        case "personCarry": {
            name = "Chi tiết";
            label = "Số lượng người được phép chở";
            order = 31;
            break;
        }
        case "designLength": {
            name = "Chi tiết";
            label = "Chiều dài thiết kế (m)";
            order = 32;
            typeFiled = "CURRENCY";
            break;
        }
        case "designWidth": {
            name = "Chi tiết";
            label = "Chiều rộng thiết kế (m)";
            order = 33;
            typeFiled = "CURRENCY";
            break;
        }
        case "maxLength": {
            name = "Chi tiết";
            label = "Chiều dài lớn nhất (m)";
            order = 34;
            typeFiled = "CURRENCY";
            break;
        }
        case "boardHeight": {
          name = "Chi tiết";
          label = "Chiều cao mạn (m)";
          order = 35;
          typeFiled = "CURRENCY";
          break;
        }
        case "sink": {
          name = "Chi tiết";
          label = "Chiều chìm (m)";
          order = 36;
          typeFiled = "CURRENCY";
          break;
        }
        case "freeBoard": {
          name = "Chi tiết";
          label = "Mạn khô (m)";
          order = 37;
          typeFiled = "CURRENCY";
          break;
        }
        case "machineNum": {
          name = "Chi tiết";
          label = "Số lượng máy chính";
          typeFiled = "CURRENCY";
          order = 38;
          break;
        }
        case "machineNum": {
          name = "Chi tiết";
          label = "Công suất máy chính (kW)";
          typeFiled = "CURRENCY";
          order = 39;
          break;
        }
        case "deadWeight": {
          name = "Chi tiết";
          label = "Trọng tải toàn phần (MT)";
          typeFiled = "CURRENCY";
          order = 40;
          break;
        }
        case "grossTonnage": {
          name = "Chi tiết";
          label = "Tổng dung tích (GT)";
          typeFiled = "CURRENCY";
          order = 42;
          break;
        }
        case "useTonnage": {
          name = "Chi tiết";
          label = "Dung tích thực dụng (NT)";
          typeFiled = "CURRENCY";
          order = 43;
          break;
        }
        case "speed": {
          name = "Chi tiết";
          label = "Tốc độ tàu (HL)";
          typeFiled = "CURRENCY";
          order = 44;
          break;
        }
        case "additionalContent": {
            name = "Chi tiết";
            label = "Nội dung khác";
            order = 45;
            break;
        }
        case "currentUseSituation": {
          name = "Chi tiết";
          label = "Hiện trạng sử dụng";
          order = 45;
          break;
      }
      case 'numberOfDaysUsed': {
        name = 'Chi tiết';
        label = 'Số thời gian đã qua sử dụng (ngày)';
        order = 46;
        break;
      }
      case 'remainQuality': {
        name = 'Chi tiết';
        label = 'Chất lượng còn lại (%)';
        order = 47;
        break;
      }
      case 'transactionPrice': {
        name = 'Chi tiết';
        label = renderRequired('Giá giao dịch/rao bán (đồng)');
        order = 48;
        typeFiled = "CURRENCY";
        break;
      }
      case 'estimatedRate': {
        name = 'Chi tiết';
        label = 'Tỉ lệ ước tính (%)';
        order = 49;
        typeFiled = "CURRENCY";
        break;
      }
      case 'estimatePrice': {
        name = 'Chi tiết';
        label = renderRequired('Giá ước tính (đồng)');
        order = 50;
        typeFiled = "CURRENCY";
        break;
      }
    }

    return {
      name,
      label,
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
              let loadedImages = []
              const ecmIds = value[i]?.split(';') || [];

              for (let j = 0; j < ecmIds?.length; j++) {
                const image = ecmIds[j]
                if (!image) continue
                const loadImage = await loadSingleImage(image)
                if(loadImage) loadedImages.push(loadImage);
              }
              value[i] = loadedImages
            }
          }
        }

        if (!renderName_label.name) continue;

        const obj = {
          key: key,
          name: renderName_label.name,
          lable: renderName_label.label,
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
          handleAddCol={() => { }}
          // handleCoppyCol={handleCoppyCol}
          handleSubCol={() => { }}
        />
      </Spin>
    </Card>
  );
};

export default memo(TableAssetInfo);
