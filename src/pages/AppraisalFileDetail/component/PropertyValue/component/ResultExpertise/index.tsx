import { Card, Table, Typography } from "antd";
import "./style.scss";
import { FC } from "react";
import { TableTongType } from "constant/types/appraisalFile";
import { numberUtils } from "utils";
import { ColumnsType } from "antd/es/table";

type Props = {
  tableTong: TableTongType;
  assetLevelTwoId: number | null;
};

export const ResultExpertise: FC<Props> = ({ tableTong, assetLevelTwoId }) => {
  const realEstateColumns: ColumnsType<TableTongType> = [
    {
      title: "Tổng giá trị QSDĐ (đồng)",
      dataIndex: "landValueApprovaled",
      render: (landValueApprovaled) => (
        <div style={{ textAlign: "right" }}>
          {numberUtils.formatNumber(landValueApprovaled)}
        </div>
      ),
    },
    {
      title: "Tổng giá trị CTXD (đồng)",
      dataIndex: "constructionValueApprovaled",
      render: (constructionValueApprovaled) => (
        <div style={{ textAlign: "right" }}>
          {numberUtils.formatNumber(constructionValueApprovaled)}
        </div>
      ),
    },
    {
      title: "Tổng giá trị CTXD tham khảo (đồng)",
      dataIndex: "constructionReferValueApprovaled",
      render: (constructionReferValueApprovaled) => (
        <div style={{ textAlign: "right" }}>
          {numberUtils.formatNumber(constructionReferValueApprovaled)}
        </div>
      ),
    },
    {
      title:
        assetLevelTwoId === 9
          ? "Tổng giá trị CTXD hình thành trong tương lai - tham khảo (đồng)"
          : "Tổng giá trị tài sản (đồng)",
      dataIndex: "totalValueApprovaled",
      render: (totalValueApprovaled) => (
        <div style={{ textAlign: "right" }}>
          {assetLevelTwoId === 9 ? (
            <>
              {numberUtils.formatNumber(
                tableTong?.constructionFutureValueApprovaled || ""
              )}
            </>
          ) : (
            <>{numberUtils.formatNumber(totalValueApprovaled)}</>
          )}
        </div>
      ),
    },
  ];

  const projectColumns: ColumnsType<TableTongType> = [
    {
      title: "Tổng giá trị QSDĐ (đồng)",
      dataIndex: "landValueApprovaled",
      render: (landValueApprovaled) => (
        <div style={{ textAlign: "center" }}>
          {numberUtils.formatNumber(landValueApprovaled)}
        </div>
      ),
    },
    {
      title: "Tổng giá trị CTXD (đồng)",
      dataIndex: "constructionValueApprovaled",
      render: (constructionValueApprovaled) => (
        <div style={{ textAlign: "center" }}>
          {numberUtils.formatNumber(constructionValueApprovaled)}
        </div>
      ),
    },
    {
      title: "Tổng giá trị CTXD tham khảo (đồng)",
      dataIndex: "constructionReferValueApprovaled",
      render: (constructionReferValueApprovaled) => (
        <div style={{ textAlign: "center" }}>
          {numberUtils.formatNumber(constructionReferValueApprovaled)}
        </div>
      ),
    },
  ];

  return (
    <Card size="small" className="result-expertise-card">
      <Typography.Text className="result-expertise-heading">
        Kết quả tổng
      </Typography.Text>
      {(assetLevelTwoId === 1 ||
        assetLevelTwoId === 9 ||
        assetLevelTwoId === 8) && (
        <Table
          style={{ marginBottom: "16px", marginTop: "4px" }}
          bordered
          size="small"
          columns={assetLevelTwoId === 8 ? projectColumns : realEstateColumns}
          dataSource={[tableTong]}
          pagination={false}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        <div style={{ flex: 1, display: "flex", gap: "8px" }}>
          <Typography style={{ opacity: 0.6 }}>
            Tổng giá trị tài sản (đồng):
          </Typography>
          <Typography.Text strong>
            {numberUtils.formatNumber(tableTong?.totalValueApprovaled || "")}
          </Typography.Text>
        </div>
        <div style={{ flex: 1, display: "flex", gap: "8px" }}>
          <Typography style={{ opacity: 0.6 }}>
            Tổng giá trị tài sản làm tròn (đồng):
          </Typography>
          <Typography.Text strong>
            {numberUtils.formatNumber(
              tableTong?.totalValueRoundedApprovaled || ""
            )}
          </Typography.Text>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        <div style={{ flex: 1, display: "flex", gap: "8px", marginTop: "8px" }}>
          <Typography style={{ opacity: 0.6 }}>Bằng chữ:</Typography>
          <Typography.Text strong>
            {numberUtils.numberToWordsLib(
              tableTong?.totalValueRoundedApprovaled || ""
            )}
          </Typography.Text>
        </div>
      </div>
    </Card>
  );
};
