import { DownOutlined } from "@ant-design/icons";
import {
  DatePickerProps,
  Form,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { APPRAISAL_STATUS_OPTIONS } from "constant/common";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterFollowReportsDebt } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Staff } from "constants/types/common.type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { useStaffByRole } from "utils/request";
import { saveAs } from "file-saver";
import { Excell } from "assets";
import "./style.scss";
import { exportReportsFollow } from "apis/exportReportsFollowDGV";
import { configFilterAppraisalFile } from "utils/string";

const { DATE_PICKER, SELECT, INPUT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterFollowReportsDebt;
  setFilters: (filters: FilterFollowReportsDebt) => void;
};

const ReportDebtFollowFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] = useState<FilterFollowReportsDebt>({
    dateFrom: null,
    dateTo: null,
  });

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

  const filteredOptions = APPRAISAL_STATUS_OPTIONS.filter(
    (option) => Number(option.value) >= 12 && Number(option.value) !== 41
  );

  const [exporting, setExporting] = useState(false);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await exportReportsFollow.exportReportsFollowDetail(
        configFilterAppraisalFile(filters)
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Báo cáo chi tiết công nợ.xlsx");
    } catch (error) {
      message.error("Xuất báo cáo thất bại!");
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo chi tiết công nợ?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

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
      label: "CN/PGD",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.companyBranchId,
      options: globalState.sacombankUnitOptions,
      onChange: (value: string) => {
        setFilterData({ ...filterData, companyBranchId: value });
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
      key: 8,
      label: "Trạng thái hồ sơ",
      type: SELECT,
      options: filteredOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.fileStatusId || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          fileStatusId: value,
          isFiltering: true,
        }));
      },
    },
    {
      key: 6,
      label: "Trạng thái hiệu lực?",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: [
        {
          label: "Còn hiệu lực",
          value: "true",
        },
        {
          label: "Hết hiệu lực",
          value: "false",
        },
      ],
      value: filterData.isExpiredDate,
      onChange: (value: number) =>
        setFilterData({ ...filterData, isExpiredDate: value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
    {
      key: 7,
      label: "Số tờ trình",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.reportCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          reportCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 8,
      label: "Đơn vị định giá",
      type: SELECT,
      options: globalState.branchOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.companyBranch || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          companyBranch: value,
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
                  label="Xuất báo cáo"
                  icon={
                    exporting ? (
                      <div className="spin-overlay">
                        <Spin className="spin" />
                      </div>
                    ) : (
                      <Excell />
                    )
                  }
                  className={`button-Report ${exporting ? "exporting" : ""}`}
                  size="small"
                  onClick={() => {
                    if (filters.dateFrom || filters.dateTo) {
                      showConfirm();
                    } else if (!(filters.dateFrom && filters.dateTo)) {
                      message.error(
                        "Vui lòng chọn từ ngày và đến ngày để xuất báo cáo!"
                      );
                    } else {
                      showConfirm();
                    }
                  }}
                  disabled={exporting}
                />
                <ButtonCustom
                  label="Xóa"
                  onClick={() => {
                    setFilters({ dateFrom: null, dateTo: null });
                    setFilterData({ dateFrom: null, dateTo: null });
                  }}
                />
                <ButtonCustom
                  label="Tìm kiếm"
                  bgColor="#2862AF"
                  type="primary"
                  onClick={() => {
                    setFilters({
                      ...filterData,
                    });
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

export default ReportDebtFollowFilter;
