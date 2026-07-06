import { FC } from "react";
import { TableKQDatType } from "constant/types/appraisalFile";
import Table, { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import "./style.scss";

const { INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  tableKQDat: Array<TableKQDatType>;
};

export const Result: FC<Props> = ({ tableKQDat }) => {
  const columns: ColumnsType<TableKQDatType> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "stt",
      width: "5%",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      key: 2,
      title: "Tên tài sản",
      dataIndex: "name",
    },
    {
      key: 7,
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
      key: 8,
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
        columns={columns}
        dataSource={tableKQDat}
        pagination={false}
      />
    </div>
  );
};
