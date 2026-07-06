import { DownOutlined } from "@ant-design/icons";
import { Col, DatePickerProps, Form, Row, Space, Typography } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterTotalReportDebt } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";

const { DATE_PICKER, SELECT, INPUT_NUMBER } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterTotalReportDebt;
  setFilters: (filters: FilterTotalReportDebt) => void;
};

const DebtReportsFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] = useState<FilterTotalReportDebt>({
    dateFrom: null,
    dateTo: null,
  });

  const globalState = useSelector((state: RootState) => state.globalSlice);

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilters({
        ...filters,
        ...value,
      });
    };
    const timer = setTimeout(() => {
      handleDebouncedChange(filterData);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Từ ngày",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: DATE_PICKER,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.dateFrom ? dayjs(filterData.dateFrom) : null,
      allowClear: true,
      disabledDate: (value: any) => {
        // Không vô hiệu hóa ngày nếu endDate chưa được chọn
        return filterData.dateTo
          ? disabledStartDate(value, filterData?.dateTo)
          : false;
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData({
          ...filterData,
          dateFrom: value ? dayjs(value).format("YYYY-MM-DD") : null,
        });
      },
    },
    {
      key: 2,
      label: "Đến ngày",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: DATE_PICKER,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.dateTo ? dayjs(filterData.dateTo) : null,
      allowClear: true,
      disabledDate: (value: any) => {
        // Không vô hiệu hóa ngày nếu startDate chưa được chọn
        return filterData.dateFrom
          ? disabledEndDate(value, filterData?.dateFrom)
          : false;
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData({
          ...filterData,
          dateTo: value ? dayjs(value).format("YYYY-MM-DD") : null,
        });
      },
    },
    {
      key: 3,
      label: "Khu vực",
      css: css,
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.regionCode,
      options: globalState.regionOptions,
      onChange: (value: string) =>
        setFilterData({ ...filterData, regionCode: value }),
    },
    {
      key: 4,
      label: "Chi nhánh SBA",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.companyBranchId,
      options: globalState.branchOptions,
      onChange: (value: number) =>
        setFilterData({ ...filterData, companyBranchId: value }),
    },
    {
      key: 5,
      label: "Đơn vị định giá",
      type: SELECT,
      options: globalState.branchOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.companyBranch || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          companyBranch: value,
        }));
      },
    },
    {
      key: 6,
      label: "Công nợ Phí Đợt 2 chưa xác nhận",
      type: INPUT_NUMBER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.unConfirmDebtTwo || null,
      allowClear: true,
      min: 0,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          unConfirmDebtTwo: value,
        }));
      },
    },
    {
      key: 7,
    },
    {
      key: 8,
    },
  ];

  return (
    <CollapseCustom
      expandIcon={({ isActive }) => (
        <Space>
          <Typography style={{ color: "#2862af" }}>
            {isActive ? "Ẩn tìm kiếm" : "Hiển thị tìm kiếm"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{ color: "#2862af" }}
          />
        </Space>
      )}
      itemList={[
        {
          label: "Tìm kiếm",
          forceRender: true,
          children: (
            <Form labelAlign="left" labelWrap size="small">
              <Row gutter={[16, 4]}>
                <InputFields data={inputSearchBasic} />
                <Col
                  xs={css.xs}
                  lg={css.lg}
                  xl={css.xl}
                  style={{
                    justifyContent: "end",
                    display: "flex",
                  }}
                >
                  <Space>
                    <ButtonCustom
                      className="btn-del"
                      label="Xóa"
                      onClick={() => {
                        setFilters({ dateFrom: null, dateTo: null });
                        setFilterData({ dateFrom: null, dateTo: null });
                      }}
                    />
                    <ButtonCustom
                      className="btn-search"
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => {
                        setFilters({
                          ...filterData,
                          dateFrom: filterData.dateFrom
                            ? dayjs(filterData.dateFrom).format("YYYY-MM-DD")
                            : null,
                          dateTo: filterData.dateTo
                            ? dayjs(filterData.dateTo).format("YYYY-MM-DD")
                            : null,
                        });
                      }}
                    />
                  </Space>
                </Col>
              </Row>
            </Form>
          ),
        },
      ]}
    />
  );
};

export default DebtReportsFilter;
