import { Card, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import { FC } from "react";
import { numberUtils } from "utils";

type Props = {
  data: any;
  fileStatus?: number;
  title: string;
};

const CtxdInfo: FC<Props> = ({ data, fileStatus, title }) => {
  const isUsedApprovaledValue = fileStatus! > 14 && fileStatus! !== 17;

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "key",
      width: "3%",
      align: "center",
      render: (_, record, index) => index + 1,
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
      align: "left",
      render: (_, record) =>
        numberUtils.formatNumber(
          isUsedApprovaledValue && record.constructionAreaApprovaled
            ? record.constructionAreaApprovaled
            : record.constructionArea
        ),
    },
    {
      key: 5,
      title: "Đơn giá(đồng/m2 hoặc đồng/m3)",
      dataIndex: "unitPrice",
      align: "center",
      render: (_, record) => {
        // let error = "";
        const min = record.constructionName?.lowPrice;
        const max = record.constructionName?.highPrice;

        return (
          <Space
            direction="vertical"
            style={{ display: "flex", gap: "4px", justifyContent: "center" }}
          >
            {isUsedApprovaledValue && record.unitPriceApprovaled
              ? numberUtils.formatNumber(record.unitPriceApprovaled)
              : numberUtils.formatNumber(record.unitPrice)}
            <div
              style={{
                opacity: 0.6,
                fontSize: 12,
                width: "100%",
                textAlign: "center",
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
      align: "left",
      render: (_, record) =>
        isUsedApprovaledValue && record.remainingQualityApprovaled
          ? record.remainingQualityApprovaled
          : record.remainingQuality,
    },
    {
      key: 7,
      title: "MĐHT (%)",
      dataIndex: "mdht",
      align: "left",
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
    <div className="ctxd-info-container">
      <Card size="small">
        <Space size={4} style={{ width: "100%" }} direction="vertical">
          <CardTitleCustomUpdate title={title} />
          <TableCustom
            columns={columns}
            bordered
            dataSource={data}
            onLimitChange={() => {}}
            onPageChange={() => {}}
            limit={20}
            page={1}
            total={0}
            isLoading={false}
            scroll={{ x: 1366 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default CtxdInfo;
