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
import { RootState } from "configs/configureStore";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterReportCompletedFileDetail } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Staff } from "constants/types/common.type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { useStaffByRole } from "utils/request";

const { DATE_PICKER, SELECT, INPUT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterReportCompletedFileDetail;
  setFilters: (filters: FilterReportCompletedFileDetail) => void;
};

const ReportCompletedFileDetailFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [filterData, setFilterData] = useState<FilterReportCompletedFileDetail>(
    { dateFrom: null, dateTo: null }
  );

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

  const {
    data: dataStaff,
    isLoading: isLoadingStaff,
    error: errorStaff,
    mutate: mutateStaff,
  } = useStaffByRole("CVTD");

  const listStaff = dataStaff?.filter((staff: any) => staff.belongs === 1);

  const globalState = useSelector((state: RootState) => state.globalSlice);

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
        if (filterData?.dateTo) {
          return disabledStartDate(value, filterData.dateTo);
        }
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
        if (filterData?.dateFrom) {
          return disabledEndDate(value, filterData.dateFrom);
        }
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
      label: "Tỉnh/Thành phố",
      type: SELECT,
      options: globalState.provinceOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      showSearch: true,
      value: filterData.addressProvince || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData({ ...filterData, addressProvince: value });
      },
    },
    {
      key: 4,
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
          isFiltering: true,
        }));
      },
      allowClear: true,
      placeholder: "Chọn hoặc nhập tên thẩm định viên",
    },
    {
      key: 5,
      label: "Chi nhánh",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.branchCode,
      options: globalState.companyBranchOptions,
      onChange: (value: any) => {
        setFilterData({ ...filterData, branchCode: value });
      },
    },
    {
      key: 6,
      label: "Phòng GD",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.transOfficeCode,
      options: globalState.transOfficeOptions,
      onChange: (value: any) => {
        setFilterData({ ...filterData, transOfficeCode: value });
      },
    },
    {
      key: 7,
      label: "Tên khách hàng",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.customerName,
      onChange: (e: any) =>
        setFilterData({ ...filterData, customerName: e.target.value }),
    },
    {
      key: 8,
      label: "Thời gian khảo sát từ",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      formatDatetime: "YYYY-MM-DD",
      value: filterData.surveyFrom ? dayjs(filterData.surveyFrom) : null,
      onChange: (value: DatePickerProps["value"]) =>
        setFilterData({
          ...filterData,
          surveyFrom: value
            ? (dayjs(value).format("YYYY-MM-DD") as string)
            : null,
        }),
    },
    {
      key: 9,
      label: "Thời gian khảo sát đến",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      formatDatetime: "YYYY-MM-DD",
      value: filterData.surveyTo ? dayjs(filterData.surveyTo) : null,
      onChange: (value: DatePickerProps["value"]) => {
        const surveyTo = dayjs(value).valueOf();
        if (
          filterData.dateFrom &&
          surveyTo <= dayjs(filterData.surveyFrom).valueOf()
        ) {
          message.error("Thời gian đến ngày phải lớn hơn thời gian từ ngày");
        } else {
          setFilterData({
            ...filterData,
            surveyTo: value
              ? (dayjs(value).format("YYYY-MM-DD") as string)
              : null,
          });
        }
      },
    },
    {
      key: 10,
      label: "Đạt/Không đạt",
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
      value: filterData.isIncome,
      onChange: (value: number) =>
        setFilterData({ ...filterData, isIncome: value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
    {
      key: 11,
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
      key: 12,
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
          isFiltering: true,
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

export default ReportCompletedFileDetailFilter;
