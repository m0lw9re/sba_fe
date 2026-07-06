import { DownOutlined } from "@ant-design/icons";
import { DatePickerProps, Form, Row, Space, Typography, message } from "antd";
import { categoryApi } from "apis/category";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterChartReportKPI, KPIsByGroup } from "constant/types";
import { KPIType } from "constant/types/kpi";
import { Staff } from "constants/types/common.type";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { useStaffByRole } from "utils/request";

const { DATE_PICKER, SELECT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterChartReportKPI;
  defaultFilter: FilterChartReportKPI;
  setFilters: (filters: FilterChartReportKPI) => void;
};

const ReportKPISFilter: React.FC<Props> = ({
  filters,
  defaultFilter,
  setFilters,
}) => {
  const [filterData, setFilterData] =
    useState<FilterChartReportKPI>(defaultFilter);

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

  const { data: dataStaff, isLoading, error, mutate } = useStaffByRole("CVTD");

  const listStaff = dataStaff?.filter((staff: any) => staff.belongs === 1);

  const [groupKPI, setGroupKPI] = useState<KPIsByGroup[]>([]);

  const getGroupKPI = async () => {
    try {
      const res = await categoryApi.getGroupKPI({
        page: 1,
        limit: 1000,
      });
      setGroupKPI(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroupKPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      label: "Đạt/Không đạt KPIs",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: [
        {
          label: "Đạt",
          value: "true",
        },
        {
          label: "Không đạt",
          value: "false",
        },
      ],
      // Không set giá trị mặc định
      value: filterData.isPass,
      onChange: (value: number) =>
        setFilterData({ ...filterData, isPass: value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
    {
      key: 4,
      label: "Năm",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: Array.from(
        { length: new Date().getFullYear() - 2023 + 1 },
        (_, index) => {
          const year = 2023 + index;
          return {
            label: `Năm ${year}`,
            value: `${year}`,
          };
        }
      ),
      value: filterData.year,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          year: value,
        }));
      },
      allowClear: true,
      disable: filterData.dateFrom || filterData.dateTo ? true : false,
    },
    {
      key: 5,
      label: "Tháng",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: [
        {
          label: "Tháng 1",
          value: "1",
        },
        {
          label: "Tháng 2",
          value: "2",
        },
        {
          label: "Tháng 3",
          value: "3",
        },
        {
          label: "Tháng 4",
          value: "4",
        },
        {
          label: "Tháng 5",
          value: "5",
        },
        {
          label: "Tháng 6",
          value: "6",
        },
        {
          label: "Tháng 7",
          value: "7",
        },
        {
          label: "Tháng 8",
          value: "8",
        },
        {
          label: "Tháng 9",
          value: "9",
        },
        {
          label: "Tháng 10",
          value: "10",
        },
        {
          label: "Tháng 11",
          value: "11",
        },
        {
          label: "Tháng 12",
          value: "12",
        },
      ],
      value: filterData.month,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          month: value,
        }));
      },
      allowClear: true,
      disable: filterData.dateFrom || filterData.dateTo ? true : false,
    },
    {
      key: 6,
      label: "Nhóm",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: groupKPI
        ? groupKPI?.map((item: KPIType) => ({
            label: item.kpiGroupName,
            value: item.kpiGroupId,
          }))
        : [],
      value: filterData.groupKpiId,
      onChange: (value: string) =>
        setFilterData({ ...filterData, groupKpiId: value }),
    },
    {
      key: 7,
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
    },
    {
      key: 8,
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

export default ReportKPISFilter;
