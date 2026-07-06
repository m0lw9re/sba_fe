import { useEffect, useState } from "react";
import { Card, DatePickerProps, Form, Row, Space, Typography } from "antd";
import { FilterCategoryKpis, KPIsByGroup } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import dayjs from "dayjs";
import { disabledEndDate, disabledStartDate } from "utils/date";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { categoryApi } from "apis/category";
import { KPIType } from "constant/types/kpi";

type Props = {
  filter: FilterCategoryKpis;
  setFilter: (filter: FilterCategoryKpis) => void;
};

const { DATE_PICKER, SELECT } = TYPE_FIELD;

const FiltersKPIs: React.FC<Props> = ({ filter, setFilter }) => {
  const [filterData, setFilterData] = useState<FilterCategoryKpis>({
    fromDate: null,
    toDate: null,
  });

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

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilter({
        ...filter,
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

  const css = { xs: 24, sm: 24, md: 24, lg: 8, xl: 8 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 6, xl: 6 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 18, xl: 18 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Hiệu lực từ ngày",
      allowClear: true,
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.fromDate ? dayjs(filterData.fromDate) : null,
      disabledDate: (value: any) => {
        if (filterData?.toDate) {
          return disabledStartDate(value, filterData.toDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          fromDate: value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : null,
        }));
      },
    },
    {
      key: 2,
      label: "Hiệu lực đến ngày",
      allowClear: true,
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.toDate ? dayjs(filterData.toDate) : null,
      disabledDate: (value: any) => {
        if (filterData?.fromDate) {
          return disabledEndDate(value, filterData.fromDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          toDate: value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : null,
        }));
      },
    },
    {
      key: 3,
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
      value: filterData.kpiGroupId,
      onChange: (value: string) =>
        setFilterData({ ...filterData, kpiGroupId: value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilter({ ...filterData });
        }
      },
    },
  ];

  return (
    <Card size="small" className="card-container">
      <CollapseCustom
        expandIcon={({ isActive }) => (
          <Space>
            <Typography style={{ color: "#2862af", width: "100px" }}>
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
                      setFilter({ fromDate: null, toDate: null });
                      setFilterData({ fromDate: null, toDate: null });
                    }}
                  />
                  <ButtonCustom
                    label="Tìm kiếm"
                    bgColor="#2862AF"
                    type="primary"
                    onClick={() => setFilter({ ...filterData })}
                  />
                </Space>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  );
};
export default FiltersKPIs;
