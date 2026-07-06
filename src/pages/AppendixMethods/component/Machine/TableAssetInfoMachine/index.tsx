import { Checkbox, Spin, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import TableAddCol from "components/TableAddCol";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { DATE_TIME_FORMAT } from "constant/enums";
import dayjs from "dayjs";
import { FC, Fragment, memo, useCallback, useEffect, useState } from "react";
import { randomId } from "utils";
import { loadSingleImage } from "utils/loadImage";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import AddCompareAssetModal from "pages/AppendixMethods/component/CreateTSSSModal/AddCompareAssetModal";
import EditTSSSModal from "pages/AppendixMethods/component/EditTSSSModal";
import CreateDeviceForm from "pages/AppendixMethods/component/Machine/TableAssetInfoMachine/Device";

type Props = {
  storedAssets: Array<any>;
  adjustTable: Array<any>;
  assetLevelTwoId: number;
  assetType: number;
  exportToReport: boolean;
  onChangeExportToReport: (data: boolean) => void;
  handleUpdateAdjustTable: (data: any) => void;
  handleUpdateStoredAssets: (data: any) => void;
  disabledActions?: boolean;
};

const TableAssetInfoMachine: FC<Props> = ({
  storedAssets,
  assetLevelTwoId,
  adjustTable,
  handleUpdateAdjustTable,
  handleUpdateStoredAssets,
  assetType,
  exportToReport,
  onChangeExportToReport,
  disabledActions,
}) => {
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

  const renderName_LabelForDataSource = useCallback((key: string) => {
    let name = "";
    let label = "";
    let typeFiled = "";
    let order = 1;

    switch (key) {
      //Thông tin tham chiếu
      case "assetCode": {
        name = "Thông tin tham chiếu";
        label = "Mã kho";
        order = 1.1;
        break;
      }

      case "dataSourceName": {
        name = "Thông tin tham chiếu";
        label = "Nguồn dữ liệu";
        order = 1.2;
        break;
      }
      case "infoSourceName": {
        name = "Thông tin tham chiếu";
        label = "Nguồn thông tin";
        order = 1.3;
        break;
      }
      case "contact": {
        name = "Thông tin tham chiếu";
        label = "Người liên hệ - SĐT";
        order = 1.4;
        break;
      }
      // case "transactionStatus": {
      //   name = "Thông tin tham chiếu";
      //   label = "Tình trạng giao dịch";
      //   break;
      // }
      case "transactionTime": {
        name = "Thông tin tham chiếu";
        label = "Thời điểm";
        order = 1.5;
        break;
      }

      //Địa chỉ
      case "addressProvinceName": {
        name = "Địa chỉ";
        label = "Tỉnh/TP";
        order = 1.6;
        break;
      }
      case "addressDistrictName": {
        name = "Địa chỉ";
        label = "Thành phố/Quận/Huyện/Thị xã";
        order = 1.7;
        break;
      }
      case "addressWardName": {
        name = "Địa chỉ";
        label = "Xã/Phường/Thị trấn";
        order = 1.8;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        label = "Mô tả chỉ tiết";
        order = 1.9;
        break;
      }

      //Chi tiết
      case "assetImage": {
        name = "Chi tiết";
        label = "Hình ảnh tài sản";
        typeFiled = "IMAGE";
        order = 2.1;
        break;
      }
      case "assetLevelThreeName": {
        name = "Chi tiết";
        label = "Phân loại tài sản";
        order = 2.15;
        break;
      }
      case "name": {
        name = "Chi tiết";
        label = "Tên MMTB";
        order = 2.2;
        break;
      }
      case "brand": {
        name = "Chi tiết";
        label = "Nhãn hiệu";
        order = 2.3;
        break;
      }
      case "model": {
        name = "Chi tiết";
        label = "Số loại/Model";
        order = 2.4;
        break;
      }
      case "engineNo": {
        name = "Chi tiết";
        label = "Số máy";
        order = 2.41;
        break;
      }
      case "yearMfg": {
        name = "Chi tiết";
        label = "Năm sản xuất";
        order = 2.5;
        break;
      }
      case "countryMfg": {
        name = "Chi tiết";
        label = "Nước sản xuất";
        order = 2.6;
        break;
      }
      case "noteLegalSBA": {
        name = "Chi tiết";
        label = "Pháp lý";
        order = 2.65;
        break;
      }
      case "manufacturer": {
        name = "Chi tiết";
        label = "Nhà sản xuất";
        order = 2.7;
        break;
      }
      case "power": {
        name = "Chi tiết";
        label = "Công suất (kW)";
        typeFiled = "CURRENCY";
        order = 18;
        break;
      }
      case "controlType": {
        name = "Chi tiết";
        label = "Chế độ điều khiển";
        order = 19;
        break;
      }
      case "size": {
        name = "Chi tiết";
        label = "Kích thước (mm)";
        typeFiled = "CURRENCY";
        order = 20;
        break;
      }
      case "specs": {
        name = "Chi tiết";
        label = "Thông số kỹ thuật";
        order = 21;
        break;
      }
      case "electricEngine": {
        name = "Chi tiết";
        label = "Động cơ điện (kW)";
        // typeFiled = "CURRENCY";
        order = 28;
        break;
      }
      case "mainEngine": {
        name = "Chi tiết";
        label = "Động cơ chính (kW)";
        // typeFiled = "CURRENCY";
        order = 29;
        break;
      }
      case "engineSystem": {
        name = "Chi tiết";
        label = "Hệ thống thiết bị điện";
        order = 30;
        break;
      }
      case "additionalContent": {
        name = "Chi tiết";
        label = "Nội dung khác";
        order = 26;
        break;
      }
      case "currentUseSituation": {
        name = "Chi tiết";
        label = "Hiện trạng sử dụng";
        order = 32;
        break;
      }
      case "numberOfDaysUsed": {
        name = "Chi tiết";
        label = "Số thời gian đã qua sử dụng (ngày)";
        typeFiled = "CURRENCY";
        order = 28;
        break;
      }
      case "remainQuality": {
        name = "Chi tiết";
        label = "Chất lượng còn lại (%)";
        typeFiled = "PERCENT";
        order = 33;
        break;
      }

      case "transactionPrice": {
        name = "Chi tiết";
        label = "Giá giao dịch/ rao bán (đồng)";
        typeFiled = "CURRENCY";
        order = 34;
        break;
      }

      case "estimatedRate": {
        name = "Chi tiết";
        label = "Tỷ lệ ước tính (%)";
        typeFiled = "PERCENT";
        order = 35;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        label = "Giá ước tính (đồng)";
        order = 44;
        typeFiled = "CURRENCY";
        break;
      }
    }

    return { name, label, typeFiled, order };
  }, []);

  console.log("data", dataTable);

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
              loadedImages.push((await loadSingleImage(image)) || "");
            }
            value[i] = loadedImages;
          }
        }

        if (key === "remainQuality") {
          for (let i = 0; i < value.length; i++) {
            const val = !isNaN(value[i]) ? Number(value[i]) : 0;
            if (val && val >= 0 && val <= 1) value[i] = val * 100;
          }
        }

        if (key === "transactionTime") {
          for (let i = 0; i < value.length; i++)
            value[i] = value[i]
              ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
              : "";
        }

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
  }, [storedAssets, handleConvertData]);
  useEffect(() => {
    const columnsTb: ColumnsEdit = [
      {
        title: "Nội dung",
        dataIndex: "name",
        key: "name",
        colSpan: 2,
        width: "100px",
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
        createForm={CreateDeviceForm}
        assetType={assetType}
      />

      <EditTSSSModal
        isOpenModal={openEditModal}
        closeModal={() => setOpenEditModal(false)}
        onSave={(data: any) => handleEdit_TSSS(data)}
        defaultSelectedTSSS={[...storedAssets]
          .slice(1)
          .map((el: any) => el.assetId)}
        createForm={CreateDeviceForm}
        assetType={assetType}
        dataEdit={handleGetDataEdit(selectedTsss)}
      />
    </Fragment>
  );
};

export default memo(TableAssetInfoMachine);
