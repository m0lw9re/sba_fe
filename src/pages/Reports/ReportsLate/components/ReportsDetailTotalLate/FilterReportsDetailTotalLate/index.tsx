import { DownOutlined } from "@ant-design/icons";
import { Col, DatePickerProps, Form, Row, Space, Typography } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterReportDetailTotalLate } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";

const { DATE_PICKER, SELECT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterReportDetailTotalLate;
  setFilters: (filters: FilterReportDetailTotalLate) => void;
};

const ReportDetailTotalLateFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [filterData, setFilterData] = useState<FilterReportDetailTotalLate>({ startDate: null, endDate: null });
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

  const globalState = useSelector((state: RootState) => state.globalSlice);

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Từ ngày",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.startDate ? dayjs(filterData.startDate) : null,
      disabledDate: (value: any) => {
        return disabledStartDate(value, filterData?.endDate || "");
      },
      onChange: (value: DatePickerProps["value"]) =>
        setFilterData({
          ...filterData,
          startDate: dayjs(value).toISOString() || null,
        }),
      allowClear: true,
    },
    {
      key: 2,
      label: "Đến ngày",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.endDate ? dayjs(filterData.endDate) : null,
      disabledDate: (value: any) => {
        return disabledEndDate(value, filterData?.startDate || "");
      },
      onChange: (value: DatePickerProps["value"]) =>
        setFilterData({
          ...filterData,
          endDate: dayjs(value).toISOString() || null,
        }),
      allowClear: true,
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
        setFilterData({ ...filterData, regionCode: value}),
    },
    {
      key: 4,
      label: "Đơn vị định giá",
      type: SELECT,
      options: globalState.branchOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.appraisalUnit || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering:true,
          appraisalUnit: value,

        }));
      },
    },
    {
      key: 5,
      label: "",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
                        setFilters({ startDate: null, endDate: null });
                        setFilterData({ startDate: null, endDate: null });
                      }}
                    />
                    <ButtonCustom
                      className="btn-search"
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => {
                        setFilters({ ...filterData });
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

export default ReportDetailTotalLateFilter;
