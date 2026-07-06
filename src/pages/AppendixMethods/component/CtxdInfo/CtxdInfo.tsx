import { Form, Space, Table } from "antd";
import { FC } from "react";
import { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";

type Props = {
  constructions: Array<any>;
  updatePrice: (key: string, price: number) => void;
  fileStatus: number;
};

const CtxdInfo: FC<Props> = ({ constructions, updatePrice, fileStatus }) => {
  const isUsedApprovaledValue = fileStatus > 14 && fileStatus !== 17;

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "Mã",
      dataIndex: "constructionId",
      width: "3%",
      align: "center",
    },
    {
      key: 2,
      title: "Loại công trình xây dựng",
      render: (_, record) => record.constructionType?.constructionTypeName,
    },
    {
      key: 3,
      title: "Mô tả đặc tính kỹ thuật",
      render: (_, record) => record.constructionName?.constructionName,
    },
    {
      key: 4,
      title: "Diện tích sử dụng (m²)",
      dataIndex: "constructionArea",
      align: "right",
      render: (_, record) =>
        numberUtils.formatNumber(
          isUsedApprovaledValue && record.constructionAreaApprovaled
            ? record.constructionAreaApprovaled
            : record.constructionArea
        ),
    },
    {
      key: 5,
      title: "Đơn giá(đồng/m² hoặc đồng/m³)",
      dataIndex: "unitPrice",
      align: "center",
      render: (_, record) => {
        // let error = "";
        const min = record.constructionName?.lowPrice;
        const max = record.constructionName?.highPrice;

        return (
          <Space direction="vertical" style={{ display: "flex", gap: "4px" }}>
            <FormItem
              type={TYPE_FIELD.INPUT_NUMBER}
              currencable
              isRounded
              value={
                isUsedApprovaledValue && record.unitPriceApprovaled
                  ? record.unitPriceApprovaled
                  : record.unitPrice
              }
              min={0}
              // max={max}
              onChange={(value: number | null) =>
                updatePrice(record.key, value || 0)
              }
            />
            <div
              style={{
                opacity: 0.6,
                fontSize: 12,
                width: "100%",
                textAlign: "left",
              }}
            >
              Đơn giá thuộc khoảng {numberUtils.formatNumber(min)}đ -{" "}
              {numberUtils.formatNumber(max)}đ
            </div>
          </Space>
        );
      },
    },
    {
      key: 6,
      title: "CLCL (%)",
      dataIndex: "remainingQuality",
      align: "right",
      render: (_, record) =>
        isUsedApprovaledValue && record.remainingQualityApprovaled
          ? record.remainingQualityApprovaled
          : record.remainingQuality,
    },
    {
      key: 7,
      title: "MĐHT (%)",
      dataIndex: "mdht",
      align: "right",
      render: (_, record) =>
        isUsedApprovaledValue && record.mdhtApprovaled
          ? record.mdhtApprovaled
          : record.mdht,
    },
    {
      key: 8,
      title: "Giá trị(đồng)",
      dataIndex: "totalValue",
      align: "right",
      render: (_, record) =>
        numberUtils.formatNumber(
          isUsedApprovaledValue && record.totalValueApprovaled
            ? record.totalValueApprovaled
            : record.totalValue
        ),
    },
    {
      key: 9,
      title: "Mô tả khác",
      dataIndex: "describe",
    },
  ];

  return (
    <Form labelWrap labelAlign="left" size="small">
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={constructions}
        pagination={false}
      />
    </Form>
  );
};
export default CtxdInfo;
