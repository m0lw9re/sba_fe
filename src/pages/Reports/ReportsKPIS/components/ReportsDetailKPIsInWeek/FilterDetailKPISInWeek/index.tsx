import { DownOutlined } from "@ant-design/icons";
import {
  Col,
  DatePickerProps,
  Form,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterReportDetailKPIInWeek } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Staff } from "constants/types/common.type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { useKpiGroup, useStaffByRole } from "utils/request";

const { DATE_PICKER, SELECT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  defaultFilter: FilterReportDetailKPIInWeek;
  filters: FilterReportDetailKPIInWeek;
  setFilters: (filters: FilterReportDetailKPIInWeek) => void;
};

const KPISWeekReportFilter: React.FC<Props> = ({
  filters,
  setFilters,
  defaultFilter,
}) => {
  const [filterData, setFilterData] =
    useState<FilterReportDetailKPIInWeek>(defaultFilter);

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

  const { data: dataStaff } = useStaffByRole("CVTD");

  const listStaff = dataStaff?.filter((staff: any) => staff.belongs === 1);
  const { data: kpiGroups } = useKpiGroup(
    {
      page: 1,
      limit: 99999,
    },
    {}
  );
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
      label: "Nhóm",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options:
        kpiGroups?.data?.map((item: any) => ({
          label: item.kpiGroupName,
          value: item.kpiGroupId,
        })) || [],
      value: filterData.groupKpiId,
      onChange: (value: number) =>
        setFilterData({ ...filterData, groupKpiId: value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
    {
      key: 4,
      label: "Tỷ lệ TH/KH",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: [
        {
          label: "< 25%",
          value: "0",
        },
        {
          label: "< 50%",
          value: "1",
        },
        {
          label: "< 75%",
          value: "2",
        },
        {
          label: "< 100%",
          value: "3",
        },
        {
          label: ">= 100%",
          value: "4",
        },
      ],
      value: filterData.percent,
      onChange: (value: string) =>
        setFilterData({ ...filterData, percent: value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
    {
      key: 5,
      label: "Thẩm định viên",
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: listStaff
        ? listStaff.map((item: Staff) => ({
            label: item.staffName,
            value: item.staffId,
          }))
        : [],
      css: css,
      showSearch: true,
      value: filterData.staffId || null,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          staffId: value,
        }));
      },
      allowClear: true,
      placeholder: "Chọn hoặc nhập tên thẩm định viên",
    },
    {
      key: 6,
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
          appraisalUnit: value,
        }));
      },
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
              </Row>
              <Space
                style={{
                  display: "flex",
                  justifyContent: "end",
                  paddingTop: "4px",
                }}
              >
                <ButtonCustom
                  className="btn-del"
                  label="Xóa"
                  onClick={() => {
                    setFilters(defaultFilter);
                    setFilterData(defaultFilter);
                  }}
                />
                <ButtonCustom
                  label="Tìm kiếm"
                  bgColor="#2862AF"
                  type="primary"
                  onClick={() => {
                    setFilters({ ...filterData });
                  }}
                />
              </Space>
            </Form>
          ),
        },
      ]}
    />
  );
};

export default KPISWeekReportFilter;