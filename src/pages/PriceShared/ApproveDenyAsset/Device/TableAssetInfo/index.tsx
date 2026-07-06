import { memo, useCallback, useEffect, useState } from "react";
import { columnsTb } from "./config";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import TableAddCol from "components/TableAddCol";
import { Card, Spin } from "antd";
import { ComparedAssetLandEstateCreateType } from "constant/types";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import dayjs from "dayjs";
import { ASSET_LV3, DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { loadSingleImage } from "utils/loadImage";
import renderRequired from "components/RenderRequire";

type Props = {
  compareAssets: Array<any>;
  assetLevelThreeId: number;
};

const { IMAGE } = TYPE_FIELD;

const TableAssetInfo: React.FC<Props> = ({ compareAssets, assetLevelThreeId }) => {
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

  const renderName = (key: string) => {
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
      case "addressProvinceName": {
        name = "Địa chỉ";
        lable = renderRequired("Tỉnh/TP");
        order = 7;
        break;
      }
      case "addressDistrictName": {
        name = "Địa chỉ";
        lable = renderRequired("Thành phố/Quận/Huyện/Thị xã");
        order = 8;
        break;
      }
      case "addressWardName": {
        name = "Địa chỉ";
        lable = renderRequired("Xã/Phường/Thị trấn");
        order = 9;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        lable = renderRequired("Mô tả chỉ tiết");
        order = 10;
        break;
      }

      //Chi tiết
      case "assetImage": {
        name = "Chi tiết";
        lable = "Hình ảnh tài sản";
        typeFiled = IMAGE;
        order = 11;
        break;
      }
      case 'productionLineName': {
        if (assetLevelThreeId === ASSET_LV3.PRODUCTION_LINE) {
          name = 'Chi tiết';
          lable = renderRequired('Tên dây chuyền sản xuất');
          name = 'Chi tiết';
          order = 12.5;
          break;
        } else {
          return {};
        }
      }
      case 'name': {
        name = 'Chi tiết';
        lable = renderRequired('Tên MMTB');
        order = 12;
        break;
      }
      case 'brand': {
        name = 'Chi tiết';
        lable = 'Nhãn hiệu';
        order = 13;
        break;
      }
      case 'model': {
        name = 'Chi tiết';
        lable = renderRequired('Số loại/Model');
        order = 14;
        break;
      }
      case 'yearMfg': {
        name = 'Chi tiết';
        lable = renderRequired('Năm sản xuất');
        order = 15;
        break;
      }
      case 'countryMfgId': {
        name = 'Chi tiết';
        lable = renderRequired('Nước sản xuất');
        order = 16;
        break;
      }
      case 'manufacturer': {
        name = 'Chi tiết';
        lable = 'Nhà sản xuất';
        order = 17;
        break;
      }
      case 'power': {
        name = 'Chi tiết';
        lable = 'Công suất (kW)';
        order = 18;
        break;
      }
      case 'controlType': {
        name = 'Chi tiết';
        lable = 'Chế độ điều khiển';
        order = 19;
        break;
      }
      case 'size': {
        name = 'Chi tiết';
        lable = 'Kích thước (mm)';
        order = 20;
        break;
      }
      case 'specs': {
        name = 'Chi tiết';
        lable = 'Thông số kỹ thuật';
        order = 21;
        break;
      }
      case 'electricEngine': {
        name = 'Chi tiết';
        lable = 'Động cơ điện (kW)';
        order = 28;
        break;
      }
      case 'mainEngine': {
        name = 'Chi tiết';
        lable = 'Động cơ chính (kW)';
        order = 29;
        break;
      }
      case 'engineSystem': {
        name = 'Chi tiết';
        lable = 'Hệ thống thiết bị điện';
        order = 30;
        break;
      }
      // ###
      case 'additionalContent': {
        name = 'Chi tiết';
        lable = 'Nội dung khác';
        order = 26;
        break;
      }
      case 'currentUseSituation': {
        name = 'Chi tiết';
        lable = 'Hiện trạng sử dụng';
        order = 32;
        break;
      }
      // #######
      case 'numberOfDaysUsed': {
        name = 'Chi tiết';
        lable = 'Số thời gian đã qua sử dụng (ngày)';
        order = 28;
        break;
      }
      case 'remainQuality': {
        name = 'Chi tiết';
        lable = 'Chất lượng còn lại (%)';
        order = 33;
        break;
      }

      case 'transactionPrice': {
        name = 'Chi tiết';
        lable = renderRequired('Giá giao dịch/ rao bán (đồng)');
        order = 34;
        typeFiled = "CURRENCY";
        break;
      }
      // #######
      case 'estimatedRate': {
        name = 'Chi tiết';
        lable = 'Tỉ lệ ước tính (%)';
        order = 33.5;
        typeFiled = "CURRENCY";
        break;
      }
      case 'estimatePrice': {
        name = 'Chi tiết';
        lable = renderRequired('Giá ước tính (đồng)');
        order = 35;
        typeFiled = "CURRENCY";
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
        const renderName_label = renderName(key);

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
                const loadImage = await loadSingleImage(image)
                if(loadImage) loadedImages.push(loadImage);
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
    [renderName]
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
