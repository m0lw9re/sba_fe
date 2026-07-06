import { FC } from "react";
import { TableKQType } from "constant/types/appraisalFile";
import Table, { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import { ASSET_LV3, TYPE_FIELD } from "constant/enums";
import "./style.scss";

const { INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  tableKQ: Array<TableKQType>;
  assetLevelThreeId: number;
};

export const Result: FC<Props> = ({ tableKQ, assetLevelThreeId }) => {
  const columns: ColumnsType<TableKQType> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "stt",
      width: "5%",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    assetLevelThreeId === ASSET_LV3.PRODUCTION_LINE
      ? {
          key: 6,
          title: "Dây chuyền",
          dataIndex: "productLineName",
        }
      : {},
    {
      key: 2,
      title: "Tên tài sản",
      dataIndex: "name",
    },
    {
      key: 3,
      title: "Số lượng MMTB",
      dataIndex: "realCommonMachine",
      render: (realCommonMachine) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          currencable
          isRounded
          value={realCommonMachine}
          disable={true}
        />
      ),
    },
    {
      key: 4,
      title: "Đơn giá (đồng)",
      dataIndex: "unitPriceApprovaled",
      render: (unitPriceApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          currencable
          isRounded
          value={unitPriceApprovaled}
          disable={true}
        />
      ),
    },
    {
      key: 5,
      title: "Giá trị (đồng)",
      dataIndex: "totalValueApprovaled",
      render: (totalValueApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          currencable
          isRounded
          value={totalValueApprovaled}
          disable={true}
        />
      ),
    },
  ];

  return (
    <div>
      <Table
        className="table-result-wrapper"
        size="small"
        bordered
        columns={columns.filter((item) => item.key)}
        dataSource={tableKQ}
        pagination={false}
      />
    </div>
  );
};
