import { DownOutlined } from "@ant-design/icons";
import { Col, message, Modal, Space, Spin, Table, Typography } from "antd";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import TableCustom from "components/TableCustom";
import { defaultColumns, columnKeys, DEBT_REPORT_CONFIG } from "./config";
import "./style.scss";
import { useEffect, useState } from "react";
import { exportReportDebt } from "apis/exportReportDebt";
import { FilterReportTotalDebt } from "constant/types";
import { saveAs } from "file-saver";
import { BUTTON_CODES } from "constant/common";
import { numberUtils } from "utils";

type Props = {
  data: Array<any>;
  filters: FilterReportTotalDebt;
  setFilters: (filters: FilterReportTotalDebt) => void;
};

const KEYS = [
  "collaborationFee",
  "phase1Fee",
  "phase2Fee",
  "confirmedFee",
  "unconfirmedFee",
];
const TableReportTotalDebt: React.FC<Props> = ({
  data,
  filters,
  setFilters,
}) => {
  const [exporting, setExporting] = useState(false);
  const [totalRow, setTotalRow] = useState<any>(null);
  const [dataTable, setDataTable] = useState<any[]>([]);

  //Map data vào bảng
  const handleTransformData = (data: any[]) => {
    const objectOfData: any = handleTransformDataToArray(data);
    const result: any[] = [];
    const totalObj = {
      daThu: 0,
      dataIndex: "totalRow",
      dauKy: 0,
      lon45ngay: 0,
      nho45ngay: 0,
      phatSinh: 0,
      stt: "",
      title: "Tổng cộng",
      total: 0,
    };

    data.forEach((item: any, index: number) => {
      if (DEBT_REPORT_CONFIG[index]) {
        const itemPush = {
          ...DEBT_REPORT_CONFIG[index],
          ...mapDataToObject(objectOfData[KEYS[index]] || []),
        };
        if (
          DEBT_REPORT_CONFIG[index].dataIndex === "collaborationFee" ||
          DEBT_REPORT_CONFIG[index].dataIndex === "phase1Fee" ||
          DEBT_REPORT_CONFIG[index].dataIndex === "phase2Fee"
        ) {
          totalObj.daThu += itemPush.daThu;
          totalObj.dauKy += itemPush.dauKy;
          totalObj.lon45ngay += itemPush.lon45ngay;
          totalObj.nho45ngay += itemPush.nho45ngay;
          totalObj.phatSinh += itemPush.phatSinh;
          totalObj.total += itemPush.total;
        }
        result.push(itemPush);
      }
    });
    setTotalRow(totalObj);
    return result;
  };

  //Transform data
  const handleTransformDataToArray = (data: any[]) => {
    const fields = [
      "collaborationFee",
      "phase1Fee",
      "phase2Fee",
      "confirmedFee",
      "unconfirmedFee",
    ];
    return fields.reduce((title: any, field: string) => {
      title[field] = data.map((item) => item[field]);
      return title;
    }, {});
  };

  //Lấy data của từng index
  const mapDataToObject = (data: any[]) => {
    return {
      dauKy: data[columnKeys["dauky"]],
      phatSinh: data[columnKeys["phatSinh"]],
      daThu: data[columnKeys["daThu"]],
      nho45ngay: data[columnKeys["nho45ngay"]],
      lon45ngay: data[columnKeys["lon45ngay"]],
      total: data[columnKeys["total"]],
    };
  };

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportReportDebt.exportExcell({
        ...filters,
      });
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Báo cáo tổng công nợ.xlsx");
    } catch (error) {
      // message.error("Xuất báo cáo thất bại!");
      message.error(`Không tìm thấy báo cáo!`);
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo tổng công nợ?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

  useEffect(() => {
    if (data) {
      const convertedData = handleTransformData(data);
      setDataTable(convertedData);
    }
  }, [data]);

  return (
    <CollapseCustom
      expandIcon={({ isActive }) => (
        <Space>
          <Typography style={{ color: "#2862af" }}>
            {isActive ? "Ẩn" : "Hiện"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{ color: "#2862af" }}
          />
        </Space>
      )}
      itemList={[
        {
          label: "Chi tiết",
          forceRender: true,
          children: (
            <div>
              <Col>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginBottom: "8px",
                  }}
                >
                  <ButtonCustom
                    label="Xuất báo cáo"
                    icon={
                      exporting ? (
                        <div className="spin-overlay">
                          <Spin className="spin" />
                        </div>
                      ) : (
                        <Excell />
                      )
                    }
                    className={`button-Report ${exporting ? "exporting" : ""}`}
                    size="small"
                    onClick={() => {
                      if (!(filters.dateFrom && filters.dateTo)) {
                        message.error(
                          "Vui lòng chọn từ ngày và đến ngày để xuất báo cáo!"
                        );
                      } else {
                        showConfirm();
                      }
                    }}
                    disabled={exporting}
                    code={BUTTON_CODES.bc_cong_no_export}
                  />
                </Space>
              </Col>
              <TableCustom
                dataSource={dataTable}
                columns={defaultColumns}
                bordered={true}
                isLoading={false}
                limit={0}
                total={0}
                onLimitChange={() => {}}
                onPageChange={() => {}}
                page={1}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Typography.Text strong>Tổng cộng</Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(totalRow?.dauKy)}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(totalRow?.phatSinh)}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(totalRow?.daThu)}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(totalRow?.nho45ngay)}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(totalRow?.lon45ngay)}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7} align="right">
                        <Typography.Text strong>
                          {numberUtils.formatNumber(totalRow?.total)}
                        </Typography.Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportTotalDebt;
