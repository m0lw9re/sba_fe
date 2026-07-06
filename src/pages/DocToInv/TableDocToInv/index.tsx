import { DownOutlined } from "@ant-design/icons";
import { Col, Modal, Space, Tooltip, Typography, message } from "antd";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import "./style.scss";
import { useDocToInv } from "utils/request";
import { FilterDocToInv, GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TableCustom from "components/TableCustom";
import ComponentsError from "pages/ComponentsError";
import { numberUtils, renderAppraisalStatus } from "utils";
import { Link } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { exportExcelAll } from "apis/exportReportAll";
import { saveAs } from "file-saver";
import { BUTTON_CODES } from "constant/common";
import { ColumnsType } from "antd/es/table";

type Props = {
  filters: FilterDocToInv;
  setFilters: (filters: FilterDocToInv) => void;
};

const TableDocToInv: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const [exporting, setExporting] = useState(false);

  const prevParamsRef = useRef<any>(params);

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilters({
      ...filters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useLayoutEffect(() => {
    if (
      params?.page !== undefined &&
      params?.page > 1 &&
      params?.limit !== undefined &&
      params?.limit >= 5 &&
      params.limit !== prevParamsRef.current.limit
    ) {
      setParams({
        ...params,
        limit: params.limit,
        page: 1,
      });
    }
  }, [params]);

  useEffect(() => {
    prevParamsRef.current = params;
  }, [params]);

  const { data, isLoading, error } = useDocToInv(params, {
    ...filters,
  });

  const genConditionColor = (text: string) => {
    if (!text) return "";

    let color = "";
    const _text = text.toLowerCase();
    if (_text === "chưa đủ đk") {
      color = "red";
    }
    if (_text === "đủ đk" || _text === "đã xuất hđ") {
      color = "#1677ff";
    }
    return <span style={{ color: color }}>{text}</span>;
  };

  if (error) return <ComponentsError />;

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "key",
      key: 1,
      width: "50px",
      align: "center",
      fixed: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      key: 2,
      title: "Số hồ sơ",
      dataIndex: "reportCode",
      align: "left",
      fixed: "left",
      render: (reportCode: any, record: any) => (
        <>
          <Link
            to={APPRAISAL_FILE_DETAIL.replace(":id", record.appraisalFileId)}
            onClick={() => {
              localStorage.setItem(
                LOCAL_STORAGE_KEY.PAGE_PARAMS,
                JSON.stringify({ limit: params.limit, page: params.page })
              );
            }}
            className="link-underline"
          >
            <Tooltip title={reportCode}>
              <div className="inline-text">{reportCode}</div>
            </Tooltip>
          </Link>
        </>
      ),
    },
    {
      key: 3,
      title: "Mã KH",
      dataIndex: "customerCode",
      align: "left",
      fixed: "left",
    },
    {
      key: 4,
      title: "Tên KH",
      dataIndex: "customerName",
      align: "left",
      fixed: "left",
    },
    {
      key: 5,
      title: "Trạng thái HS",
      dataIndex: "appraisalFileStatus",
      align: "left",
      fixed: "left",
      render: (appraisalFileStatus, record: any) =>
        renderAppraisalStatus(
          appraisalFileStatus,
          undefined,
          record.sendToEmail
        ),
    },
    {
      key: 6,
      title: "Phí thẩm định giá",
      align: "center",
      children: [
        {
          key: 7,
          title: "CTP",
          dataIndex: "congTacPhi",
          align: "right",
          render: (value) => numberUtils.formatNumber(value),
        },
        {
          key: 8,
          title: "Phí đợt 1",
          dataIndex: "phiDot1",
          align: "right",
          render: (value) => numberUtils.formatNumber(value),
        },
        {
          key: 9,
          title: "Phí đợt 2",
          dataIndex: "phiDot2",
          align: "right",
          render: (value) => numberUtils.formatNumber(value),
        },
        {
          key: 10,
          title: "Tổng",
          dataIndex: "",
          align: "right",
          render: (_, record: any) => {
            const congTacPhi = record?.congTacPhi || 0;
            const phiDot1 = record?.phiDot1 || 0;
            const phiDot2 = record?.phiDot2 || 0;
            return numberUtils.formatNumber(congTacPhi + phiDot1 + phiDot2);
          },
        },
      ],
    },
    {
      key: 11,
      title: "Đã thu",
      align: "center",
      children: [
        {
          key: 12,
          title: "CTP",
          dataIndex: "daThuCongTacPhi",
          align: "right",
          render: (value) => numberUtils.formatNumber(value),
        },
        {
          key: 13,
          title: "Phí đợt 1",
          dataIndex: "daThuPhiDot1",
          align: "right",
          render: (value) => numberUtils.formatNumber(value),
        },
        {
          key: 14,
          title: "Phí đợt 2",
          dataIndex: "daThuPhiDot2",
          align: "right",
          render: (value) => numberUtils.formatNumber(value),
        },
        {
          key: 15,
          title: "Tổng",
          dataIndex: "",
          align: "right",
          render: (_, record: any) => {
            const daThuCongTacPhi = record?.daThuCongTacPhi || 0;
            const daThuPhiDot1 = record?.daThuPhiDot1 || 0;
            const daThuPhiDot2 = record?.daThuPhiDot2 || 0;
            return numberUtils.formatNumber(
              daThuCongTacPhi + daThuPhiDot1 + daThuPhiDot2
            );
          },
        },
      ],
    },
    {
      key: 16,
      title: "Điều kiện xuất HĐ",
      align: "center",
      children: [
        {
          key: 17,
          title: "Phí đợt 1",
          dataIndex: "duDKDot1",
          align: "center",
          render: (text) => genConditionColor(text),
        },
        {
          key: 18,
          title: "Phí đợt 2",
          dataIndex: "duDKDot2",
          align: "center",
          render: (text) => genConditionColor(text),
        },
        {
          key: 19,
          title: "Tổng",
          dataIndex: "duDkTong",
          align: "center",
          render: (text) => genConditionColor(text),
        },
      ],
    },
  ];

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportExcelAll.exportExcelDocToInv({
        ...filters,
      });

      try {
        const jsonString = new TextDecoder("utf-8").decode(
          new Uint8Array(res.data)
        );
        const resBody = JSON.parse(jsonString);
        if (resBody.code && resBody.code == 400) {
          message.error(resBody.message);
        } else {
          message.warning("Don't handle response code");
        }
      } catch (e) {
        var blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Bao_cao_hs_du_dk_xuat_hd.xlsx");
      }
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
      content: `Bạn có chắc muốn xuất báo cáo hồ sơ đủ điều kiện xuất hoá đơn?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

  return (
    <CollapseCustom
      expandIcon={({ isActive }) => (
        <Space>
          <Typography style={{ color: "#2862af" }}>
            {isActive ? "Ẩn thông tin" : "Hiển thị thông tin"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{ color: "#2862af" }}
          />
        </Space>
      )}
      itemList={[
        {
          label: "Danh sách hồ sơ đủ điều kiện xuất hoá đơn",
          forceRender: true,
          children: (
            <div>
              <Col>
                <Space
                  style={{
                    display: "flex",
                    marginBottom: "8px",
                    justifyContent: "end",
                    width: "100%",
                  }}
                >
                  <ButtonCustom
                    label="Xuất báo cáo"
                    icon={exporting ? null : <Excell />}
                    className={`button-Report ${exporting ? "exporting" : ""}`}
                    size="small"
                    onClick={() => {
                      showConfirm();
                    }}
                    code={BUTTON_CODES.hs_du_dieu_kien_xuat_hoa_don_export}
                    disabled={exporting}
                    loading={exporting}
                  />
                </Space>
              </Col>
              <TableCustom
                bordered={true}
                columns={columns}
                dataSource={data ? data.data : []}
                isLoading={!data && isLoading}
                limit={data?.limit}
                page={data?.page}
                total={data?.total}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                scroll={{ x: 1920, y: 700 }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableDocToInv;
