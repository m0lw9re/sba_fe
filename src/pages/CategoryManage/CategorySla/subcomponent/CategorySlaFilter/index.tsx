import { DatePickerProps, Form, Row, Space, Typography } from "antd";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import {
  APPRAISAL_FILE_STATUS,
  APPRAISAL_STATUS_OPTIONS,
  SLA_STATUS,
} from "constant/common";
import {
  DATE_TIME_FORMAT,
  LOCAL_STORAGE_KEY,
  TYPE_FIELD,
} from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesFilter/style.scss";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { CollapseCustom } from "components/CollapseCustom";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { FilterSlaType } from "constant/types/sla";
import { useStaffByRole } from "utils/request";
import { Staff } from "constants/types/common.type";

type Props = {
  filters: FilterSlaType;
  setFilters: (filters: FilterSlaType) => void;
};

const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };

const CategorySlaFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: dataStaff } = useStaffByRole("CVTD");
  const listStaff = dataStaff?.filter((staff: any) => staff.belongs === 1);

  const [filterData, setFilterData] = useState<FilterSlaType>({
    dateFrom: null,
    dateTo: null,
  });
  const [filtersStorage, setFiltersStorage] = useState<FilterSlaType>({});

  useEffect(() => {
    if (filtersStorage) {
      setFilterData((prevFilterData: any) => ({
        ...prevFilterData,

        ...filtersStorage,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersStorage]);

  useEffect(() => {
    const fetchData = async () => {
      const storedParams = localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL);

      let currentKey = window.history.state?.key;
      let prevKey;

      // Set prevKey in the first run
      if (!localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL_KEY)) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.APPRAISAL_KEY,
          JSON.stringify({ prevKey: null })
        );
      }

      // Get prevKey from localStorage and parse it as JSON
      prevKey = localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL_KEY);
      prevKey = prevKey !== null ? JSON.parse(prevKey) : null;

      // Log previous key and current key
      // console.log("Prev key: ", prevKey?.prevKey);
      // console.log("Current key: ", currentKey);

      // Update prevKey with currentKey
      localStorage.setItem(
        LOCAL_STORAGE_KEY.APPRAISAL_KEY,
        JSON.stringify({ prevKey: currentKey })
      );

      if (currentKey && currentKey === prevKey?.prevKey) {
        if (storedParams && storedParams !== "{}") {
          try {
            const parsedParams = JSON.parse(storedParams);
            setFiltersStorage((prevFilterData) => ({
              ...prevFilterData,
              ...parsedParams,
              isFiltering: false,
            }));
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY.APPRAISAL);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.APPRAISAL);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilters({
        ...filters,
        ...value,
      });
      localStorage.setItem(
        LOCAL_STORAGE_KEY.APPRAISAL,
        JSON.stringify({
          ...filters,
          ...value,
        })
      );
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
      label: "Thời gian nhận hồ sơ từ",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.dateFrom
        ? dayjs(filterData.dateFrom, "YYYY-MM-DD")
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.dateTo) {
          return disabledStartDate(value, filterData.dateTo);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          dateFrom: value ? dayjs(value).format("YYYY-MM-DD") : null,
        }));
      },
    },
    {
      key: 2,
      label: "Thời gian nhận hồ sơ đến",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.dateTo
        ? dayjs(filterData.dateTo, "YYYY-MM-DD")
        : filters.dateTo
        ? dayjs(filters.dateTo, "YYYY-MM-DD")
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.dateFrom) {
          return disabledEndDate(value, filterData.dateFrom);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          dateTo: value ? dayjs(value).format("YYYY-MM-DD") : null,
        }));
      },
    },
    {
      key: 3,
      label: "Số tờ trình",
      type: INPUT,
      css: css,
      value: filterData.reportCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          reportCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 4,
      label: "Định giá viên",
      type: SELECT,
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
      placeholder: "Chọn hoặc nhập tên định giá viên",
    },
    {
      key: 5,
      label: "Trạng thái hồ sơ",
      type: SELECT,
      options: APPRAISAL_STATUS_OPTIONS.filter(
        (item) =>
          item.label !== APPRAISAL_FILE_STATUS.REFUSED_NO_PRICE &&
          item.label !== APPRAISAL_FILE_STATUS.REFUSED_TO_NEW
      ),
      css: css,
      value: filterData.fileStatus || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          fileStatus: value,
        }));
      },
    },
    {
      key: 6,
      label: "Trạng thái",
      type: SELECT,
      options: [
        {
          label: SLA_STATUS.COMMITMENT_LATE,
          value: SLA_STATUS.COMMITMENT_LATE,
        },
        {
          label: SLA_STATUS.REGULATION_LATE,
          value: SLA_STATUS.REGULATION_LATE,
        },
        {
          label: SLA_STATUS.ON_TIME,
          value: SLA_STATUS.ON_TIME,
        },
      ],
      css: css,
      value: filterData.status || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          status: value,
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
              <Row gutter={[16, 8]}>
                <InputFields data={inputSearchBasic} />
              </Row>
              <Space
                style={{
                  display: "flex",
                  justifyContent: "end",
                  paddingTop: "8px",
                }}
              >
                <ButtonCustom
                  label="Xóa"
                  onClick={() => {
                    setFilters({});
                    setFilterData({
                      dateFrom: null,
                      dateTo: null,
                    });
                  }}
                />
                <ButtonCustom
                  label="Tìm kiếm"
                  bgColor="#2862AF"
                  type="primary"
                  onClick={() => {
                    setFilterData({ ...filterData });
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

export default CategorySlaFilter;
