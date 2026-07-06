import { Button, Card, Row, Space, Spin, Tooltip, message } from "antd";
import { ColumnsType } from "antd/es/table";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import {
  FilterAccountantFeeNotificationsUpdate,
  GetAllCommonType,
} from "constant/types";
import { FeeNotificationType } from "constant/types/appraisalFilesDetail";
import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ACCOUNTANT_DEBT_DETAIL,
  ACCOUNTANT_MANUAL_EDIT,
  ACCOUNTANT_MANUAL_EDIT_DETAIL,
} from "routes/route.constant";
import { useGetAllFeeNotifications } from "utils/request/useFeeNotifications";
import FeeContentTable from "./FeeContentTable";
import { CommonGetAllParams } from "constants/types/common.type";
import "./style.scss";
import { FeeContentType } from "constant/types/appraisalFilesDetail";
import {
  debtStatusOptions,
  priceOptions,
  debtOptions,
} from "constant/types/fee";
import { syncEMSApi } from "apis/syncEMS";
import "./style.scss";
import Icons from "assets/icons";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { isNotAllowed } from "utils/permission";
import { BUTTON_CODES } from "constant/common";

type Props = {
  filters: FilterAccountantFeeNotificationsUpdate;
  setFilters: (filters: FilterAccountantFeeNotificationsUpdate) => void;
};

const Table: React.FC<Props> = ({ filters, setFilters }) => {
  const navigate = useNavigate();
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  const prevParamsRef = useRef<CommonGetAllParams>(params);

  const accountantDebtDetailState = useSelector(
    (state: RootState) => state.accountantDebtDetailSlice
  );

  // API gọi filter
  // const { data, isLoading } = useGetAllFeeNotificationsInFollowList({
  //   page: params.page,
  //   limit: params.limit,
  // });
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const { data, isLoading, error, mutate } = useGetAllFeeNotifications({
    ...params,
    ...filters,
  });

  const [exporting, setExporting] = useState(false);

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleExpandRow = (expanded: boolean, record: any) => {
    if (expanded) {
      setExpandedRowKeys((prevKeys) => [...prevKeys, record.key]);
    } else {
      setExpandedRowKeys((prevKeys) =>
        prevKeys.filter((key) => key !== record.key)
      );
    }
  };

  const handleRowClick = (record: any) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY.PAGE_PARAMS,
      JSON.stringify({ limit: params.limit, page: params.page })
    );

    navigate(
      ACCOUNTANT_MANUAL_EDIT_DETAIL.replace(":id", record?.appraisalFileId),
      {
        state: {
          appraisalFileId: record?.appraisalFileId,
          feeNotificationId: record?.feeNotificationId,
        },
      }
    );
  };

  const columns: ColumnsType<FeeNotificationType> = [
    {
      key: "1",
      title: "STT",
      dataIndex: "stt",
      align: "center",
      width: "4%",
      render: (_: any, record: any, index: number) => {
        return (Number(params.page) - 1) * Number(params.limit) + index + 1;
      },
    },
    {
      key: 2,
      title: "Số tờ trình",
      dataIndex: "reportCode",
      width: "12%",
      render: (_: any, record: any, index: number) => (
        <span
          onClick={() => handleRowClick(record)}
          style={{
            textDecoration: "underline",
            color: "#1677ff",
            cursor: "pointer",
          }}
        >
          {record.reportCode}
        </span>
      ),
    },
    {
      key: 3,
      title: "Mã đề nghị",
      dataIndex: "proposalCode",
      width: "10%",
    },
    {
      key: 4,
      title: "CVTĐ",
      dataIndex: "whoCreate",
      width: "250px",
      render: (text: any) => {
        return text && text.replace(/,/g, "\n");
      },
    },
    {
      key: 5,
      title: "Chi nhánh/PGD",
      dataIndex: ["branch", "branchName"],
      width: "14%",
      render: (_: any, record: any, index: number) => {
        return record.transOffice.transOfficeName;
      },
    },
    {
      key: 6,
      title: "Tên khách hàng",
      dataIndex: "fullName",
      width: "14%",
    },
    {
      key: 7,
      title: "Địa chỉ tài sản",
      dataIndex: "addressAsset",
      width: "14%",
      render: (text: any) => (
        <Tooltip title={text}>
          <div className="tooltip-text">{text}</div>
        </Tooltip>
      ),
    },
    {
      key: 8,
      title: "Số tiền phí",
      dataIndex: "totalPrice",
      width: "8%",
      align: "right",
    },
    {
      key: 9,
      title: "Công nợ",
      dataIndex: "debtTotal",
      width: "8%",
      align: "right",
      // render: (_: any, record: any, index: number) => {
      //   return (
      //     record &&
      //     record.feeContents
      //       .filter(
      //         (item: any) =>
      //           (item.contentId === 3 &&
      //             (item.received > 0 || item.statusEms === 3)) ||
      //           (item.contentId === 1 &&
      //             (item.received > 0 || item.statusEms === 3))
      //       )
      //       .reduce((sum: any, cur: any) => sum + cur.congNo, 0) +
      //       record.feeContents
      //         .filter(
      //           (item: any) =>
      //             item.contentId === 2 &&
      //             (item.received > 0 || item.statusEms === 3)
      //         )
      //         .reduce((sum: any, cur: any) => sum + cur.congNo, 0)
      //   ).toLocaleString("vi-VN");
      // },
    },
    {
      key: 10,
      title: "Đã thu",
      dataIndex: "daThuTotal",
      width: "8%",
      align: "right",
    },
    // {
    //   key: 5,
    //   title: 'Ngày thông báo',
    //   dataIndex: 'dateNotification',
    //   align: 'center',
    //   width: '12%',
    //   render: (value: string) => {
    //     return value ? dayjs(value).format(DATE_TIME_FORMAT.day) : '-';
    //   },
    // },
    // {
    //   key: 6,
    //   title: "CCCD/MST",
    //   dataIndex: "mst",
    //   width: "12%",
    // },
    // {
    //   key: 7,
    //   title: "Chi nhánh STB",
    //   dataIndex: ["branch", "branchName"],
    //   width: "33%",
    // },
    // {
    //   key: "action",
    //   title: "Hành động",
    //   dataIndex: "action",
    //   width: "6%",
    //   align: "center",
    //   fixed: "right",
    //   render: (_: any, record: any) => (
    //     <>
    //       <ListButtonActionUpdate viewFunction={() => handleRowClick(record)} />
    //     </>
    //   ),
    // },
  ];

  useEffect(() => {
    if (filters.isFiltering) {
      setParams({ ...params, page: 1 });
      setFilters({
        ...filters,
        isFiltering: false,
      });
      setExpandedRowKeys([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // let filteredData = useMemo(() => {
  //   if (data !== null) {
  //     const filteredData =
  //       data &&
  //       data.filter((item: any) => {
  //         // Lọc theo chi nhánh
  //         if (filters.branchName && item.branchCode !== filters.branchName) {
  //           return false;
  //         }

  //         // Lọc theo statusId
  //         // eslint-disable-next-line eqeqeq
  //         if (filters.statusId && item.status != filters.statusId) {
  //           return false;
  //         }

  //         // Lọc theo role
  //         if (filters.whoCreate && item.whoCreate !== filters.whoCreate) {
  //           return false;
  //         }

  //         // Lọc theo số tờ trình
  //         if (
  //           filters.reportCode &&
  //           !item.reportCode
  //             .toLowerCase()
  //             .includes(filters.reportCode.toLowerCase())
  //         ) {
  //           return false;
  //         }

  //         // Lọc theo mã đề nghị
  //         if (
  //           filters.proposalCode &&
  //           !item.proposalCode
  //             .toLowerCase()
  //             .includes(filters.proposalCode.toLowerCase())
  //         ) {
  //           return false;
  //         }

  //         // Lọc theo startDate
  //         if (filters.startDate) {
  //           const startDate = new Date(filters.startDate);
  //           const itemDate = new Date(item.dateCreate);
  //           if (startDate >= itemDate) {
  //             return false;
  //           }
  //         }

  //         // Lọc theo endDate
  //         if (filters.endDate) {
  //           const endDate = new Date(filters.endDate);
  //           const itemDate = new Date(item.dateCreate);
  //           if (endDate <= itemDate) {
  //             return false;
  //           }
  //         }

  //         // Lọc theo đã thu
  //         // eslint-disable-next-line eqeqeq
  //         if (filters.daThu) {
  //           const daThuTotal = item.feeContents.reduce(
  //             (sum: any, feeContent: any) => sum + feeContent.daThu,
  //             0
  //           );
  //           if (filters.daThu === 1) {
  //             return daThuTotal > 0;
  //           } else {
  //             return daThuTotal <= 0;
  //           }
  //         }

  //         // Lọc theo công nợ
  //         // eslint-disable-next-line eqeqeq
  //         if (filters.congNo) {
  //           const priceRange = debtOptions[filters.congNo];
  //           let minPrice: number | null = 0;
  //           let maxPrice: number | null = 0;

  //           const debt = item.feeContents.reduce(
  //             (sum: any, feeContent: any) => sum + feeContent.congNo,
  //             0
  //           );

  //           if (priceRange.value === "9") {
  //             maxPrice = 5000000000;
  //             minPrice = null;
  //             return maxPrice <= debt;
  //           } else {
  //             const priceValues = priceRange.label.split(" - ");
  //             if (priceValues.length === 2) {
  //               minPrice = parseInt(priceValues[0].replace(/\D/g, ""));
  //               maxPrice = parseInt(priceValues[1].replace(/\D/g, ""));
  //               return minPrice <= debt && debt <= maxPrice;
  //             }
  //           }
  //         }

  //         // Lọc theo price
  //         // eslint-disable-next-line eqeqeq
  //         if (filters.price) {
  //           const priceRange = priceOptions[filters.price];
  //           let minPrice: number | null = 0;
  //           let maxPrice: number | null = 0;

  //           const totalPrice = item.feeContents.reduce(
  //             (sum: any, feeContent: any) => sum + feeContent.totalPrice,
  //             0
  //           );

  //           if (priceRange.value === "9") {
  //             maxPrice = 5000000000;
  //             minPrice = null;
  //             return maxPrice <= totalPrice;
  //           } else {
  //             const priceValues = priceRange.label.split(" - ");
  //             if (priceValues.length === 2) {
  //               minPrice = parseInt(priceValues[0].replace(/\D/g, ""));
  //               maxPrice = parseInt(priceValues[1].replace(/\D/g, ""));
  //               return minPrice <= totalPrice && totalPrice <= maxPrice;
  //             }
  //           }
  //         }

  //         return true;
  //       });

  //     return filteredData;
  //   } else {
  //     return [];
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filters, params]);

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

    setExpandedRowKeys([]);

    // if (params && params.page && params.limit) {
    //   setExpandedRowKeys([]);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const calculateTotalPrice = (feeContents: any) => {
    let totalPrice = 0;
    let stautsFeeReported = 1; //Đã báo phí
    let statusWaitFeeReportedStatus = 0; //Chờ báo phí

    feeContents.forEach((item: any) => {
      if (
        item.status === stautsFeeReported ||
        item.status === statusWaitFeeReportedStatus
      ) {
        totalPrice += item.totalPrice || 0;
      }
    });

    return totalPrice.toLocaleString("vi-VN");
  };

  const calculateDebtTotal = (feeContents: any) => {
    let debtTotal = 0;

    feeContents.forEach((item: any) => {
      debtTotal += item.congNo || 0;
    });

    return debtTotal.toLocaleString("vi-VN");
  };

  const syncEMS = async () => {
    try {
      setExporting(true);
      let res = await syncEMSApi.syncEMS({
        options: 1,
        clientId: null,
        issuedInvoiceOnly: false,
        paidOnly: false,
      });
      if (res?.data?.code === 200) {
        message.success(`Đồng bộ từ EMS thành công!`);
      } else {
        message.error(res?.data?.message || `Đồng bộ từ EMS thất bại!`);
      }
    } catch (error) {
      message.error(`Lỗi! Đồng bộ từ EMS thất bại!`);
    } finally {
      setExporting(false);
    }
  };

  const calculateDaThuTotal = (feeContents: any) => {
    let daThuTotal = 0;

    feeContents.forEach((item: any) => {
      daThuTotal += item.daThu || 0;
    });

    return daThuTotal.toLocaleString("vi-VN");
  };

  return (
    <Card className="account-debt-follow-card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalCreateCategoryRiskModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Danh sách theo dõi doanh thu, công nợ" />
          <Button
            type="primary"
            loading={exporting}
            onClick={() => {
              syncEMS();
            }}
            style={{
              background: "#ff4d4f",
              marginBottom: "7px",
              // color: "#fff",
            }}
            icon={<Icons.reload />}
            // icon={
            //   exporting && (
            //     <div className="spin-overlay">
            //       <Spin className="spin" />
            //     </div>
            //   )
            // }
            className={`button-Report ${exporting ? "exporting" : ""}`}
            disabled={
              exporting ||
              isNotAllowed(
                currentPagePermissions,
                BUTTON_CODES.sptc_dong_bo_ems
              )
            }
          >
            Đồng bộ từ EMS
          </Button>
        </Row>
      </div>
      <TableCustom
        scroll={{ x: 1366, y: 380 }}
        dataSource={
          data?.data
            ?.map((item: any, i: number) => ({
              ...item,
              key: i,
              totalPrice: calculateTotalPrice(item.feeContents),
              debtTotal: calculateDebtTotal(item.feeContents),
              daThuTotal: calculateDaThuTotal(item.feeContents),
            }))
            .sort((a: any, b: any) => {
              const dateA = new Date(a.dateCreate);
              const dateB = new Date(b.dateCreate);
              return dateB.getTime() - dateA.getTime();
            }) || []
        }
        isLoading={!data && isLoading}
        total={data ? data.total : 0}
        columns={columns}
        bordered={true}
        limit={params.limit || 10}
        page={params.page || 1}
        onLimitChange={(limit) => {
          setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
        expandable={{
          columnWidth: 40,
          expandRowByClick: true,
          indentSize: 0,
          expandedRowKeys: expandedRowKeys,
          expandedRowRender: (record: any) => (
            <FeeContentTable feeContent={record.feeContents} />
          ),
          onExpand: handleExpandRow,
        }}
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (e) => handleRowClick(record),
          };
        }}
      />
    </Card>
  );
};

export default Table;
