import { Checkbox, Spin, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import TableAddCol from "components/TableAddCol";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import {
  ROAD_ADVANTAGE_OPTIONS,
  ROAD_FUEL_ADVANTAGE_OPTIONS,
  ROAD_GEARBOX_ADVANTAGE_OPTIONS,
  ROAD_WHEELFORMULAS_ADVANTAGE_OPTIONS,
} from "constant/common";
import { ASSET_LV3, DATE_TIME_FORMAT } from "constant/enums";
import dayjs from "dayjs";
import { FC, Fragment, memo, useCallback, useEffect, useState } from "react";
import { randomId } from "utils";
import { loadSingleImage } from "utils/loadImage";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import AddCompareAssetModal from "../../CreateTSSSModal/AddCompareAssetModal";
import EditTSSSModal from "../../EditTSSSModal";
import CreateRoadVehicleUsingForm from "./RoadVehicle";

type Props = {
  storedAssets: Array<any>;
  adjustTable: Array<any>;
  assetLevelTwoId: number;
  assetType: number;
  exportToReport: boolean;
  disabledActions?: boolean;
  onChangeExportToReport: (data: boolean) => void;
  handleUpdateAdjustTable: (data: any) => void;
  handleUpdateStoredAssets: (data: any) => void;
};

const TableAssetInfoRoadVehicle: FC<Props> = ({
  storedAssets = [],
  assetLevelTwoId,
  adjustTable,
  handleUpdateAdjustTable,
  handleUpdateStoredAssets,
  assetType,
  exportToReport,
  onChangeExportToReport,
  disabledActions,
}) => {
  // check based on assetLevelThreeId
  const assetLevelThreeId: number =
    storedAssets[0]?.assetLevelThreeId || ASSET_LV3.CAR;
  const isCarVehicle =
    assetLevelThreeId === ASSET_LV3.CAR || assetLevelThreeId === ASSET_LV3.BUS;
  const isTruckRermocVehicle =
    assetLevelThreeId === ASSET_LV3.TRUCK ||
    assetLevelThreeId === ASSET_LV3.SPECIALIZED ||
    assetLevelThreeId === ASSET_LV3.TRACTORTRUCK ||
    assetLevelThreeId === ASSET_LV3.RERMOCTRUCK;
  const isMotorbikeVehicle = assetLevelThreeId === ASSET_LV3.MOTO;

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedTsss, setSelectedTsss] = useState<any>();

  const [colTable, setColTable] = useState<ColumnsEdit>([]);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [loading, setLoadingImage] = useState<boolean>(false);

  const handleAddTSSS = async (storedAssetIds: any[]) => {
    try {
      const firstAdjust = [...adjustTable].shift();
      const param = {
        assetIds: storedAssetIds,
        adjustCriteriaIds:
          firstAdjust?.adjustTable?.map((el: any) => el.adjustCriteriaId) || [],
      };
      const res: any = await appraisalFilesApi.getStoredAssets(
        assetLevelTwoId,
        param
      );

      const tmpAdjustTable = [...adjustTable.filter((_, index) => index !== 0)];

      res.data?.body?.adjustTable.forEach((el: any) => {
        const foundIndex = tmpAdjustTable.findIndex(
          (item) => item.storedAssetId === el.storedAssetId
        );

        if (foundIndex === -1) tmpAdjustTable.push(el);
        else {
          const clAdjust = [...tmpAdjustTable[foundIndex].adjustTable];
          for (let i = 0; i < clAdjust.length; i++) {
            const foundIndexCriteriaId = el.adjustTable.findIndex(
              (_x: any) => _x.adjustCriteriaId === clAdjust[i].adjustCriteriaId
            );
            if (foundIndexCriteriaId !== -1)
              clAdjust[i] = {
                ...el.adjustTable[foundIndexCriteriaId],
                ratio: clAdjust[i].ratio,
              };
          }
          tmpAdjustTable[foundIndex] = {
            ...tmpAdjustTable[foundIndex],
            adjustTable: clAdjust,
          };
        }
      });

      const tmpStoredAssets = [...storedAssets];
      res.data?.body?.storeAsset.forEach((el: any) => {
        const foundIndex = tmpStoredAssets.findIndex(
          (item) => item.assetId === el.assetId
        );

        if (foundIndex === -1) tmpStoredAssets.push(el);
      });

      handleUpdateAdjustTable([firstAdjust, ...tmpAdjustTable]);
      handleUpdateStoredAssets([...tmpStoredAssets]);
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleEdit_TSSS = async (storedAssetIds: any[]) => {
    try {
      const firstAdjust = [...adjustTable].shift();
      const param = {
        assetIds: storedAssetIds,
        adjustCriteriaIds:
          firstAdjust?.adjustTable?.map((el: any) => el.adjustCriteriaId) || [],
      };
      const res: any = await appraisalFilesApi.getStoredAssets(
        assetLevelTwoId,
        param
      );

      const tmpAdjustTable = [...adjustTable.filter((_, index) => index !== 0)];

      res.data?.body?.adjustTable.forEach((el: any) => {
        const foundIndex = tmpAdjustTable.findIndex(
          (item) => item.storedAssetId === el.storedAssetId
        );

        if (foundIndex === -1) tmpAdjustTable.push(el);
        else {
          const clAdjust = [...tmpAdjustTable[foundIndex].adjustTable];
          for (let i = 0; i < clAdjust.length; i++) {
            const foundIndexCriteriaId = el.adjustTable.findIndex(
              (_x: any) => _x.adjustCriteriaId === clAdjust[i].adjustCriteriaId
            );
            if (foundIndexCriteriaId !== -1)
              clAdjust[i] = {
                ...el.adjustTable[foundIndexCriteriaId],
                ratio: clAdjust[i].ratio,
              };
          }
          tmpAdjustTable[foundIndex] = {
            ...tmpAdjustTable[foundIndex],
            adjustTable: clAdjust,
          };
        }
      });

      const tmpStoredAssets = [...storedAssets];
      res.data?.body?.storeAsset.forEach((el: any) => {
        const foundIndex = tmpStoredAssets.findIndex(
          (item) => item.assetId === el.assetId
        );

        if (foundIndex === -1) tmpStoredAssets.push(el);
        else
          tmpStoredAssets[foundIndex] = {
            ...tmpStoredAssets[foundIndex],
            ...el,
          };
      });

      handleUpdateAdjustTable([firstAdjust, ...tmpAdjustTable]);
      handleUpdateStoredAssets([...tmpStoredAssets]);
      // handleSaveInBackground({
      //   adjustTable: [firstAdjust, ...tmpAdjustTable],
      //   storedAssets: [...tmpStoredAssets],
      // });
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubCol = (data: any) => {
    const tmpStoredAssets = [...storedAssets].filter(
      (el) => el.assetId !== data.key
    );

    const tmpAdjustTable = [...adjustTable].filter(
      (el) => el.storedAssetId !== data.key
    );

    handleUpdateStoredAssets(tmpStoredAssets);
    handleUpdateAdjustTable(tmpAdjustTable);
  };

  const handleOpenAddColModal = () => {
    setIsOpenModal(true);
  };

  const renderName_LabelForDataSource = useCallback(
    (key: string) => {
      let name = "";
      let label: any = "";
      let typeFiled = "";
      let order = 1;

      // @type {ComparedAssetRoadVehicleCreateType}
      switch (key) {
        //Thông tin tham chiếu
        case "assetCode": {
          name = "Thông tin tham chiếu";
          label = "Mã kho";
          order = 1;
          break;
        }
        case "dataSourceName": {
          name = "Thông tin tham chiếu";
          label = "Nguồn dữ liệu";
          order = 2;
          break;
        }
        case "infoSourceName": {
          name = "Thông tin tham chiếu";
          label = "Nguồn thông tin";
          order = 3;
          break;
        }
        case "contact": {
          name = "Thông tin tham chiếu";
          label = "Người liên hệ - SĐT";
          order = 4;
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
          label = "Thời điểm";
          order = 6;
          break;
        }

        //Địa chỉ
        case "addressProvinceName": {
          name = "Địa chỉ";
          label = "Tỉnh/TP";
          order = 7;
          break;
        }
        case "addressDistrictName": {
          name = "Địa chỉ";
          label = "Thành phố/Quận/Huyện/Thị xã";
          order = 8;
          break;
        }
        case "addressWardName": {
          name = "Địa chỉ";
          label = "Xã/Phường/Thị trấn";
          order = 9;
          break;
        }
        case "addressDetail": {
          name = "Địa chỉ";
          label = "Mô tả chỉ tiết";
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
        case "type": {
          name = "Chi tiết";
          label = "Phân loại tài sản";
          order = 19;
          break;
        }
        case "vehicleBrandName": {
          name = "Chi tiết";
          label = "Nhãn hiệu";
          order = 20;
          break;
        }
        case "vehicleModel": {
          name = "Chi tiết";
          label = "Số loại/Model";
          order = 21;
          break;
        }
        case "vehicleColor": {
          name = "Chi tiết";
          label = "Màu sơn";
          order = 22;
          break;
        }
        case "yearMfg": {
          name = "Chi tiết";
          label = "Năm sản xuất";
          order = 23;
          break;
        }
        case "countryMfg": {
          name = "Chi tiết";
          label = "Nước sản xuất";
          order = 24;
          break;
        }
        case "noteLegalSBA": {
          name = "Chi tiết";
          label = "Pháp lý";
          order = 24.1;
          break;
        }
        case "gearBoxId": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Hộp số";
            order = 33;
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
          label = "Loại nhiên liệu";
          order = 27;
          break;
        }
        case "vehicleIdNumber": {
          name = "Chi tiết";
          label = "Số khung";
          order = 28;
          break;
        }
        case "engineNumber": {
          name = "Chi tiết";
          label = "Số máy";
          order = 29;
          break;
        }
        case "plateNumber": {
          name = "Chi tiết";
          label = "Biển kiểm soát";
          order = 30;
          break;
        }
        case "overallDims": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Kích thước bao (mm)";
            // typeFiled = "CURRENCY";
            order = 31;
            break;
          } else {
            return {};
          }
        }
        case "weightBase": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Khối lượng bản thân (kg)";
            typeFiled = "CURRENCY";
            order = 32;
            break;
          } else {
            return {};
          }
        }
        case "weightAll": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Khối lượng toàn bộ (kg)";
            typeFiled = "CURRENCY";
            order = 33;
            break;
          } else {
            return {};
          }
        }
        case "wheelBase": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Chiều dài cơ sở (mm)";
            // typeFiled = "CURRENCY";
            order = 34;
            break;
          } else {
            return {};
          }
        }
        case "personCarry": {
          name = "Chi tiết";
          label = "Số người cho phép chở";
          order = 35;
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
            typeFiled = "CURRENCY";
            order = 37;
            break;
          }
        }
        case "currentUseSituation": {
          name = "Chi tiết";
          label = "Hiện trạng sử dụng";
          order = 37.4;
          break;
        }
        case "numberOfTires": {
          if (isCarVehicle || isTruckRermocVehicle) {
            name = "Chi tiết";
            label = "Số lượng lốp/cỡ lốp";
            typeFiled = "CURRENCY";
            order = 37.5;
            break;
          } else {
            return {};
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
            typeFiled = "CURRENCY";
            label = "Khối lượng hàng chuyên chở theo TK/CP TGGT (kg)";
            order = 41;
            break;
          } else {
            return {};
          }
        }
        case "volumeOfTowedGoods": {
          if (isTruckRermocVehicle) {
            name = "Chi tiết";
            typeFiled = "CURRENCY";
            label = "Khối lượng hàng chuyên kéo theo TK/CP TGGT (kg)";
            order = 42;
            break;
          } else {
            return {};
          }
        }
        case "tankCapacity": {
          if (isTruckRermocVehicle) {
            name = "Chi tiết";
            typeFiled = "CURRENCY";
            label = "Dung tích bồn (gallons/lit)";
            order = 43;
            break;
          } else {
            return {};
          }
        }
        case "transactionPrice": {
          name = "Chi tiết";
          typeFiled = "CURRENCY";
          label = "Giá giao dịch/ rao bán (đồng)";
          order = 44;
          break;
        }
        case "estimatedRate": {
          name = "Chi tiết";
          typeFiled = "PERCENT";
          label = "Tỷ lệ ước tính (%)";
          order = 45;
          break;
        }
        case "estimatedPrice": {
          name = "Chi tiết";
          typeFiled = "CURRENCY";
          label = "Giá ước tính (đồng)";
          order = 46;
          break;
        }
      }

      return { name, label, typeFiled, order };
    },
    [isCarVehicle, isTruckRermocVehicle, isMotorbikeVehicle]
  );

  const handleConvertData = useCallback(
    async (data: Array<any>) => {
      setLoadingImage(true);
      if (!data) return [];
      let dataSource = [];
      const dataConverted = transformRowSchemaToColumnSchema(data, false);

      for (const key in dataConverted) {
        const renderName_Label = renderName_LabelForDataSource(key);

        const value = dataConverted[key];

        if (key === "assetImage") {
          for (let i = 0; i < value?.length; i++) {
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

        if (key === "remainQuality") {
          for (let i = 0; i < value.length; i++) {
            const val = !isNaN(value[i]) ? Number(value[i]) : 0;
            if (val && val >= 0 && val <= 1) {
              // fix 55.50000000000001 error
              value[i] =
                Math.round(val * 100 * Math.pow(10, 3)) / Math.pow(10, 3);
            }
          }
        }

        if (key === "transactionTime") {
          for (let i = 0; i < value.length; i++)
            value[i] = value[i]
              ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
              : "";
        }

        if (key === "type") {
          for (let i = 0; i < value.length; i++) {
            if (!isNaN(Number(value[i]))) {
              const foundObj = ROAD_ADVANTAGE_OPTIONS.find(
                (el) => el.value === value[i]
              );
              if (foundObj) {
                value[i] = foundObj.label;
              }
            }
          }
        }
        if (key === "fuelId") {
          for (let i = 0; i < value.length; i++) {
            if (!isNaN(Number(value[i]))) {
              const foundObj = ROAD_FUEL_ADVANTAGE_OPTIONS.find(
                (el) => el.value === value[i]
              );
              if (foundObj) {
                value[i] = foundObj.label;
              }
            }
          }
        }
        if (key === "gearBoxId") {
          for (let i = 0; i < value.length; i++) {
            if (!isNaN(Number(value[i]))) {
              const foundObj = ROAD_GEARBOX_ADVANTAGE_OPTIONS.find(
                (el) => el.value === value[i]
              );
              if (foundObj) {
                value[i] = foundObj.label;
              }
            }
          }
        }
        if (key === "wheelFormulaId") {
          for (let i = 0; i < value.length; i++) {
            if (!isNaN(Number(value[i]))) {
              const foundObj = ROAD_WHEELFORMULAS_ADVANTAGE_OPTIONS.find(
                (el) => el.value === value[i]
              );
              if (foundObj) {
                value[i] = foundObj.label;
              }
            }
          }
        }
        // if (key === 'businessAdvantage') {
        //   for (let i = 0; i < value.length; i++) {
        //     if (!isNaN(Number(value[i]))) {
        //       const foundObj = BUSINESS_ADVANTAGE_OPTIONS.find(
        //         el => el.value.toString() === value[i],
        //       );
        //       if (foundObj) {
        //         value[i] = foundObj.label;
        //       }
        //     }
        //   }
        // }
        if (!renderName_Label.name) continue;

        const obj = {
          key: key,
          name: renderName_Label.name,
          lable: renderName_Label.label,
          typeFiled: renderName_Label.typeFiled,
          order: renderName_Label.order,
          ...value,
        };

        dataSource.push(obj);
      }
      const arr = dataSource.sort((a, b) => a.order - b.order);
      setDataTable(arr);
      setLoadingImage(false);
    },
    [renderName_LabelForDataSource]
  );

  const handleEditColumn = (data: any) => {
    const findTsss = storedAssets.find((item) => item.assetId === data.key);
    if (!findTsss) {
      message.error("Không tìm thấy tài sản so sánh để chỉnh sửa");
      return;
    }
    if (findTsss?.approved === true) {
      message.error("Không thể chỉnh sửa tài sản đã được phê duyệt");
      return;
    } else if (findTsss?.approved === false) {
      message.error("Không thể chỉnh sửa tài sản đã từ chối");
      return;
    }
    setOpenEditModal(true);
    setSelectedTsss({
      ...findTsss,
      key: randomId(),
    });
  };
  const handleGetDataEdit = (editData: any) => {
    if (!editData) return null;
    // process data before send to server
    const newEditData = {
      ...editData,
      remainQuality: editData.remainQuality * 100,
      addressProvince: editData?.provinces?.code || editData?.addressProvince,
      addressDistrict: editData?.districts?.code || editData?.addressDistrict,
      addressWard: editData?.wards?.code || editData?.addressWard,
    };
    return newEditData;
  };

  useEffect(() => {
    if (storedAssets) {
      handleConvertData(storedAssets);
    }
  }, [JSON.stringify(storedAssets), handleConvertData]);

  useEffect(() => {
    const columnsTb: ColumnsEdit = [
      {
        title: "Nội dung",
        dataIndex: "name",
        key: "name",
        width: "100px",
        colSpan: 2,
      },
      {
        title: "lable",
        dataIndex: "lable",
        key: "lable",
        colSpan: 0,
        width: "300px",
      },
      ...storedAssets.map((_, index) => ({
        title: index === 0 ? "TSTĐ" : `TSSS ${index}`,
        dataIndex: index.toString(),
        key: _.assetId,
        width: `350px`,
      })),
      {
        title: "",
        dataIndex: "action",
        key: "action",
        width: "45px",
        fixed: "right",
      },
    ];

    setColTable(columnsTb);
    //setColSpanDefault(colSpan);
  }, [dataTable]);
  return (
    <Fragment>
      <Spin spinning={loading}>
        <TableAddCol
          columns={colTable}
          dataSource={dataTable}
          handleAddCol={handleOpenAddColModal}
          handleSubCol={handleSubCol}
          handleEditCol={handleEditColumn}
          scroll={{ x: "max-content" }}
          disabledActions={disabledActions}
        />
      </Spin>

      <Checkbox
        checked={exportToReport}
        name="exportToReport"
        onClick={() => onChangeExportToReport(!exportToReport)}
      >
        Xuất bảng so sánh vào Tờ trình
      </Checkbox>

      <AddCompareAssetModal
        isOpenModal={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        onSave={(data: any) => handleAddTSSS(data)}
        defaultSelectedTSSS={[...storedAssets]
          .slice(1)
          .map((el: any) => el.assetId)}
        createForm={CreateRoadVehicleUsingForm}
        assetType={assetType}
        assetLevelThreeId={assetLevelThreeId}
      />

      <EditTSSSModal
        isOpenModal={openEditModal}
        closeModal={() => setOpenEditModal(false)}
        onSave={(data: any) => handleEdit_TSSS(data)}
        defaultSelectedTSSS={[...storedAssets]
          .slice(1)
          .map((el: any) => el.assetId)}
        createForm={CreateRoadVehicleUsingForm}
        assetType={assetType}
        dataEdit={handleGetDataEdit(selectedTsss)}
        assetLevelThreeId={assetLevelThreeId}
      />
    </Fragment>
  );
};

export default memo(TableAssetInfoRoadVehicle);
