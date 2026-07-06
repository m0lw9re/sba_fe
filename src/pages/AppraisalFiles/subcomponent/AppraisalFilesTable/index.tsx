import { MoreOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Space, Spin, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { appraisalFilesApi } from "apis/appraisalFiles";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import TableCustom from "components/TableCustom";
import { APPRAISAL_FILE_STATUS, BUTTON_CODES } from "constant/common";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import {
  AppraisalFileType,
  FilterAppraisalFileType,
} from "constant/types/appraisalFile";
import { feeNotificationStatus } from "constant/types/fee";
import { CommonGetAllParams } from "constants/types/common.type";
import { isCanCreateAppraisalFile } from "pages/AppraisalFileCreate";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesTable/style.scss";
import ComponentsError from "pages/ComponentsError";
import AdditionRequiredTable from "pages/ModalViewAdditionRequiredTable";
import ModalViewAssignmentTable from "pages/ModalViewAssignmentTable";
import ApprovalHistoryModal from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  APPRAISAL_FILES,
  APPRAISAL_FILES_CREATE,
  APPRAISAL_FILE_DETAIL,
} from "routes/route.constant";
import { formatDateWithHour } from "utils";
import { renderAppraisalFilesTableByRole } from "utils/common";
import { useAccounts, useAppraisalFiles } from "utils/request";
import { useApproval } from "utils/request/useApproval";
import { randomId, renderAppraisalStatus } from "utils/string";

type Props = {
  filters: FilterAppraisalFileType;
  setFilters: (filters: FilterAppraisalFileType) => void;
};
type RefusalToPriceContentsProps = { key: string; value: string }[];

const AppraisalFilesTable: FC<Props> = ({ filters, setFilters }) => {
  const navigate = useNavigate();

  const [isOpenModalView, setIsOpenModalView] = useState<boolean>(false);
  const [isOpenModalApprovalView, setIsOpenModalApprovalView] =
    useState<boolean>(false);
  const [isOpenAdditionRequiredModal, setOpenAdditionRequiredModal] =
    useState<boolean>(false);
  const [assetLevelTwoId, setAssetLevelTwoId] = useState<number>(0);
  const [signatureDate, setSignatureDate] = useState<string | null>(null);
  const [appraisalFiles, setAppraisalFiles] = useState<string>("");
  const [selectedAppraisalId, setSelectedAppraisalId] = useState<string>("");
  const [refusalToPriceContents, setRefusalToPriceContents] =
    useState<RefusalToPriceContentsProps>([]);

  const openModalView = (record: any) => {
    setIsOpenModalView(true);
    setAppraisalFiles(record.appraisalFileId);
  };

  const closeModalView = () => {
    setIsOpenModalView(false);
  };

  const openModalApprovalView = (record: any) => {
    setIsOpenModalApprovalView(true);
    setAppraisalFiles(record.appraisalFileId);
    setAssetLevelTwoId(record.assetLevelTwoId);
    setSignatureDate(record.signatureDate);
  };

  const closeModalApprovalView = () => {
    setIsOpenModalApprovalView(false);
    setSignatureDate(null);
  };

  const openAdditionRequiredModal = (appraisalFileId: string) => {
    setSelectedAppraisalId(appraisalFileId);
    setOpenAdditionRequiredModal(true);
  };

  const closeAdditionRequiredModal = () => {
    setOpenAdditionRequiredModal(false);
  };

  const { data: approvalInfo } = useApproval(appraisalFiles || null);

  const { data: staffs } = useAccounts({
    page: 1,
    limit: 9000,
  });

  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const prevParamsRef = useRef<CommonGetAllParams>(params);

  const { data, isLoading, error } = useAppraisalFiles(params, {
    ...filters,
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.LOS_RECEIVED
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.ONE,
          isReceivedLos: true,
        }
      : {}),
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.ONE.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.ONE,
          isReceivedLos: "false",
        }
      : {}),
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.TWENTY_ONE.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.TWENTY,
          sendToEmail: 1, // sendToEmail có 2 giá trị là 1 và null
        }
      : {}),
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.TWENTY.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.TWENTY,
        }
      : {}),
    ...(filters.fileStatusId ===
    APPRAISAL_FILE_STATUS.REFUSED_NO_PRICE.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.MINUS_ONE,
          refusedStatus: 0,
        }
      : {}),
    ...(filters.fileStatusId === APPRAISAL_FILE_STATUS.REFUSED_TO_NEW.toString()
      ? {
          fileStatusId: APPRAISAL_FILE_STATUS.MINUS_ONE,
          refusedStatus: 1,
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

  const handleNavigateAppraisalDetail = (id: string) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY.PAGE_PARAMS,
      JSON.stringify({ limit: params.limit, page: params.page })
    );
    navigate(APPRAISAL_FILE_DETAIL.replace(":id", id), {
      state: {
        label: "Hồ sơ tổng",
        path: APPRAISAL_FILES,
      },
    });
  };

  const handleGetRefusalToPriceContent = async (id: string) => {
    if (!id) return;
    // find refusal exist
    const findItem = refusalToPriceContents.find((item) => item.key === id);
    if (findItem) return;
    // get from api
    try {
      const res = await appraisalFilesApi.getRefusalToPriceReason(id);
      if (res.data) {
        const newRefusalToPriceContents = [
          ...refusalToPriceContents,
          { key: id, value: res.data.contentRefused || "Nội dung trống" },
        ];
        setRefusalToPriceContents(newRefusalToPriceContents);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const dataTable = data
    ? data.data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  const value = [{ quantity: data?.total, name: "tài sản" }];
  // const moreItems: MenuProps['items'] =

  const columns: ColumnsType<AppraisalFileType> = [
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
      key: "climsCode",
      title: "Mã Clims",
      dataIndex: "climsCode",
      sorter: true,
      width: "150px",
      fixed: "left",
      render: (climsCode, record) => (
        <>
          <Link
            to={APPRAISAL_FILE_DETAIL.replace(":id", record.appraisalFileId)}
            onClick={() => {
              localStorage.setItem(
                LOCAL_STORAGE_KEY.PAGE_PARAMS,
                JSON.stringify({ limit: params.limit, page: params.page })
              );
            }}
            className={`link-underline ${
              record?.checkClimsLos ? "warning-underline" : ""
            }`}
          >
            <Tooltip
              title={
                record?.checkClimsLos ? (
                  <div className="d-flex-center">
                    <WarningOutlined
                      color="#fff"
                      style={{ marginRight: "3px" }}
                    />
                    <div>Trùng mã CLIMS</div>
                  </div>
                ) : (
                  climsCode
                )
              }
              color={record?.checkClimsLos ? "#f5222d" : "rgba(0, 0, 0, 0.85)"}
            >
              <div
                className={`inline-text ${
                  record?.checkClimsLos ? "warning-text" : ""
                }`}
              >
                {climsCode}
              </div>
            </Tooltip>
          </Link>
        </>
      ),
    },
    {
      key: 2,
      title: "Mã đề nghị",
      dataIndex: "proposalCode",
      width: "180px",
      sorter: true,
      showSorterTooltip: false,
      render: (proposalCode, record) => (
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
            <Tooltip title={proposalCode}>
              <div className="inline-text">{proposalCode}</div>
            </Tooltip>
          </Link>
        </>
      ),
    },
    {
      key: 3,
      title: "Phân loại tài sản",
      dataIndex: "assetLevelThrees",
      sorter: true,
      showSorterTooltip: false,
      render: (text) => (
        <Tooltip
          title={
            <>
              {text
                ? text.split("\n").map((txt: string, index: number) => (
                    <p key={index} style={{ margin: 0, padding: 0 }}>
                      {txt}
                    </p>
                  ))
                : text}
            </>
          }
        >
          <div className="inline-text">{text}</div>
        </Tooltip>
      ),
      width: "150px",
    },
    {
      key: 4,
      title: "Độ ưu tiên",
      dataIndex: "priorityLevelName",
      width: "60px",
      align: "center",
    },
    {
      key: 5,
      title: "Số tờ trình",
      dataIndex: "reportCode",
      width: "180px",
      sorter: true,
      showSorterTooltip: false,
      render: (reportCode, record) => {
        const color =
          record.wasNotification === true
            ? "#38761D"
            : record.wasNotification === null
            ? "#1677ff"
            : "#FFA500";
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
            style={{ color }}
          >
            <Tooltip title={reportCode}>
              <div className="inline-text">{reportCode}</div>
            </Tooltip>
          </Link>
        );
      },
    },
    {
      key: 6,
      title: "Địa chỉ/Tên tài sản",
      dataIndex: "addressCustomDetail",
      width: "180px",
      render: (text) => (
        <Tooltip title={text}>
          <div className="inline-text">{text}</div>
        </Tooltip>
      ),
    },
    {
      key: 7,
      title: "Tên khách hàng",
      render: (_, record) => {
        const customerName = record?.typeCreated
          ? record?.customerNameByLos
          : record.customer?.customerName;
        return (
          <Tooltip title={customerName}>
            <div className="inline-text">{customerName}</div>
          </Tooltip>
        );
      },
      width: "130px",
    },
    {
      key: 8,
      title: "CV khảo sát",
      dataIndex: "surveyer",
      width: "150px",
      render: (surveyer: string) => {
        return (
          <Tooltip title={surveyer}>
            <div className="inline-text">{surveyer}</div>
          </Tooltip>
        );
      },
    },
    {
      key: 9,
      title: "Ngày gửi",
      dataIndex: "proposalDate",
      render: (value: string) => {
        return value ? formatDateWithHour(value) : "";
      },
      width: "160px",
    },
    {
      key: 10,
      title: "Người gửi",
      dataIndex: "rmName",
      width: "150px",
    },
    {
      key: 11,
      title: "Trạng thái báo phí",
      dataIndex: "feeStatus",
      width: "190px",
      render: (feeStatus) => {
        return (
          feeNotificationStatus.find(
            (item) => item.value === feeStatus?.toString()
          )?.label || ""
        );
      },
    },
    {
      key: 12,
      title: "Ngày ký số",
      dataIndex: "signatureDate",
      render: (value: string) => {
        return value ? formatDateWithHour(value) : "";
      },
      width: "160px",
    },
    {
      key: 13,
      title: "Ngày gửi TBKQ",
      dataIndex: "dateSendTb",
      render: (value: string) => {
        return value ? formatDateWithHour(value) : "";
      },
      width: "160px",
    },
    {
      key: 14,
      title: "Ngày gửi KQ",
      dataIndex: "dateSendToLos",
      render: (value: string) => {
        return value ? formatDateWithHour(value) : "";
      },
      width: "160px",
    },
    {
      key: 15,
      title: "Luồng",
      sorter: false,
      dataIndex: "flowId",
      render: (_, record) => record.flow?.flowName,
      width: "120px",
    },
    {
      key: 15.1,
      title: "Thay thế bằng",
      sorter: false,
      dataIndex: "replaceToAppraisalFileCode",
      width: "180px",
    },
    {
      key: 15.2,
      title: "Thay thế cho",
      sorter: false,
      dataIndex: "replaceByAppraisalFileCode",
      width: "180px",
    },
    {
      key: 16,
      title: "Trạng thái",
      dataIndex: "fileStatus",
      width: "200px",
      fixed: "right",
      className: "files-status",
      render: (status, record) => (
        <Space style={{ width: "100%", maxWidth: "150px" }}>
          {record.fileStatus === -1 ? (
            <div
              onMouseEnter={async () => {
                await handleGetRefusalToPriceContent(record.appraisalFileId);
              }}
            >
              <Tooltip
                title={
                  refusalToPriceContents.find(
                    (item) => item.key === record.appraisalFileId
                  )?.value || <Spin />
                }
              >
                <span className="files-status-label">
                  {renderAppraisalStatus(
                    status,
                    record?.isReceivedLos,
                    record?.sendToEmail,
                    record?.parentId,
                    record?.refusedStatus
                  )}
                </span>
              </Tooltip>
            </div>
          ) : (
            <span className="files-status-label">
              {renderAppraisalStatus(
                status,
                record?.isReceivedLos,
                record?.sendToEmail,
                record?.parentId,
                record?.refusedStatus
              )}
            </span>
          )}
          <span className="files-actions">
            <Dropdown
              trigger={["hover"]}
              menu={{
                items: [
                  {
                    label: "Lịch sử phân giao",
                    key: "1",
                    onClick: () =>
                      openModalView({
                        appraisalFileId: record.appraisalFileId,
                      }),
                  },
                  {
                    label: "Lịch sử phê duyệt",
                    key: "2",
                    onClick: () => {
                      openModalApprovalView(record);
                    },
                  },
                  {
                    label: "Lịch sử yêu cầu bổ sung",
                    key: "3",
                    onClick: () =>
                      openAdditionRequiredModal(record.appraisalFileId),
                  },
                ],
              }}
              placement="bottomLeft"
            >
              <Button
                type="text"
                icon={
                  <MoreOutlined
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  />
                }
              />
            </Dropdown>
          </span>
        </Space>
      ),
    },
  ];
  if (error) return <ComponentsError />;
  return (
    <div className="appraisal-files-table-container">
      <Card className="card-container" size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          {value.map((item, index: number) => (
            <Typography.Text
              key={index}
              style={{ fontWeight: "bold", fontSize: "16px" }}
              ellipsis={true}
            >
              Danh sách hồ sơ tổng ({item.quantity} {item.name})
            </Typography.Text>
          ))}
          {
            <ButtonCustom
              type="primary"
              icon={<Icons.add />}
              size="small"
              onClick={() => navigate(APPRAISAL_FILES_CREATE)}
              label="Thêm mới"
              code={BUTTON_CODES.hst_them_moi_hs}
              bgColor={"#2862AF"}
            />
          }
        </div>
        <TableCustom
          dataSource={dataTable}
          columns={renderAppraisalFilesTableByRole(columns)}
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
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: (e) =>
                handleNavigateAppraisalDetail(record.appraisalFileId),
            };
          }}
        />
      </Card>
      <ModalViewAssignmentTable
        isOpenModal={isOpenModalView}
        closeModal={closeModalView}
        appraisalFileId={appraisalFiles}
      />
      <ApprovalHistoryModal
        assetLevelTwoId={assetLevelTwoId}
        isOpen={isOpenModalApprovalView}
        closeModal={closeModalApprovalView}
        staffs={(staffs && staffs?.data) || []}
        historyApproval={approvalInfo?.approvalHistoryDtos || []}
        signatureDate={signatureDate}
      />
      <AdditionRequiredTable
        isOpenModal={isOpenAdditionRequiredModal}
        closeModal={closeAdditionRequiredModal}
        appraisalFileId={selectedAppraisalId}
      />
    </div>
  );
};

export default AppraisalFilesTable;
