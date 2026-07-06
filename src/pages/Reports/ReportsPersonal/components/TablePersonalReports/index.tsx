import { Col, message, Modal, Space, Spin, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState, useCallback } from "react";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import { defaultColumns } from "./config";
import { FilterPersonalReports, GetAllCommonType } from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined, ProfileOutlined } from "@ant-design/icons";
import { Excell } from "assets";
import { BUTTON_CODES } from "constant/common";
import { useReportPersonal } from "utils/request";
import TableCustom from "components/TableCustom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { Link } from "react-router-dom";
import { exportReportPersonal } from "apis/exportReportPersonal";
import saveAs from "file-saver";

type Props = {
  filters: FilterPersonalReports;
  setFilters: (filters: FilterPersonalReports) => void;
};

const TableFollowDebtReport: React.FC<Props> = ({ filters, setFilters }) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const { data, isLoading } = useReportPersonal(params, filters);

  const dataTable = data?.data.data.reportDetail;

  const numberAppraisalFileAtBegin = data?.data.data.numberAppraisalFileAtBegin;

  const numberAppraisalFileCreateNew =
    data?.data.data.numberAppraisalFileCreateNew;

  const numberAppraisalFileDone = data?.data.data.numberAppraisalFileDone;

  const numberAppraisalFileRemaining =
    data?.data.data.numberAppraisalFileRemaining;

  const [exporting, setExporting] = useState(false);

  const exportExcel = async () => {
    try {
      setExporting(true);
      const res = await exportReportPersonal.exportExcel({
        ...filters,
      });
      if (res.status === 200) {
        var blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Bao_cao_ca_nhan.xlsx");
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
      content: `Bạn có chắc muốn xuất báo cáo cá nhân`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcel();
      },
    });
  };

  const columns = defaultColumns.map((item) => {
    if (item.key === 0) {
      return {
        ...item,
        render: (_: any, record: any, index: any) => {
          return (Number(params.page) - 1) * Number(params.limit) + index + 1;
        },
      };
    }
    if (item.key === 2) {
      return {
        ...item,
        render: (climsCode: any, record: any) => (
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
              <Tooltip title={climsCode}>
                <div className="inline-text">{climsCode}</div>
              </Tooltip>
            </Link>
          </>
        ),
      };
    }
    if (item.key === 5) {
      return {
        ...item,
        render: (text: any) => (
          <Tooltip title={text}>
            <div className="tooltip-text">{text}</div>
          </Tooltip>
        ),
      };
    }
    return { ...item };
  });

  const prevParamsRef = useRef<any>(params);

  // Sử dụng useCallback để tránh re-render không cần thiết
  const handlePageChange = useCallback((page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page,
    }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      limit,
      page: 1, // Reset page về 1 khi thay đổi số lượng item trên trang
    }));
  }, []);

  useEffect(() => {
    // Chỉ gọi khi filters thay đổi thực sự
    setParams((prevParams) => ({
      ...prevParams,
      page: 1,
    }));
    setFilters(filters);
  }, [filters, setFilters]);

  useEffect(() => {
    prevParamsRef.current = params;
  }, [params]);

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
          label: "Báo cáo cá nhân",
          forceRender: true,
          children: (
            <div>
              <Col>
                <Space
                  style={{
                    display: "flex",
                    marginBottom: "8px",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <ButtonCustom
                    icon={<ProfileOutlined />}
                    className="button-fileStart"
                    size="small"
                  />
                  <p style={{ marginRight: "50px" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>
                      {numberAppraisalFileAtBegin}
                    </span>
                    <br />
                    Số lượng tồn đầu kỳ
                  </p>
                  <ButtonCustom
                    icon={<ProfileOutlined />}
                    className="button-fileProgress"
                    size="small"
                  />
                  <p style={{ marginRight: "50px" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>
                      {numberAppraisalFileCreateNew}
                    </span>
                    <br />
                    Phát sinh trong kỳ
                  </p>
                  <ButtonCustom
                    icon={<ProfileOutlined />}
                    className="button-fileComplte"
                    size="small"
                  />
                  <p style={{ marginRight: "50px" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>
                      {numberAppraisalFileDone}
                    </span>
                    <br />
                    Hoàn thành trong kỳ
                  </p>
                  <ButtonCustom
                    icon={<ProfileOutlined />}
                    className="button-fileEnd"
                    size="small"
                  />
                  <p style={{ marginRight: "50px" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>
                      {numberAppraisalFileRemaining}
                    </span>
                    <br />
                    Số lượng còn lại trong kỳ
                  </p>
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
                    className="button-exportReport"
                    size="small"
                    onClick={showConfirm}
                    disabled={exporting}
                    code={BUTTON_CODES.bccn_export}
                  />
                </Space>
              </Col>
              <TableCustom
                bordered={true}
                columns={columns}
                dataSource={dataTable}
                isLoading={!data && isLoading}
                limit={data?.data.limit}
                page={data?.data.page}
                total={data?.data.total}
                onLimitChange={handleLimitChange}
                onPageChange={handlePageChange}
                scroll={{ x: 1980 }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableFollowDebtReport;
