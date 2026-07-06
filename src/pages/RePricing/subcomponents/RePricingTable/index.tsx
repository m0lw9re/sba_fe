import { Card, Popconfirm, Space, Tooltip, Typography, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { appraisalFilesApi } from "apis/appraisalFiles";
import ButtonCustom from "components/ButtonCustom";
import TableCustomWithoutCustomSelection from "components/TableRoles";
import { APPRAISAL_FILE_STATUS, BUTTON_CODES, ROLES } from "constant/common";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import {
  AppraisalFileType,
  FilterAppraisalFileType,
} from "constant/types/appraisalFile";
import { CommonGetAllParams } from "constants/types/common.type";
import "pages/AppraisalFilesReceive/subcomponents/AppraisalFileReceiveTable/style.scss";
import ComponentsError from "pages/ComponentsError";
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
import { formatDateWithHour, numberUtils } from "utils";
import { isContainRole, renderAppraisalFilesTableByRole } from "utils/common";
import { useAppraisalFilesRePricing } from "utils/request";
import { renderAppraisalStatus } from "utils/string";

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
  const [params, setParams] = useState<CommonGetAllParams>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const prevParamsRef = useRef<CommonGetAllParams>(params);

  const [selectedAppraisalFiles, setSelectedAppraisalFiles] = useState<
    string[]
  >([]);
  const [selectedReportCodes, setSelectedReportCodes] = useState<string[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);

  const { data, isLoading, error, mutate } = useAppraisalFilesRePricing(
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
    }
  );

  const dataTable = useMemo(() => {
    if (!data) return [];
    return data?.data?.map((item: AppraisalFileType) => ({
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
    setSelectedReportCodes(
      newSelectedRowKeys.map((key: React.Key) => {
        const appraisalFile = dataTable?.find(
          (item: AppraisalFileType) => item.key === key
        );
        return appraisalFile?.reportCode || "";
      })
    );
  };

  const handleCheckIsDisableRow = (record: AppraisalFileType) => {
    return false;
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
      return {
        disabled: handleCheckIsDisableRow(record),
      };
    },
    columnWidth: "35px",
  };

  useEffect(() => {
    if (filters.isFiltering) {
      setParams({ ...params, page: 1 });
      setFilters({
        ...filters,
        isFiltering: false,
      });
      setSelectedRowKeys([]);
      setSelectedRowKeysCheck([]);
    }
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
        label: "Hồ sơ tái định giá",
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
      key: 2,
      title: "Số tờ trình",
      dataIndex: "reportCode",
      width: "170px",
      sorter: true,
      showSorterTooltip: false,
      render: (reportCode, record, index) => {
        const color =
          record.fileStatus === 20 && record.sendToEmail === 1
            ? "#38761D"
            : record.fileStatus === 20
            ? "#FFA500"
            : "#1677ff";
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
      title: "Giá trị tài sản",
      dataIndex: "totalValueRoundedApprovaled",
      showSorterTooltip: false,
      width: "150px",
      align: "right",
      render: (totalValueRoundedApprovaled) => {
        return numberUtils.formatNumber(totalValueRoundedApprovaled);
      },
    },

    {
      key: 5,
      title: "Địa chỉ/Tên tài sản",
      dataIndex: "address",
      width: "180px",
      render: (text, _, index) => (
        <Tooltip title={text} key={index}>
          <div className="inline-text">{text}</div>
        </Tooltip>
      ),
    },
    {
      key: 6,
      title: "Tên khách hàng",
      render: (_, record, index) => {
        const customerName = record?.customer?.customerName;
        return (
          <Tooltip title={customerName} key={index}>
            <div className="inline-text">{customerName}</div>
          </Tooltip>
        );
      },
      width: "130px",
    },
    {
      key: 7,
      title: "Ngày duyệt",
      dataIndex: "proposalDate",
      render: (value: string) => {
        return value ? formatDateWithHour(value) : "";
      },
      width: "160px",
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
      title: "Người gửi",
      dataIndex: "rmName",
      width: "150px",
    },
    {
      key: 10,
      title: "Luồng",
      dataIndex: "flowId",
      render: (_, record) => record.flow?.flowName,
      sorter: false,
      width: "120px",
    },
    {
      key: 11,
      title: "Trạng thái",
      dataIndex: "fileStatus",
      width: "150px",
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
        </Space>
      ),
    },
    {
      key: 12,
      title: "Thao tác",
      width: "150px",
      fixed: "right",
      align: "center",
      render: (status, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Popconfirm
            className="danger-confirm"
            title={`Bạn có chắc chắn muốn định giá lại hồ sơ có mã tờ trình ${
              record?.reportCode || "-"
            } này không?`}
            onConfirm={() => handleRePricing(record)}
            okText={"Xác nhận"}
            cancelText={"Huỷ"}
          >
            <ButtonCustom
              code={BUTTON_CODES.tdg_tai_dinh_gia}
              type="primary"
              size="small"
              label="Tái định giá"
              bgColor="#2862AF"
              textColor="#fff"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleRePricing = async (record: AppraisalFileType) => {
    try {
      const appraisalFileId: string = record.appraisalFileId;

      const res = await appraisalFilesApi.rePricing([appraisalFileId]);

      if (res.data.code === 200) {
        message.success(`Tái định giá hồ sơ ${record.reportCode} thành công!`);
        navigate(APPRAISAL_FILES_RECEIVE);
        // mutate();
      } else {
        message.error(res?.data?.message || "Tái định giá không thành công!");
      }
    } catch (err) {
      console.log(err);
      message.error("Lỗi không xác định, Tái định giá không thành công!");
    }
  };

  const handleRePricingMulti = async () => {
    try {
      if (selectedAppraisalFiles.length < 2) return;

      const res = await appraisalFilesApi.rePricing([
        ...selectedAppraisalFiles,
      ]);

      if (res.data.code === 200) {
        const resultArr = res.data?.data || [];
        const nofFalse = resultArr.filter((el: any) => !el).length;
        const nofTrue = resultArr.filter((el: any) => el).length;

        if (!nofFalse) {
          message.success(`Tái định giá ${nofTrue} hồ sơ thành công!`);
          navigate(APPRAISAL_FILES_RECEIVE);
        } else if (nofFalse && nofFalse < resultArr.length) {
          message.success(
            `Tái định giá ${nofTrue}/${resultArr.length} hồ sơ thành công!`
          );
          message.error(
            `Tái định giá ${nofTrue}/${resultArr.length} hồ sơ không thành công!`
          );
        } else {
          message.error(`Tái định giá ${nofFalse} hồ sơ không thành công!`);
        }
        setSelectedAppraisalFiles([]);
        setSelectedReportCodes([]);

        // mutate();
      } else {
        message.error(res?.data?.message || "Tái định giá không thành công!");
      }
    } catch (err) {
      console.log(err);
      message.error("Lỗi không xác định, Tái định giá không thành công!");
    }
  };

  // if (!username) {
  //   message.error("Có lỗi xảy ra. Vui lòng thử lại");
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
              Danh sách hồ sơ tái định giá ({item.quantity} {item.name})
            </Typography.Text>
          ))}
          {isRoleMultipleAssignment && (
            <Popconfirm
              className="danger-confirm"
              title={`Bạn có chắc chắn muốn định giá lại các hồ sơ có mã tờ trình ${selectedReportCodes.join(
                ", "
              )} này không?`}
              onConfirm={() => handleRePricingMulti()}
              okText={"Xác nhận"}
              cancelText={"Huỷ"}
            >
              <ButtonCustom
                type="primary"
                size="small"
                label="Tái định giá tất cả"
                bgColor="#2862AF"
                textColor="#fff"
                code={BUTTON_CODES.tdg_tai_dinh_gia}
                className="btn-quick-assignment"
                disabled={selectedAppraisalFiles.length < 2}
              />
            </Popconfirm>
          )}
        </div>
        <TableCustomWithoutCustomSelection
          dataSource={dataTable}
          columns={renderAppraisalFilesTableByRole(columns)}
          bordered={true}
          isLoading={!data && isLoading}
          limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
          total={data ? data?.total : 0}
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
      </Card>
    </div>
  );
};

export default AppraisalFileReceiveTable;
