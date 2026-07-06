import { EyeOutlined } from "@ant-design/icons";
import { Card, Space, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import ButtonCustom from "components/ButtonCustom";
import TableCustom from "components/TableCustom";
import { APPRAISAL_FILE_STATUS, BUTTON_CODES } from "constant/common";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { CommonGetAllParams } from "constants/types/common.type";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import ComponentsError from "pages/ComponentsError";
import TimelineModal from "pages/CategoryManage/CategorySla/subcomponent/TimelineModal";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { formatDateWithHour } from "utils";
import { useCategorySla } from "utils/request";
import { randomId, renderAppraisalStatus } from "utils/string";
import { FilterSlaType, SlaType } from "constant/types/sla";

type Props = {
  filters: FilterSlaType;
  setFilters: (filters: FilterSlaType) => void;
};

type SelectedRecordType = {
  appraisalFileId: string;
  reportCode: string;
  maxCommitmentDate: number;
};

const CategorySlaTable: FC<Props> = ({ filters, setFilters }) => {
  const [isOpenTimelineModal, setIsOpenTimelineModal] =
    useState<boolean>(false);

  const [selectedAppraisalFile, setSelectedAppraisalFile] =
    useState<SelectedRecordType>({
      appraisalFileId: "",
      reportCode: "",
      maxCommitmentDate: 0,
    });

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const prevParamsRef = useRef<CommonGetAllParams>(params);

  const { data, isLoading, error } = useCategorySla(params, {
    ...filters,
    ...(filters.fileStatus === APPRAISAL_FILE_STATUS.LOS_RECEIVED
      ? {
          fileStatus: APPRAISAL_FILE_STATUS.ONE,
          isReceivedLos: true,
        }
      : {}),
    ...(filters.fileStatus === APPRAISAL_FILE_STATUS.ONE.toString()
      ? {
          fileStatus: APPRAISAL_FILE_STATUS.ONE,
          isReceivedLos: "false",
        }
      : {}),
    ...(filters.fileStatus === APPRAISAL_FILE_STATUS.TWENTY_ONE.toString()
      ? {
          fileStatus: APPRAISAL_FILE_STATUS.TWENTY,
          sendToEmail: 1, // sendToEmail có 2 giá trị là 1 và null
        }
      : {}),
    ...(filters.fileStatus === APPRAISAL_FILE_STATUS.TWENTY.toString()
      ? {
          fileStatus: APPRAISAL_FILE_STATUS.TWENTY,
        }
      : {}),
  });

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
    const storedParams = localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_PARAMS);
    if (storedParams && storedParams !== "{}") {
      try {
        const parsedParams = JSON.parse(storedParams);
        setParams({
          ...params,
          limit: parsedParams.limit,
          page: parsedParams.page,
        });
        localStorage.removeItem(LOCAL_STORAGE_KEY.PAGE_PARAMS);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [params]);

  const handleOpenTimelineModal = (record: SelectedRecordType) => {
    setSelectedAppraisalFile({ ...record });
    setIsOpenTimelineModal(true);
  };

  const dataTable = data
    ? data.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const columns: ColumnsType<SlaType> = [
    {
      key: 1,
      title: "STT",
      width: "50px",
      fixed: "left",
      align: "center",
      render: (_, record, index) => {
        return (Number(params.page) - 1) * Number(params.limit) + index + 1;
      },
    },
    {
      key: 2,
      title: "Số tờ trình",
      dataIndex: "reportCode",
      width: "180px",
      sorter: true,
      showSorterTooltip: false,
      render: (reportCode, record) => {
        return (
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
        );
      },
    },
    {
      key: 3,
      title: "Ngày nhận",
      dataIndex: "appraisalDate",
      render: (value: string) => {
        return value ? formatDateWithHour(value) : "";
      },
      width: "160px",
    },
    {
      key: 4,
      title: "Địa chỉ thẩm định",
      dataIndex: "address",
      render: (text) => (
        <Tooltip title={text}>
          <div className="inline-text">{text}</div>
        </Tooltip>
      ),
    },
    {
      key: 5,
      title: "Định giá viên",
      dataIndex: "staffs",
      render: (staffs: string) => {
        return staffs;
      },
      width: "160px",
    },
    {
      key: 6,
      title: "Trạng thái hồ sơ",
      dataIndex: "fileStatus",
      width: "200px",
      className: "files-status",
      render: (fileStatus, record) => (
        <Space style={{ width: "100%", maxWidth: "150px" }}>
          <span className="files-status-label">
            {renderAppraisalStatus(
              fileStatus,
              record?.isReceivedLos,
              record?.sendToEmail,
              record?.parentId,
              record?.refusedStatus
            )}
          </span>
        </Space>
      ),
    },
    {
      key: 7,
      title: "Tổng thời gian thực hiện (giờ)",
      dataIndex: "totalTimeDoing",
      width: "120px",
    },
    {
      key: 8,
      title: "Trạng thái",
      dataIndex: "status",
      width: "120px",
    },
    {
      key: 9,
      title: "Hành động",
      width: "100px",
      align: "center",
      render: (_: any, record: SlaType) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ButtonCustom
            type="default"
            size="small"
            onClick={() => {
              handleOpenTimelineModal({
                appraisalFileId: record.appraisalFileId,
                reportCode: record.reportCode,
                maxCommitmentDate: record.maxCommitmentDate,
              });
            }}
            icon={<EyeOutlined />}
            code={BUTTON_CODES.dm_sla_xem}
          />
        </div>
      ),
    },
  ];

  if (error) return <ComponentsError />;

  return (
    <div className="appraisal-files-table-container">
      <Card className="card-container" size="small">
        <Typography.Text
          style={{ fontWeight: "bold", fontSize: "16px" }}
          ellipsis={true}
        >
          Danh sách hồ sơ
        </Typography.Text>

        <TableCustom
          dataSource={dataTable}
          columns={columns}
          bordered={true}
          isLoading={!data && isLoading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data ? data.total : 0}
          onLimitChange={(limit) => {
            setParams({ ...params, limit });
          }}
          onPageChange={(page) => {
            setParams({ ...params, page });
          }}
          onSorterChange={(sorter) => {
            setParams((prev) => ({
              ...prev,
              sortBy: sorter?.sortBy,
              sortType: sorter?.sortType,
            }));
          }}
          page={params.page || 1}
          scroll={{ x: 1366 }}
        />
      </Card>
      <TimelineModal
        isOpen={isOpenTimelineModal}
        closeModal={() => setIsOpenTimelineModal(false)}
        reportCode={selectedAppraisalFile.reportCode}
        appraisalFileId={selectedAppraisalFile.appraisalFileId}
        maxCommitmentDate={selectedAppraisalFile.maxCommitmentDate}
      />
    </div>
  );
};

export default CategorySlaTable;
