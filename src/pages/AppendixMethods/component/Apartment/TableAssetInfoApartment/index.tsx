import { FC, Fragment, useEffect, useState, memo, useCallback } from "react";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import TableAddCol from "components/TableAddCol";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "constant/enums";
import AddCompareAssetModal from "pages/AppendixMethods/component/CreateTSSSModal/AddCompareAssetModal";
import { appraisalFilesApi } from "apis/appraisalFiles";
import FormCreateApartment from "pages/AppendixMethods/component/Apartment/FormCreateApartment";
import { Checkbox, message, Spin } from "antd";
import EditTSSSModal from "../../EditTSSSModal";
import { loadSingleImage } from "utils/loadImage";
import { BUSINESS_ADVANTAGE_OPTIONS } from "constant/common";
import { useDispatch } from "react-redux";
import { createInitDistanceToAssets } from "pages/AppendixMethods/store/appendixMethodsSlice";
import { genUtilitiesApartment } from "utils/string";

type Props = {
  storedAssets: Array<any>;
  adjustTable: Array<any>;
  assetLevelTwoId: number;
  assetType: number;
  exportToReport: boolean;
  onChangeExportToReport: (data: boolean) => void;
  handleUpdateAdjustTable: (data: any) => void;
  handleUpdateStoredAssets: (data: any) => void;
  handleSaveInBackground: (data: any) => Promise<void>;
  disabledActions?: boolean;
};

const TableAssetInfoApartment: FC<Props> = ({
  storedAssets,
  assetLevelTwoId,
  adjustTable,
  handleUpdateAdjustTable,
  handleUpdateStoredAssets,
  assetType,
  exportToReport,
  onChangeExportToReport,
  handleSaveInBackground,
  disabledActions,
}) => {
  const dispatch = useDispatch();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedTsss, setSelectedTsss] = useState<any>();

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [colTable, setColTable] = useState<ColumnsEdit>([]);

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

  const renderName_LabelForDataSource = useCallback((key: string) => {
    let name = "";
    let label = "";
    let typeFiled = "";
    let order = 1;

    switch (key) {
      //Thông tin tham chiếu
      case "assetCode": {
        name = "Thông tin tham chiếu";
        label = "Mã tài sản kho giá";
        break;
      }
      case "dataSourceName": {
        name = "Thông tin tham chiếu";
        label = "Nguồn dữ liệu";
        break;
      }
      case "infoSourceName": {
        name = "Thông tin tham chiếu";
        label = "Nguồn thông tin";
        break;
      }
      case "contact": {
        name = "Thông tin tham chiếu";
        label = "Người liên hệ - SĐT";
        break;
      }
      case "transactionStatus": {
        name = "Thông tin tham chiếu";
        label = "Tình trạng giao dịch";
        break;
      }
      case "transactionTime": {
        name = "Thông tin tham chiếu";
        label = "Thời điểm";
        break;
      }

      //Địa chỉ
      case "addressProvinceName": {
        name = "Địa chỉ";
        label = "Tỉnh/TP";
        order = 2;
        break;
      }
      case "addressDistrictName": {
        name = "Địa chỉ";
        label = "Quận/Huyện/TP/Thị xã";
        order = 2;
        break;
      }
      case "addressWardName": {
        name = "Địa chỉ";
        label = "Xã/Phường/Thị trấn";
        order = 2;
        break;
      }
      case "addressStreet": {
        name = "Địa chỉ";
        label = "Đường phố";
        order = 2;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        label = "Địa chỉ Chi tiết";
        order = 2.1;
        break;
      }
      case "legal": {
        name = "Địa chỉ";
        label = "Pháp lý";
        order = 2.2;
        break;
      }
      case "description": {
        name = "Địa chỉ";
        label = "Mô tả chi tiết vị trí";
        order = 2.3;
        break;
      }
      case "positionName": {
        name = "Địa chỉ";
        label = "Vị trí";
        order = 2.4;
        break;
      }
      case "distanceToAsset": {
        name = "Địa chỉ";
        label = "Khoảng cách tới TSTĐ";
        order = 2.5;
        typeFiled = "INPUT_DISTANCE";
        break;
      }
      case "mapSheetNumber": {
        name = "Địa chỉ";
        label = "Số tờ";
        order = 2.6;
        break;
      }
      case "landPlotNumber": {
        name = "Địa chỉ";
        label = "Số thửa";
        order = 2.7;
        break;
      }
      case "coordinate": {
        name = "Địa chỉ";
        label = "Định vị";
        typeFiled = "LOCAL";
        order = 2.8;
        break;
      }

      //Chi tiết
      case "assetImage": {
        name = "Chi tiết";
        label = "Hình ảnh tài sản";
        typeFiled = "IMAGE";
        order = 3;
        break;
      }
      case "projectName": {
        name = "Chi tiết";
        label = "Tên chung cư/Dự án";
        order = 3;
        break;
      }
      case "building": {
        name = "Chi tiết";
        label = "Tòa nhà thực tế";
        order = 3;
        break;
      }
      case "apartmentCode": {
        name = "Chi tiết";
        label = "Mã căn hộ";
        order = 3;
        break;
      }
      case "floorNo": {
        name = "Chi tiết";
        label = "Tầng số";
        order = 3;
        break;
      }
      case "surfaces": {
        name = "Chi tiết";
        label = "Số mặt thoáng căn hộ";
        order = 3.1;
        break;
      }
      case "furniture": {
        name = "Chi tiết";
        label = "Nội thất";
        order = 3.2;
        break;
      }
      case "utilities": {
        name = "Chi tiết";
        label = "Tiện ích";
        order = 3.2;
        break;
      }
      case "otherFactor": {
        name = "Chi tiết";
        label = "Yếu tố khác";
        order = 3.3;
        break;
      }
      case "businessAdvantage": {
        name = "Chi tiết";
        label = "Lợi thế kinh doanh";
        order = 3.4;
        break;
      }
      // case "totalFloorArea": {
      //   name = "Chi tiết";
      //   label = "Diện tích theo hồ sơ pháp lý (m²)";
      //   order = 3;
      //   break;
      // }
      case "privateUseArea": {
        name = "Chi tiết";
        label = "Diện tích sử dụng riêng (m²)";
        typeFiled = "CURRENCY";
        order = 5;
        break;
      }
      case "clearanceArea": {
        name = "Chi tiết";
        label = "Diện tích thông thủy (m²)";
        typeFiled = "CURRENCY";
        order = 6;
        break;
      }
      case "buildupArea": {
        name = "Chi tiết";
        label = "Diện tích tim tường (m²)";
        typeFiled = "CURRENCY";
        order = 7;
        break;
      }
      case "extendArea": {
        name = "Chi tiết";
        label = "Diện tích cơi nới (m²)";
        typeFiled = "CURRENCY";
        order = 8;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        label = "Giá rao bán (đồng)";
        order = 9;
        typeFiled = "CURRENCY";
        break;
      }
      case "transactionPrice": {
        name = "Chi tiết";
        label = "Giá thương lượng (đồng)";
        order = 10;
        typeFiled = "CURRENCY";
        break;
      }
      case "unitPrice": {
        name = "Chi tiết";
        label = "Đơn giá ước tính QSH căn hộ (đồng/m²)";
        order = 11;
        typeFiled = "CURRENCY";
        break;
      }
    }

    return { name, label, typeFiled, order };
  }, []);

  const handleConvertData = useCallback(
    async (data: Array<any>) => {
      setLoading(true);
      if (!data) return [];
      let dataSource = [];
      const dataConverted = transformRowSchemaToColumnSchema(data, false);
      for (const key in dataConverted) {
        const renderName_Label = renderName_LabelForDataSource(key);
        const value = dataConverted[key];

        if (key === "transactionTime") {
          for (let i = 0; i < value.length; i++)
            value[i] = value[i]
              ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
              : "";
        }

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

        if (key === "utilities") {
          for (let i = 0; i < value.length; i++) {
            value[i] = value[i] ? genUtilitiesApartment(value[i]) : null;
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
      setLoading(false);
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
    setSelectedTsss(findTsss);
  };
  const handleGetDataEdit = (editData: any) => {
    // process data before send to server

    if (!editData) return null;
    const newEditData = {
      ...editData,
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
    };
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
        createForm={FormCreateApartment}
        assetType={assetType}
      />
      <EditTSSSModal
        isOpenModal={openEditModal}
        closeModal={() => setOpenEditModal(false)}
        onSave={(data: any) => handleEdit_TSSS(data)}
        defaultSelectedTSSS={[...storedAssets]
          .slice(1)
          .map((el: any) => el.assetId)}
        createForm={FormCreateApartment}
        assetType={assetType}
        dataEdit={handleGetDataEdit(selectedTsss)}
      />
    </Fragment>
  );
};

export default memo(TableAssetInfoApartment);
