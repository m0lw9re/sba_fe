import { DownOutlined } from "@ant-design/icons";
import { DatePickerProps, Form, Row, Space, Typography, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FiltersCategoryDayOffsType } from "constant/types/categories";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { disabledEndDate, disabledStartDate } from "utils/date";

type Props = {
  filters: FiltersCategoryDayOffsType;
  setFilters: (filter: FiltersCategoryDayOffsType) => void;
};

const { INPUT, DATE_PICKER } = TYPE_FIELD;

const HolidaysFilters: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] = useState<FiltersCategoryDayOffsType>({
    start: null,
    end: null,
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

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      type: INPUT,
      css: css,
      value: filterData.keyword || null,
      onChange: (e: any) =>
        setFilterData({
          ...filterData,
          keyword: e.target.value,
          isFiltering: true,
        }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilterData(filterData);
        }
      },
    },
    {
      key: 2,
      label: "Từ ngày",
      type: DATE_PICKER,
      css: css,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.start ? dayjs(filterData.start) : null,
      disabledDate: (value: any) => {
        return disabledStartDate(value, filterData?.end || "");
      },
      onChange: (value: DatePickerProps["value"]) =>
        setFilterData({
          ...filterData,
          start: dayjs(value).toISOString() || null,
        }),
      allowClear: true,
    },
    {
      key: 3,
      label: "Đến ngày",
      type: DATE_PICKER,
      css: css,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.end ? dayjs(filterData.end) : null,
      disabledDate: (value: any) => {
        return disabledEndDate(value, filterData?.start || "");
      },
      onChange: (value: DatePickerProps["value"]) =>
        setFilterData({
          ...filterData,
          end: dayjs(value).toISOString() || null,
        }),
      allowClear: true,
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
                    setFilters({ start: null, end: null });
                    setFilterData({ start: null, end: null });
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
                      start: filterData.start
                        ? dayjs(filterData.start).format(
                            "DD-MM-YYYY 00:00:00"
                          )
                        : null,
                      end: filterData.end
                        ? dayjs(filterData.end).format(
                            "DD-MM-YYYY 23:59:59"
                          )
                        : null,
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
export default HolidaysFilters;
