import { FC, Fragment, useEffect, useState } from "react";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import TableAddCol from "../TableAddCol";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "constant/enums";
// import AddCompareAssetModal from "./component/AddCompareAssetModal";
// import {appraisalFilesApi} from "apis/appraisalFiles";

type Props = {
  storedAssets: Array<any>;
  adjustTable: Array<any>;
  assetLevelTwoId?: number;
  handleUpdateAdjustTable: (data: any) => void;
  handleUpdateStoredAssets: (data: any) => void;
};

const TableAssetInfo: FC<Props> = ({
  storedAssets,
  assetLevelTwoId,
  adjustTable,
  handleUpdateAdjustTable,
  handleUpdateStoredAssets,
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [colTable, setColTable] = useState<ColumnsEdit>([]);

  // const handleAddTSSS = async (storedAssetIds: any[]) => {
  //   try {
  //     const firstAdjust = adjustTable.shift();
  //     const param = {
  //       assetIds: storedAssetIds,
  //       adjustCriteriaIds: firstAdjust.adjustTable.map(
  //         (el: any) => el.adjustCriteriaId
  //       ),
  //     };
  //     const res: any = await appraisalFilesApi.getStoredAssets(
  //       assetLevelTwoId,
  //       param
  //     );

  //     const tmpAdjustTable = [...adjustTable];

  //     res.data?.adjustTable.forEach((el: any) => {
  //       const foundIndex = tmpAdjustTable.findIndex(
  //         item => item.storedAssetId === el.storedAssetId
  //       );

  //       if (foundIndex === -1) tmpAdjustTable.push(el);
  //     });

  //     const tmpStoredAssets = [...storedAssets];
  //     handleUpdateAdjustTable([firstAdjust, ...tmpAdjustTable]);
  //     handleUpdateStoredAssets([
  //       tmpStoredAssets.shift(),
  //       ...res.data?.storeAsset,
  //     ]);
  //   } catch (error: any) {
  //     console.log(error);
  //   }
  // };

  // const handleSubCol = (data: any) => {
  //   const tmpStoredAssets = [...storedAssets].filter(
  //     el => el.assetId !== data.key
  //   );

  //   const tmpAdjustTable = [...adjustTable].filter(
  //     el => el.storedAssetId !== data.key
  //   );

  //   handleUpdateStoredAssets(tmpStoredAssets);
  //   handleUpdateAdjustTable(tmpAdjustTable);
  // };

  const handleOpenAddColModal = () => {
    setIsOpenModal(true);
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
      ...storedAssets.map((_, index) => ({
        title: `TSSS ${index + 1}`,
        dataIndex: index.toString(),
        key: _.assetId,
      })),
      // {
      //   title: "",
      //   dataIndex: "action",
      //   key: "action",
      // },
    ];

    setColTable(columnsTb);
    //setColSpanDefault(colSpan);
  }, [storedAssets]);

  const renderName_LabelForDataSource = (key: string) => {
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
      case "appraisalTime": {
        name = "Thông tin tham chiếu";
        label = "Thời điểm";
        break;
      }

      //Địa chỉ
      case "addressProvince": {
        name = "Địa chỉ";
        label = "Tỉnh/TP";
        order = 2;
        break;
      }
      case "addressDistrict": {
        name = "Địa chỉ";
        label = "Quận/Huyện/TP/Thị xã";
        order = 2;
        break;
      }
      case "addressWard": {
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
      case "positionName": {
        name = "Địa chỉ";
        label = "Vị trí";
        order = 2;
        break;
      }
      case "mapSheetNumber": {
        name = "Địa chỉ";
        label = "Số tờ";
        order = 2;
        break;
      }
      case "landPlotNumber": {
        name = "Địa chỉ";
        label = "Số thửa";
        order = 2;
        break;
      }
      case "addressDetail": {
        name = "Địa chỉ";
        label = "Chi tiết";
        order = 2;
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
        order = 2;
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
      case "areaWidth": {
        name = "Chi tiết";
        label = "Diện tích khuôn viên (m²)";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "areaInplan": {
        name = "Chi tiết";
        label = "Diện tích phù hợp quy hoạch (m²)";
        typeFiled = "CURRENCY";
        order = 3;
        break;
      }
      case "areaUnplan": {
        name = "Chi tiết";
        label = "Diện tích không phù hợp quy hoạch (m²)";
        typeFiled = "CURRENCY";
        order = 3;
        break;
      }
      case "facadeLength": {
        name = "Chi tiết";
        label = "Kích thước mặt tiền (m)";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "numberOfFacade": {
        name = "Chi tiết";
        label = "Số mặt tiền tiếp giáp";
        typeFiled = "CURRENCY";
        order = 3;
        break;
      }
      case "shape": {
        name = "Chi tiết";
        label = "Hình dạng";
        order = 3;
        break;
      }
      case "widthToMainRoad": {
        name = "Chi tiết";
        label = "Độ rộng đường/hẻm chính/hẻm phụ (m)";
        typeFiled = "CURRENCY";
        order = 3;
        break;
      }
      case "distanceToMainRoad": {
        name = "Chi tiết";
        label = "Khoảng cách tới trục đường chính (m)";
        typeFiled = "CURRENCY";
        order = 3;
        break;
      }
      case "businessAdvantage": {
        name = "Chi tiết";
        label = "Lợi thế kinh doanh";
        order = 3;
        break;
      }
      case "usingPurposeName": {
        name = "Chi tiết";
        label = "Mục đích sử dụng đất";
        order = 3;
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        label = "Giá rao bán (đồng)";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "transactionPrice": {
        name = "Chi tiết";
        label = "Giá thương lượng (đồng)";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "totalFloorArea": {
        name = "Chi tiết";
        label = "Tổng diện tích sàn XD (m²)";
        typeFiled = "CURRENCY";
        order = 3;
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
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "remainQuality": {
        name = "Chi tiết";
        label = "CLCL (%)";
        typeFiled = "PERCENT";
        order = 3;
        break;
      }
      case "constructionPrice": {
        name = "Chi tiết";
        label = "Giá trị CTXD (đồng)";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "landUnitPrice": {
        name = "Chi tiết";
        label = "Đơn giá đất (đồng/m²)";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "priceInPlan": {
        name = "Chi tiết";
        label = "Đơn giá phù hợp quy hoạch (đồng/m²)";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "optimizePrice": {
        name = "Chi tiết";
        label = "Đơn giá đất điều chỉnh (đồng/m²)";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
    }

    return { name, label, typeFiled, order };
  };

  const handleConvertData = (data: Array<any>): any[] => {
    if (!data) return [];
    let dataSource = [];

    const dataConverted = transformRowSchemaToColumnSchema(data, false);

    for (const key in dataConverted) {
      const renderName_Label = renderName_LabelForDataSource(key);

      const value = dataConverted[key];

      if (key === "appraisalTime") {
        for (let i = 0; i < value.length; i++) {
          value[i] = dayjs(value[i]).isValid()
            ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
            : null;
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
    return dataSource.sort((a, b) => a.order - b.order);
  };

  return (
    <Fragment>
      <TableAddCol
        columns={colTable}
        dataSource={handleConvertData(storedAssets)}
        handleAddCol={handleOpenAddColModal}
        // handleSubCol={handleSubCol}
      />
      {/* <AddCompareAssetModal
        isOpenModal={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        onSave={(data: any) => handleAddTSSS(data)}
        defaultSelectedTSSS={[...storedAssets]
          .slice(1)
          .map((el: any) => el.assetId)}
      /> */}
    </Fragment>
  );
};

export default TableAssetInfo;
