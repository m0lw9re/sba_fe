import { FC, Fragment, useEffect, useState } from "react";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import TableAddCol from "../TableAddCol";
import { transformRowSchemaToColumnSchema } from "utils/validate";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT, UTILITIES_APARTMENT } from "constant/enums";
import { genUtilitiesApartment } from "utils/string";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        fixed: "left",
        width: "100px",
      },
      {
        title: "lable",
        dataIndex: "lable",
        key: "lable",
        colSpan: 0,
        fixed: "left",
        width: "150px",
      },
      ...storedAssets.map((_, index) => ({
        title: `TSSS ${index + 1}`,
        dataIndex: index.toString(),
        key: _.assetId,
        width: "300px",
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
      case "transactionTime": {
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
      case "projectName": {
        name = "Chi tiết";
        label = "Tên chung cư / dự án";
        order = 3;
        break;
      }
      case "buildingName": {
        name = "Chi tiết";
        label = "Tòa nhà thực tế";
        order = 3;
        break;
      }
      case "blockName": {
        name = "Chi tiết";
        label = "Block";
        order = 3;
        break;
      }
      case "apartmentCode": {
        name = "Chi tiết";
        label = "Mã căn hộ";
        order = 3;
        break;
      }
      case "numberApartment": {
        name = "Chi tiết";
        label = "Số căn hộ";
        order = 3;
        break;
      }
      case "floorNo": {
        name = "Chi tiết";
        label = "Tầng số";
        order = 3;
        break;
      }
      case "totalFloor": {
        name = "Chi tiết";
        label = "Số tầng toà nhà";
        order = 3;
        break;
      }
      case "surfaces": {
        name = "Chi tiết";
        label = "Số mặt thoáng căn hộ";
        order = 3;
        break;
      }
      case "furniture": {
        name = "Chi tiết";
        label = "Nội thất";
        order = 3;
        break;
      }
      case "utilities": {
        name = "Chi tiết";
        label = "Tiện ích";
        order = 3;
        break;
      }
      case "bedrooms": {
        name = "Chi tiết";
        label = "Số phòng ngủ";
        order = 3;
        break;
      }
      case "kitchens": {
        name = "Chi tiết";
        label = "Số phòng bếp";
        order = 3;
        break;
      }
      case "toilets": {
        name = "Chi tiết";
        label = "Số nhà WC";
        order = 3;
        break;
      }
      case "otherFactor": {
        name = "Chi tiết";
        label = "Yếu tố khác";
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
        label = "Mục đích sử dụng";
        order = 3;
        typeFiled = "CURRENCY";
        break;
      }
      case "privateUseArea": {
        name = "Chi tiết";
        label = "Diện tích sử dụng riêng (m²)";
        order = 4;
        break;
      }
      case "clearanceArea": {
        name = "Chi tiết";
        label = "Diện tích thông thủy (m²)";
        order = 4;
        typeFiled = "CURRENCY";
        break;
      }
      case "buildupArea": {
        name = "Chi tiết";
        label = "Diện tích tim tường (m²)";
        order = 4;
        break;
      }
      case "extendArea": {
        name = "Chi tiết";
        label = "Diện tích cơi nới (m²)";
        order = 4;
        typeFiled = "CURRENCY";
        break;
      }
      case "estimatePrice": {
        name = "Chi tiết";
        label = "Giá rao bán (đồng)";
        order = 5;
        typeFiled = "CURRENCY";
        break;
      }
      case "transactionPrice": {
        name = "Chi tiết";
        label = "Giá thương lượng (đồng)";
        order = 5;
        typeFiled = "CURRENCY";
        break;
      }
      case "unitPrice": {
        name = "Chi tiết";
        label = "Đơn giá ước tính QSH căn hộ (đồng/m²)";
        order = 5;
        typeFiled = "CURRENCY";
        break;
      }
      case "optimizePrice": {
        name = "Chi tiết";
        label = "Đơn giá sau khi đã tính hệ số điều chỉnh (đồng/m²)";
        order = 6;
        typeFiled = "CURRENCY";
        break;
      }
      case "adjustPrice": {
        name = "Chi tiết";
        label = "Giá trị tài sản sau khi đã điều chỉnh hệ số (đồng)";
        order = 6;
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

      // if (key === "transactionTime") {
      //   for (let i = 0; i < value.length; i++)
      //     value[i] = dayjs(value[i]).format(DATE_TIME_FORMAT.day);
      // } else if (key === "utilities") {
      //   for (let i = 0; i < value.length; i++) {
      //     if (value[i] && value[i].includes(",")) {
      //       let label = [];
      //       const values = value[i].split(",");
      //       for (let index = 0; index < values.length; index++) {
      //         label.push(getLabelUtilitiesApartment(values[index]));
      //       }
      //       value[i] = label.join(", ");
      //     } else if (value[i]) value[i] = getLabelUtilitiesApartment(value[i]);
      //   }
      // }

      if (key === "transactionTime") {
        for (let i = 0; i < value.length; i++) {
          value[i] = dayjs(value[i]).isValid()
            ? dayjs(value[i]).format(DATE_TIME_FORMAT.day)
            : null;
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
