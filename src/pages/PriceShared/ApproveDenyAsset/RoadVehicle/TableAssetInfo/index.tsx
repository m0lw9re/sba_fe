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

const TableAssetInfo: React.FC<Props> = ({
  compareAssets,
  assetLevelThreeId,
}) => {
  const [colTable, setColTable] = useState<ColumnsEdit>([]);
  // const [colSpanDefault, setColSpanDefault] = useState(0);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);

  const isCarVehicle =
    assetLevelThreeId === ASSET_LV3.CAR || assetLevelThreeId === ASSET_LV3.BUS;
  const isTruckRermocVehicle =
    assetLevelThreeId === ASSET_LV3.TRUCK ||
    assetLevelThreeId === ASSET_LV3.SPECIALIZED ||
    assetLevelThreeId === ASSET_LV3.TRACTORTRUCK ||
    assetLevelThreeId === ASSET_LV3.RERMOCTRUCK;
  const isMotorbikeVehicle = assetLevelThreeId === ASSET_LV3.MOTO;

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

  const renderName_LabelForDataSource = useCallback(
    (key: string) => {
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
        case "vehicleBrandName": {
          name = "Chi tiết";
          label = renderRequired("Nhãn hiệu");
          order = 20;
          break;
        }
        case "vehicleModel": {
          name = "Chi tiết";
          label = renderRequired("Số loại/Model");
          order = 21;
          break;
        }
        case "vehicleColor": {
          name = "Chi tiết";
          label = renderRequired("Màu sơn");
          order = 22;
          break;
        }
        case "yearMfg": {
          name = "Chi tiết";
          label = renderRequired("Năm sản xuất");
          order = 23;
          break;
        }
        case "countryMfg": {
          name = "Chi tiết";
          label = renderRequired("Nước sản xuất");
          order = 24;
          break;
        }
        case "gearBoxId": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = renderRequired("Hộp số");
            order = 33;
            typeFiled = "CURRENCY";
            break;
          } else {
            return {};
          }
        }
        case "wheelFormulaId": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Công thức bánh xe";
            order = 26;
            break;
          } else {
            return {};
          }
        }
        case "fuelId": {
          name = "Chi tiết";
          label = renderRequired("Loại nhiên liệu");
          order = 27;
          break;
        }
        case "vehicleIdNumber": {
          name = "Chi tiết";
          label = renderRequired("Số khung");
          order = 28;
          break;
        }
        case "engineNumber": {
          name = "Chi tiết";
          label = renderRequired("Số máy");
          order = 29;
          break;
        }
        case "plateNumber": {
          name = "Chi tiết";
          label = "Biển kiểm soát";
          typeFiled = "CURRENCY";
          order = 30;
          break;
        }
        case "overallDims": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Kích thước bao (mm)";
            order = 31;
            // typeFiled = "CURRENCY";
            break;
          } else {
            return {};
          }
        }
        case "weightBase": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Khối lượng bản thân (kg)";
            order = 32;
            typeFiled = "CURRENCY";
            break;
          } else {
            return {};
          }
        }
        case "weightAll": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Khối lượng toàn bộ (kg)";
            order = 33;
            typeFiled = "CURRENCY";
            break;
          } else {
            return {};
          }
        }
        case "wheelBase": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Chiều dài cơ sở (mm)";
            order = 34;
            // typeFiled = "CURRENCY";
            break;
          } else {
            return {};
          }
        }
        case "personCarry": {
          name = "Chi tiết";
          label = "Số người cho phép chở";
          order = 35;
          typeFiled = "CURRENCY";
          break;
        }
        case "engineDisp": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Thể tích làm việc của động cơ (CC)";
            order = 36;
            typeFiled = "CURRENCY";
            break;
          } else {
            name = "Chi tiết";
            label = "Dung tích (CC)";
            order = 36;
            typeFiled = "CURRENCY";
            break;
          }
        }
        case "maxOutputRpm": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Công suất lớn nhất /tốc độ quay (kW/vph)";
            typeFiled = "CURRENCY";
            order = 37;
            break;
          } else {
            name = "Chi tiết";
            label = "Công suất (CC)";
            order = 37;
            break;
          }
        }
        case "numberOfKilometersUsed": {
          name = "Chi tiết";
          label = "Số km đã qua sử dụng";
          typeFiled = "CURRENCY";
          order = 38;
          break;
        }
        case "remainQuality": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "CLCL (%)";
            typeFiled = "PERCENT";
            order = 39;
            break;
          } else {
            name = "Chi tiết";
            label = "Chất lượng còn lại (%)";
            typeFiled = "PERCENT";
            order = 39;
            break;
          }
        }
        // ĐỐI VỚI  XE TẢI/ XE CHUYÊN DỤNG/ XE Ô TÔ ĐẦU KÉO/ RƠ - MOOC/ SƠ MI RƠ MOOC
        case "vehicleTrunkSize": {
          if (isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Kích thước lòng thùng xe (mm)";
            typeFiled = "CURRENCY";
            order = 40;
            break;
          } else {
            return {};
          }
        }
        case "volumeOfGoodsTransported": {
          if (isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Khối lượng hàng chuyên chở theo TK/CP TGGT (kg)";
            order = 41;
            typeFiled = "CURRENCY";
            break;
          } else {
            return {};
          }
        }
        case "volumeOfTowedGoods": {
          if (isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Khối lượng hàng chuyên kéo theo TK/CP TGGT (kg)";
            order = 42;
            typeFiled = "CURRENCY";
            break;
          } else {
            return {};
          }
        }
        case "tankCapacity": {
          if (isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Dung tích bồn (gallons/lit)";
            order = 43;
            typeFiled = "CURRENCY";
            break;
          } else {
            return {};
          }
        }
        case "transactionPrice": {
          name = "Chi tiết";
          label = "Giá giao dịch/ rao bán (đồng)";
          order = 44;
          typeFiled = "CURRENCY";
          break;
        }
        case "estimatedRate": {
          name = "Chi tiết";
          label = "Tỷ lệ ước tính (%)";
          order = 45;
          typeFiled = "CURRENCY";
          break;
        }
        case "estimatedPrice": {
          name = "Chi tiết";
          label = "Giá ước tính (đồng)";
          order = 46;
          typeFiled = "CURRENCY";
          break;
        }
      }

      return { name, label, typeFiled, order };
    },
    [isCarVehicle, isTruckRermocVehicle, isMotorbikeVehicle]
  );

  // const handleConvertData = (
  //   data: Array<ComparedAssetLandEstateCreateType>
  // ): any[] => {
  //   if (!data) return [];
  //   let datasource = [];

  //   const dataConverted = transformRowSchemaToColumnSchema(data);

  //   for (const key in dataConverted) {
  //     const renderName_lable = renderName_lableForDataSource(key);

  //     const value = dataConverted[key];

  //     if (key === "transactionTime") {
  //       for (let i = 0; i < value.length; i++)
  //         value[i] = value[i]
  //           ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
  //           : "";
  //     }

  //     if (!renderName_lable.name) continue;

  //     const obj = {
  //       key: key,
  //       name: renderName_lable.name,
  //       lable: renderName_lable.lable,
  //       typeFiled: renderName_lable.typeFiled,
  //       order: renderName_lable.order,
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
        const renderName_lable = renderName_LabelForDataSource(key);

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
            }
          }
        }

        if (!renderName_lable.name) continue;

        const obj = {
          key: key,
          name: renderName_lable.name,
          lable: renderName_lable.label,
          typeFiled: renderName_lable.typeFiled,
          order: renderName_lable.order,
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
