import { DownOutlined } from "@ant-design/icons";
import { Col, Form, Row, Space, Typography, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { FilterReportDetailKPIInMonth } from "constant/types";
import { Staff } from "constants/types/common.type";
import { InputFiledParams } from "constants/types/Form_Field_type";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useKpiGroup, useStaffByRole } from "utils/request";

const { SELECT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterReportDetailKPIInMonth;
  defaultFilter: FilterReportDetailKPIInMonth;
  setFilters: (filters: FilterReportDetailKPIInMonth) => void;
};

const KPISMonthReportFilter: React.FC<Props> = ({
  defaultFilter,
  filters,
  setFilters,
}) => {
  const [filterData, setFilterData] =
    useState<FilterReportDetailKPIInMonth>(defaultFilter);
  const { data: kpiGroups } = useKpiGroup(
    {
      page: 1,
      limit: 99999,
    },
    {}
  );

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

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
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
    },
    {
      key: 2,
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
      value: filterData.month || String(new Date().getMonth() + 1), // Đặt giá trị mặc định là tháng hiện tại
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          month: value,
        }));
      },
      allowClear: true,
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
      value: filterData.isCompleteKpi,
      onChange: (value: number) =>
        setFilterData({ ...filterData, isCompleteKpi: value }),
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
      value: filterData.StaffId || null,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          StaffId: value,
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

export default KPISMonthReportFilter;