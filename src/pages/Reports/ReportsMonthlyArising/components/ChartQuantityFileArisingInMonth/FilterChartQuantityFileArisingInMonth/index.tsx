import { DownOutlined } from "@ant-design/icons";
import { Col, Form, Row, Space, Typography, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { FilterChartQuantityFileArising } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const { SELECT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterChartQuantityFileArising;
  setFilters: (filters: FilterChartQuantityFileArising) => void;
};

const ChartQuantityFileArisingInMonthFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const month = filters.month || `${new Date().getMonth() + 1}`;
  const year = filters.year || `${new Date().getFullYear()}`;
  
  const [filterData, setFilterData] = useState<FilterChartQuantityFileArising>({
    year: year,
    month: month,
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
      label: "Năm",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: Array.from(
        { length: new Date().getFullYear() - 1991 + 1 },
        (_, index) => {
          const year = new Date().getFullYear() - index;
          return {
            label: `Năm ${year}`,
            value: `${year}`,
          };
        }
      ),
      defaultValue: `${new Date().getFullYear()}`,
      value: filterData.year,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          year: value,
        }));
      },
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
      value: filterData.month,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          month: value,
        }));
      },
    },
    {
      key: 3,
      label: "Đơn vị định giá",
      type: SELECT,
      options: globalState.branchOptions,
      css: css,
      value: filterData.appraisalUnit || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering:true,
          appraisalUnit: value,

        }));
      },
    }
  ];

  useEffect(() => {
    if (filters) {
      setFilterData(filters);
    }
  }, [filters]);

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
                      justifyContent: "end",
                      display: "flex",
                      marginTop: "4px"
                    }}
                  >
                    <ButtonCustom
                      className="btn-del"
                      label="Xóa"
                      onClick={() => {
                        setFilters({});
                        setFilterData({
                          year: `${new Date().getFullYear()}`,
                          month: `${new Date().getMonth() + 1}`,
                        });
                      }}
                    />
                    <ButtonCustom
                      className="btn-search"
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => {
                        // if(!filterData.month&&!filterData.year) {
                        //   message.error("Bạn phải chọn năm và tháng!")
                        //   return
                        // } else if(filterData.month&&!filterData.year) {
                        //   message.error("Bạn phải chọn năm!")
                        //   return
                        // } else if(!filterData.month&&filterData.year) {
                        //   message.error("Bạn phải chọn tháng!")
                        //   return
                        // }
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

export default ChartQuantityFileArisingInMonthFilter;
