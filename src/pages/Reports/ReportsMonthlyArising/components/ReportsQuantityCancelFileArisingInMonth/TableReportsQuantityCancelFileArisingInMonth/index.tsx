import { Space, Tooltip, Typography } from "antd";
import TableCustom from "components/TableCustom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./style.scss";
import { defaultColumns } from "./config";
import {
  FilterQuantityCancelFileArisingInMonth,
  GetAllCommonType,
} from "constant/types";
import { LOCAL_STORAGE_KEY, PAGE_SIZE_OPTIONS } from "constant/enums";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { useRecordArise } from "utils/request/useRecordArise";
import { Link } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";

type Props = {
  filters: FilterQuantityCancelFileArisingInMonth;
  setFilters: (filters: FilterQuantityCancelFileArisingInMonth) => void;
};

const TableReportQuantityCancelFileArisingMonth: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [params, setParams] = useState<GetAllCommonType>({
    limit: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });

  const {
    data,
    isLoading,
  }: {
    data: any;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useRecordArise(params, filters, "cancel");

  const dataTable = data
    ? data.data &&
      data.data.map((item: any) => {
        return {
          ...item,
          customerName: item.customerName,
          addressAppraisal: item.appraisalAddress,
          climsCode:
            item.climsCodes && item.climsCodes[0] && item.climsCodes.join(", "),
          fileCode: item.reportCode,
          receiveDate:
            item.proposalDate &&
            new Date(item.proposalDate).toLocaleDateString("vi-VN") +
              " - " +
              new Date(item.proposalDate).toLocaleTimeString("vi-VN"),
          branchName: item.transOfficeName,
          dgv: item.staffName && item.staffName[0] && item.staffName.join(", "),
          email: item.resultEmail && item.resultEmail.replace(/;/g, "\n"),
          numberPhone: item.rmPhone,
          taxCode: item.taxCode,
          customerAddress: item.customerAddress,
          province: item.provinceName,
          status: item.filesStatus,
          cancelDate:
            item.cancelDate &&
            new Date(item.cancelDate).toLocaleDateString("vi-VN") +
              " - " +
              new Date(item.cancelDate).toLocaleTimeString("vi-VN"),
          refinanceNewLoan:
            item.appraisalTypeNames && item.appraisalTypeNames[0],
          feeTotal: item.feeTotal,
          businessFee: item.feeBusiness,
          feeOne: item.oneTimeFee,
          feeTwo: item.twoTimeFee,
          assetTotal: item.totalValue,
        };
      })
    : [];

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
        render: (text: any) => (
          <Tooltip title={text}>
            <div className="tooltip-text">{text}</div>
          </Tooltip>
        ),
      };
    }
    if (item.key === 11) {
      return {
        ...item,
        render: (text: any) => (
          <Tooltip title={text}>
            <div className="tooltip-text">{text}</div>
          </Tooltip>
        ),
      };
    }
    if (item.key === 3) {
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
    if (item.key === 4) {
      return {
        ...item,
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
      };
    }
    return { ...item };
  });

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
              <TableCustom
                dataSource={dataTable}
                columns={columns}
                bordered={true}
                isLoading={isLoading}
                limit={params.limit || PAGE_SIZE_OPTIONS.OPTION_10}
                total={data && data.total}
                onLimitChange={(limit) => {
                  setParams({ ...params, limit });
                }}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                page={params.page || 1}
                scroll={{ x: 3000, y: 500 }}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default TableReportQuantityCancelFileArisingMonth;
