import { MoreOutlined, WarningOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Space,
  Tooltip,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import ButtonCustom from "components/ButtonCustom";
import TableCustomWithoutCustomSelection from "components/TableRoles";
import { APPRAISAL_FILE_STATUS, BUTTON_CODES, ROLES } from "constant/common";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import {
  AppraisalFileType,
  FilterAppraisalFileType,
} from "constant/types/appraisalFile";
import { feeNotificationStatus } from "constant/types/fee";
import { CommonGetAllParams } from "constants/types/common.type";
import "pages/AppraisalFilesReceive/subcomponents/AppraisalFileReceiveTable/style.scss";
import ComponentsError from "pages/ComponentsError";
import ModalViewAssignmentTable from "pages/ModalViewAssignmentTable";
import ApprovalHistoryModal from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal";
import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  APPRAISAL_FILES_RECEIVE,
  APPRAISAL_FILE_DETAIL,
  LOGIN,
} from "routes/route.constant";
import { formatDateWithHour } from "utils";
import {
  isContainRole,
  isLiveEnv,
  renderAppraisalFilesTableByRole,
} from "utils/common";
import {
  useAccountDetail,
  useAccounts,
  useAppraisalFiles,
} from "utils/request";
import { useApproval } from "utils/request/useApproval";
import { renderAppraisalStatus } from "utils/string";
import QuickAssignmentModal from "./QuickAssignmentModal";

type Props = {
  filters: FilterAppraisalFileType;
  setFilters: (filters: FilterAppraisalFileType) => void;
};

const AppraisalFileReceiveTable: FC<Props> = ({ filters, setFilters }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem(LOCAL_STORAGE_KEY.USERNAME);
  const isRoleMultipleAssignment = isContainRole(
    ROLES.CBTH,
    ROLES.CBTM,
    ROLES.CVC,
    ROLES.CVCC,
    ROLES.TPTĐG,
    ROLES.TGĐ,
    ROLES.PTGĐ,
    ROLES.GĐCN,
    ROLES.TPCNHN,
    ROLES.PGĐCN,
    ROLES.CT,
    ROLES.TBP
  );
  const { data: userInfo } = useAccountDetail(username || "");
  const [isOpenModalView, setIsOpenModalView] = useState<boolean>(false);
  const [isOpenModalApprovalView, setIsOpenModalApprovalView] =
    useState<boolean>(false);
  const [assetLevelTwoId, setAssetLevelTwoId] = useState<number>(0);
  const [appraisalFiles, setAppraisalFiles] = useState<string>("");
  const [signatureDate, setSignatureDate] = useState<string | null>(null);

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
  const [openAssignmentModal, setOpenAssignmentModal] =
    useState<boolean>(false);
  const [selectedAppraisalFiles, setSelectedAppraisalFiles] = useState<
    string[]
  >([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);

  const { data, isLoading, error, mutate } = useAppraisalFiles(
    params,
    {
      ...(filters && { ...filters, isFiltering: undefined }),
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
            sendToEmail: 1,
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
      ...(filters.fileStatusId ===
      APPRAISAL_FILE_STATUS.REFUSED_TO_NEW.toString()
        ? {
            fileStatusId: APPRAISAL_FILE_STATUS.MINUS_ONE,
            refusedStatus: 1,
          }
        : {}),
    },
    "receive"
  );

  const dataTable = useMemo(() => {
    if (!data) return [];
    return data.data.map((item: AppraisalFileType) => ({
      ...item,
      key: item.appraisalFileId,
    }));
  }, [data]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRowKeysCheck((prevData: any) => {
      const updatedData = prevData.map((item: any) => {
        if (item.page === params.page) {
          return {
            ...item,
            selectedRowKeys: newSelectedRowKeys,
          };
        }
        return item;
      });

      const doesExist = updatedData.some(
        (item: any) => item.page === params.page
      );

      if (!doesExist) {
        updatedData.push({
          page: params.page,
          selectedRowKeys: newSelectedRowKeys,
        });
      }

      return updatedData;
    });

    setSelectedAppraisalFiles(
      newSelectedRowKeys.map((key: React.Key) => {
        const appraisalFile = dataTable?.find(
          (item: AppraisalFileType) => item.key === key
        );
        return appraisalFile?.appraisalFileId || "";
      })
    );
  };

  const handleAssignment = () => {
    if (selectedAppraisalFiles.length === 0) {
      message.error("Vui lòng chọn ít nhất một hồ sơ để phân giao");
    } else {
      setOpenAssignmentModal(true);
    }
  };

  const handleCheckIsDisableRow = (record: AppraisalFileType) => {
    // ROLE_CBTH
    if (isContainRole(ROLES.CBTH)) {
      return (
        // 11/01/2024 - haipham - check đã thực hiện tiếp nhận từ LOS hay chưa
        // 12/01 khang - fix lại phải tiếp nhận mới có thể phân giao
        (record.fileStatus !== APPRAISAL_FILE_STATUS.ONE ||
          record.isReceivedLos !== true) &&
        // end
        record.fileStatus !== APPRAISAL_FILE_STATUS.ZERO
      );
    } else {
      // ROLE_PPTĐG
      return record.fileStatus !== APPRAISAL_FILE_STATUS.SIX;
    }
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: AppraisalFileType) => {
      const isMworkConfirmed: boolean =
        isContainRole(ROLES.CBTH) || isContainRole(ROLES.CBTM)
          ? record?.feeStatus === 3
            ? true
            : false
          : true;

      return {
        // tính năng chưa đẩy live
        disabled: isLiveEnv
          ? handleCheckIsDisableRow(record)
          : isMworkConfirmed
          ? handleCheckIsDisableRow(record)
          : true,
      };
    },
    columnWidth: "35px",
  };

  useEffect(() => {
    setParams({ ...params, page: 1 });
    setFilters({
      ...filters,
    });
    setSelectedRowKeys([]);
    setSelectedRowKeysCheck([]);
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
    if (params.limit !== prevParamsRef.current.limit) {
      setSelectedRowKeys([]);
      setSelectedRowKeysCheck([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY.CHECK_BOX);
      localStorage.removeItem(LOCAL_STORAGE_KEY.CHECK_BOX_KEY);
    }
    if (params.page !== prevParamsRef.current.page) {
      const filteredRowKeys = selectedRowKeysCheck
        .filter((rowKey: any) => rowKey.page === params.page)
        .map((rowKey: any) => rowKey.selectedRowKeys)
        .flat();

      setSelectedRowKeys(filteredRowKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    const fetchData = async () => {
      const storedCheckBox = localStorage.getItem(LOCAL_STORAGE_KEY.CHECK_BOX);

      let currentKey = window.history.state?.key;
      let prevKey;

      // Set prevKey in the first run
      if (!localStorage.getItem(LOCAL_STORAGE_KEY.CHECK_BOX_KEY)) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.CHECK_BOX_KEY,
          JSON.stringify({ prevKey: null })
        );
      }

      // Get prevKey from localStorage and parse it as JSON
      prevKey = localStorage.getItem(LOCAL_STORAGE_KEY.CHECK_BOX_KEY);
      prevKey = prevKey !== null ? JSON.parse(prevKey) : null;

      // Log previous key and current key
      // console.log("Prev key: ", prevKey?.prevKey);
      // console.log("Current key: ", currentKey);

      // Update prevKey with currentKey
      localStorage.setItem(
        LOCAL_STORAGE_KEY.CHECK_BOX_KEY,
        JSON.stringify({ prevKey: currentKey })
      );

      if (currentKey && currentKey === prevKey?.prevKey) {
        if (storedCheckBox && storedCheckBox !== "{}") {
          try {
            const parsedCheckBox = JSON.parse(storedCheckBox);
            setSelectedRowKeysCheck([...parsedCheckBox]);
            setSelectedRowKeys(
              parsedCheckBox.map((rowKey: any) => rowKey.selectedRowKeys).flat()
            );
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY.CHECK_BOX);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.CHECK_BOX);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleNavigateAppraisalDetail = (id: string) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY.PAGE_PARAMS,
      JSON.stringify({ limit: params.limit, page: params.page })
    );
    localStorage.setItem(
      LOCAL_STORAGE_KEY.CHECK_BOX,
      JSON.stringify(selectedRowKeysCheck)
    );
    navigate(APPRAISAL_FILE_DETAIL.replace(":id", id), {
      state: {
        label: "Hồ sơ đến",
        path: APPRAISAL_FILES_RECEIVE,
      },
    });
  };

  const value = [{ quantity: data?.total, name: "tài sản" }];

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
      render: (climsCode, record, index) => (
        <Link
          key={index}
          to={APPRAISAL_FILE_DETAIL.replace(":id", record.appraisalFileId)}
          onClick={() => {
            localStorage.setItem(
              LOCAL_STORAGE_KEY.PAGE_PARAMS,
              JSON.stringify({ limit: params.limit, page: params.page })
            );
            localStorage.setItem(
              LOCAL_STORAGE_KEY.CHECK_BOX,
              JSON.stringify(selectedRowKeysCheck)
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
      ),
    },
    {
      key: 2,
      title: "Mã đề nghị",
      dataIndex: "proposalCode",
      width: "180px",
      sorter: true,
      showSorterTooltip: false,
      render: (proposalCode, record, index) => (
        <Link
          key={index}
          to={APPRAISAL_FILE_DETAIL.replace(":id", record.appraisalFileId)}
          onClick={() => {
            localStorage.setItem(
              LOCAL_STORAGE_KEY.PAGE_PARAMS,
              JSON.stringify({ limit: params.limit, page: params.page })
            );
            localStorage.setItem(
              LOCAL_STORAGE_KEY.CHECK_BOX,
              JSON.stringify(selectedRowKeysCheck)
            );
          }}
          className="link-underline"
        >
          <Tooltip title={proposalCode}>
            <div className="inline-text">{proposalCode}</div>
          </Tooltip>
        </Link>
      ),
    },
    {
      key: 3,
      title: "Phân loại tài sản",
      dataIndex: "assetLevelThrees",
      sorter: true,
      showSorterTooltip: false,
      render: (text, _, index) => (
        <Tooltip
          key={index}
          title={
            <>
              {text?.split("\n").map((txt: string, index: number) => (
                <p key={index} style={{ margin: 0, padding: 0 }}>
                  {txt}
                </p>
              ))}
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
      width: "170px",
      sorter: true,
      showSorterTooltip: false,
      render: (reportCode, record, index) => {
        const color =
          record.wasNotification === true
            ? "#38761D"
            : record.wasNotification === null
            ? "#1677ff"
            : "#FFA500";
        return (
          <Link
            key={index}
            to={APPRAISAL_FILE_DETAIL.replace(":id", record.appraisalFileId)}
            onClick={() => {
              localStorage.setItem(
                LOCAL_STORAGE_KEY.PAGE_PARAMS,
                JSON.stringify({ limit: params.limit, page: params.page })
              );
              localStorage.setItem(
                LOCAL_STORAGE_KEY.CHECK_BOX,
                JSON.stringify(selectedRowKeysCheck)
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
      render: (text, _, index) => (
        <Tooltip title={text} key={index}>
          <div className="inline-text">{text}</div>
        </Tooltip>
      ),
    },
    {
      key: 7,
      title: "Tên khách hàng",
      render: (_, record, index) => {
        const customerName = record?.typeCreated
          ? record?.customerNameByLos
          : record.customer?.customerName;
        return (
          <Tooltip title={customerName} key={index}>
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
      render: (surveyer: string, _, index) => {
        return (
          <Tooltip title={surveyer} key={index}>
            <div className="inline-text">{surveyer}</div>
          </Tooltip>
        );
      },
    },
    // {
    //   key: 9,
    //   title: "CV phân tích",
    //   dataIndex: "appraiser",
    // },
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
      title: "Luồng",
      dataIndex: "flowId",
      render: (_, record) => record.flow?.flowName,
      sorter: false,
      width: "120px",
    },
    {
      key: 12.1,
      title: "Thay thế bằng",
      sorter: false,
      dataIndex: "replaceToAppraisalFileCode",
      width: "180px",
    },
    {
      key: 12.2,
      title: "Thay thế cho",
      sorter: false,
      dataIndex: "replaceByAppraisalFileCode",
      width: "180px",
    },
    {
      key: 13,
      title: "Trạng thái",
      dataIndex: "fileStatus",
      width: "200px",
      fixed: "right",
      className: "files-status",
      render: (status, record) => (
        <Space style={{ width: "100%", maxWidth: "150px" }}>
          <span className="files-status-label">
            {renderAppraisalStatus(
              status,
              record?.isReceivedLos,
              record?.sendToEmail,
              record?.parentId,
              record?.refusedStatus
            )}
          </span>
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

  // if (!username) {
  //   message.error("Có lỗi xảy ra. Vui lòng đăng nhập lại");
  //   navigate(LOGIN, {
  //     replace: true,
  //   });
  // }
  if (error) return <ComponentsError />;

  return (
    <div className="appraisal-file-receive-table-container">
      <Card className="card-container" size="small">
        <div
          style={{
            marginBottom: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {value.map((item, index) => (
            <Typography.Text
              style={{ fontWeight: "bold", fontSize: "16px" }}
              ellipsis={true}
              key={index}
            >
              Danh sách hồ sơ đến ({item.quantity} {item.name})
            </Typography.Text>
          ))}
          {isRoleMultipleAssignment && (
            <ButtonCustom
              type="primary"
              size="small"
              label="Phân giao"
              bgColor="#2862AF"
              textColor="#fff"
              className="btn-quick-assignment"
              onClick={handleAssignment}
              code={BUTTON_CODES.hsd_phan_giao}
              // disabled={selectedAppraisalFiles.length === 0}
            />
          )}
        </div>
        <TableCustomWithoutCustomSelection
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
            // console.log(params);
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
          rowSelection={isRoleMultipleAssignment ? rowSelection : undefined}
        />
        <QuickAssignmentModal
          isOpenModal={openAssignmentModal}
          closeModal={() => {
            setOpenAssignmentModal(false);
            mutate();
          }}
          onOk={() => {
            setSelectedRowKeys([]);
            setSelectedRowKeysCheck([]);
            setSelectedAppraisalFiles([]);
          }}
          companyBranchId={userInfo?.body?.companyBranchId}
          selectedAppraisalFiles={selectedAppraisalFiles}
        />
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
      </Card>
    </div>
  );
};

export default AppraisalFileReceiveTable;
