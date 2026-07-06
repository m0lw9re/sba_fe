import { Checkbox, Spin, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import TableAddCol from "components/TableAddCol";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { DATE_TIME_FORMAT } from "constant/enums";
import dayjs from "dayjs";
import { FC, Fragment, memo, useCallback, useEffect, useState } from "react";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import AddCompareAssetModal from "../../CreateTSSSModal/AddCompareAssetModal";
import EditTSSSModal from "../../EditTSSSModal";
import CreateLandUsingForm from "./component/CreateFormByAsset/LandUsing";
import { BUSINESS_ADVANTAGE_OPTIONS } from "constant/common";
import { randomId } from "utils";
import { loadSingleImage } from "utils/loadImage";
import { useDispatch } from "react-redux";
import { createInitDistanceToAssets } from "pages/AppendixMethods/store/appendixMethodsSlice";

type Props = {
  storedAssets: Array<any>;
  adjustTable: Array<any>;
  assetLevelTwoId: number;
  assetType: number;
  exportToReport: boolean;
  onChangeExportToReport: (data: boolean) => void;
  handleUpdateAdjustTable: (data: any) => void;
  handleUpdateStoredAssets: (data: any) => void;
  handleSaveInBackground: (data: any) => void;
  isPPTN?: boolean;
  disabledActions?: boolean;
};

const TableAssetInfoLand: FC<Props> = ({
  storedAssets,
  assetLevelTwoId,
  adjustTable,
  handleUpdateAdjustTable,
  handleUpdateStoredAssets,
  assetType,
  exportToReport,
  onChangeExportToReport,
  isPPTN,
  handleSaveInBackground,
  disabledActions,
}) => {
  const dispatch = useDispatch();

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
      handleSaveInBackground({
        adjustTable: [firstAdjust, ...tmpAdjustTable],
        storedAssets: [...tmpStoredAssets],
      });
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
      let label = "";
      let typeFiled = "";
      let order = 1;

      switch (key) {
        //Thông tin tham chiếu
        case "assetCode": {
          name = "Thông tin tham chiếu";
          label = "Mã tài sản kho giá";
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
        case "transactionStatus": {
          name = "Thông tin tham chiếu";
          label = "Tình trạng giao dịch";
          order = 5;
          break;
        }
        case "transactionTime": {
          name = "Thông tin tham chiếu";
          label = "Thời điểm";
          order = 6;
          break;
        }

        //Địa chỉ
        case "addressProvince": {
          name = "Địa chỉ";
          label = "Tỉnh/TP";
          order = 7;
          break;
        }
        case "addressDistrict": {
          name = "Địa chỉ";
          label = "Quận/Huyện/TP/Thị xã";
          order = 8;
          break;
        }
        case "addressWard": {
          name = "Địa chỉ";
          label = "Xã/Phường/Thị trấn";
          order = 9;
          break;
        }
        case "addressStreet": {
          name = "Địa chỉ";
          label = "Đường phố";
          order = 10;
          break;
        }
        case "positionName": {
          name = "Địa chỉ";
          label = "Vị trí";
          order = 11;
          break;
        }
        case "mapSheetNumber": {
          name = "Địa chỉ";
          label = "Số tờ";
          order = 12;
          break;
        }
        case "landPlotNumber": {
          name = "Địa chỉ";
          label = "Số thửa";
          order = 13;
          break;
        }
        case "addressDetail": {
          name = "Địa chỉ";
          label = "Địa chỉ chi tiết";
          order = 14;
          break;
        }
        case "geographicDescription": {
          name = "Địa chỉ";
          label = "Vị trí tiếp giáp";
          order = 15;
          break;
        }
        case "distanceToAsset": {
          name = "Địa chỉ";
          label = "Khoảng cách tới TSTĐ (m)";
          order = 15.5;
          typeFiled = "INPUT_DISTANCE";
          break;
        }
        case "legal": {
          name = "Địa chỉ";
          label = "Pháp lý";
          order = 16;
          break;
        }
        case "coordinate": {
          name = "Địa chỉ";
          label = "Định vị";
          typeFiled = "LOCAL";
          order = 17;
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
        case "projectName": {
          name = "Chi tiết";
          label = "Tên dự án/Khu công nghiệp";
          order = 18.5;
          break;
        }
        case "areaWidth": {
          name = "Chi tiết";
          label = "Diện tích khuôn viên (m²)";
          order = 19;
          typeFiled = "CURRENCY";
          break;
        }
        case "areaInplan": {
          name = "Chi tiết";
          label = "Diện tích phù hợp quy hoạch (m²)";
          typeFiled = "CURRENCY";
          order = 20;
          break;
        }
        case "areaUnplan": {
          name = "Chi tiết";
          label = "Diện tích không phù hợp quy hoạch (m²)";
          typeFiled = "CURRENCY";
          order = 21;
          break;
        }
        case "facadeLength": {
          name = "Chi tiết";
          label = "Kích thước mặt tiền (m)";
          typeFiled = "CURRENCY";
          order = 22;
          break;
        }
        case "landLength": {
          name = "Chi tiết";
          label = "Kích thước chiều dài (m)";
          typeFiled = "CURRENCY";
          order = 23;
          break;
        }
        case "landLengthDetail": {
          name = "Chi tiết";
          label = "Chi tiết kích thước";
          order = 23.5;
          break;
        }
        case "numberOfFacade": {
          name = "Chi tiết";
          label = "Số mặt tiền tiếp giáp";
          typeFiled = "CURRENCY";
          order = 24;
          break;
        }
        case "shape": {
          name = "Chi tiết";
          label = "Hình dạng";
          order = 25;
          break;
        }
        case "widthToMainRoad": {
          name = "Chi tiết";
          label = "Độ rộng đường/hẻm chính/hẻm phụ (m)";
          typeFiled = "CURRENCY";
          order = 26;
          break;
        }
        case "distanceToMainRoad": {
          name = "Chi tiết";
          label = "Khoảng cách tới trục đường chính (m)";
          typeFiled = "CURRENCY";
          order = 27;
          break;
        }
        case "businessAdvantage": {
          name = "Chi tiết";
          label = "Lợi thế kinh doanh";
          order = 28;
          break;
        }
        case "usingPurposeName": {
          name = "Chi tiết";
          label = "Mục đích sử dụng đất";
          order = 29;
          break;
        }
        case "planning": {
          name = "Chi tiết";
          label = "Quy hoạch";
          order = 29.5;
          break;
        }
        case "combineUsingPurposeConsolidationDetail": {
          name = "Chi tiết";
          label = "Chi tiết diện tích đất hỗn hợp";
          order = 30;
          break;
        }
        case "usingPeriod": {
          name = "Chi tiết";
          label = "Thời hạn sử dụng đất";
          order = 30.1;
          break;
        }
        case "estimatePrice": {
          name = "Chi tiết";
          label = "Giá rao bán (đồng)";
          order = 31;
          typeFiled = "CURRENCY";
          break;
        }
        case "transactionPrice": {
          name = "Chi tiết";
          label = "Giá thương lượng (đồng)";
          order = 32;
          typeFiled = "CURRENCY";
          break;
        }
        case "totalFloorArea": {
          name = "Chi tiết";
          label = "Tổng diện tích sàn XD (m²)";
          typeFiled = "CURRENCY";
          order = 33;
          break;
        }
        case "structure": {
          name = "Chi tiết";
          label = "Cấu trúc";
          order = 34;
          break;
        }
        case "constructionUnitPrice": {
          name = "Chi tiết";
          label = "Đơn giá XD (đồng/m²)";
          order = 35;
          typeFiled = "CURRENCY";
          break;
        }
        case "remainQuality": {
          name = "Chi tiết";
          label = "CLCL (%)";
          typeFiled = "PERCENT";
          order = 36;
          break;
        }
        case "constructionPrice": {
          name = "Chi tiết";
          label = "Giá trị CTXD (đồng)";
          order = 37;
          typeFiled = "CURRENCY";
          break;
        }
        case "landUnitPrice": {
          if (isPPTN) {
            return {};
          } else {
            name = "Chi tiết";
            label = "Đơn giá đất (đồng/m²)";
            order = 38;
            typeFiled = "CURRENCY";
            break;
          }
        }
        case "percent": {
          name = "Chi tiết";
          label = "Tỷ lệ phần trăm (%)";
          typeFiled = "PERCENT";
          order = 38.1;
          break;
        }
        case "lGPrice": {
          name = "Chi tiết";
          label = "Giá trị LG bằng % giá TT";
          typeFiled = "CURRENCY";
          order = 38.2;
          break;
        }
        case "lGUnitPrice": {
          name = "Chi tiết";
          label = "Đơn giá trừ LG (đồng/m²)";
          typeFiled = "CURRENCY";
          order = 38.3;
          break;
        }
        case "priceInPlan": {
          if (isPPTN) {
            return {};
          } else {
            name = "Chi tiết";
            label = "Đơn giá PHQH (đồng/m²)";
            typeFiled = "CURRENCY";
            order = 39;

            break;
          }
        }
        case "rentMonthPrice": {
          if (isPPTN) {
            name = "Chi tiết";
            label = "Giá cho thuê (đồng/tháng)";
            typeFiled = "CURRENCY";
            order = 40;
            break;
          } else {
            return {};
          }
        }
        case "rentYearPrice": {
          if (isPPTN) {
            name = "Chi tiết";
            label = "Giá cho thuê (đồng/năm)";
            typeFiled = "CURRENCY";
            order = 41;
            break;
          } else {
            return {};
          }
        }
        case "estimateRentYearPrice": {
          if (isPPTN) {
            name = "Chi tiết";
            label = "Giá ước tính cho thuê (đồng/năm)";
            typeFiled = "CURRENCY";
            order = 42;
            break;
          } else {
            return {};
          }
        }
        case "rentYearUnitPrice": {
          if (isPPTN) {
            name = "Chi tiết";
            label = "Đơn giá cho thuê (đồng/năm)";
            typeFiled = "CURRENCY";
            order = 43;
            break;
          } else {
            return {};
          }
        }
      }

      return { name, label, typeFiled, order };
    },
    [isPPTN]
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
            if (val && val >= 0 && val <= 1) value[i] = val * 100;
          }
        }

        if (key === "transactionTime") {
          for (let i = 0; i < value.length; i++)
            value[i] = value[i]
              ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
              : "";
        }

        if (key === "coordinate") {
          for (let i = 0; i < value.length; i++) {
            if (!value[i]) {
              value[i] = {
                latitude: dataConverted?.latitude[i] || null,
                longitude: dataConverted?.longitude[i] || null,
              };
            }
          }
        }

        if (key === "businessAdvantage") {
          for (let i = 0; i < value.length; i++) {
            if (!isNaN(Number(value[i]))) {
              const foundObj = BUSINESS_ADVANTAGE_OPTIONS.find(
                (el) => el.value.toString() === value[i]
              );
              if (foundObj) {
                value[i] = foundObj.label;
              }
            }
          }
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
    // process data before send to server
    if (!editData) return null;
    const newEditData = {
      ...editData,
      dataSourceId: editData.dataSourceId,
      infoSourceId: editData.infoSourceId,
      addressProvince:
        editData?.provinces?.code ||
        editData?.addressProvince ||
        editData.provinceId,
      addressWard:
        editData?.wards?.code || editData?.addressWard || editData.wardId,
      addressDistrict:
        editData?.districts?.code ||
        editData?.addressDistrict ||
        editData.districtId,
      addressProvinceName:
        editData.addressProvinceName || editData.addressProvince,
      addressDistrictName:
        editData.addressDistrictName || editData.addressDistrict,
      addressWardName: editData.addressWardName || editData.addressWard,
      remainQuality: editData.remainQuality * 100,
      usingPurposeConsolidationIds: editData?.usingPurposeConsolidationIds
        ? editData?.usingPurposeConsolidationIds
            ?.split(",")
            .map((id: string) => Number(id))
        : [],
    };
    delete newEditData.usingPurposeName;
    delete newEditData.positionName;
    return newEditData;
  };

  useEffect(() => {
    if (storedAssets) {
      const clone = [...storedAssets];
      // delete clone[0].distanceToAsset;
      handleConvertData(clone);

      dispatch(
        createInitDistanceToAssets(
          storedAssets.map((item) => ({
            assetsId: item.assetId,
            distance: item.distanceToAsset,
          }))
        )
      );
    }
  }, [storedAssets, handleConvertData, dispatch]);

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
        createForm={CreateLandUsingForm}
        assetType={assetType}
      />

      <EditTSSSModal
        isOpenModal={openEditModal}
        closeModal={() => setOpenEditModal(false)}
        onSave={(data: any) => handleEdit_TSSS(data)}
        defaultSelectedTSSS={[...storedAssets]
          .slice(1)
          .map((el: any) => el.assetId)}
        createForm={CreateLandUsingForm}
        assetType={assetType}
        dataEdit={handleGetDataEdit(selectedTsss)}
      />
    </Fragment>
  );
};

export default memo(TableAssetInfoLand);
