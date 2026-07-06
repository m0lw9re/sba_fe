import { DownOutlined } from "@ant-design/icons";
import { Col, DatePickerProps, Form, Row, Space, Typography } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterDocToInv } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const { DATE_PICKER, SELECT, INPUT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterDocToInv;
  setFilters: (filters: FilterDocToInv) => void;
};

const FiltersDocToInv: React.FC<Props> = ({ filters, setFilters }) => {
  const globalState = useSelector((state: RootState) => state.globalSlice);

  const [filterData, setFilterData] = useState<FilterDocToInv>({
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

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Đến ngày",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.dateTo ? dayjs(filterData.dateTo, "YYYY-MM-DD") : null,
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,
          dateTo: value ? dayjs(value).format("YYYY-MM-DD") : null,
        }));
      },
      allowClear: true,
    },
    {
      key: 2,
      label: "Đơn vị định giá",
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: globalState.branchOptions,
      css: css,
      value: filterData.unit || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          unit: value,
        }));
      },
    },
    {
      key: 3,
      label: "Tên khách hàng",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.customerName || null,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          customerName: e.target.value,
        }));
      },
    },
    {
      key: 4,
      label: "Số hồ sơ",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.reportCode || null,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          reportCode: e.target.value,
        }));
      },
    },
    {
      key: 5,
      label: "CN/Phòng GD",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.branchId,
      options: globalState.sacombankUnitOptions,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          branchId: value,
        }));
      },
      allowClear: true,
    },
    {
      key: 6,
    },
    {
      key: 7,
    },
    {
      key: 8,
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
                        setFilters({
                          dateTo: null,
                        });
                        setFilterData({
                          dateTo: null,
                        });
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
                        });
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

export default FiltersDocToInv;
