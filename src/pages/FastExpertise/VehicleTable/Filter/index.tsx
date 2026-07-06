import { Form, Space, Typography, Row, Col, message } from "antd";
import React, { useState, useEffect } from "react";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import { FilterVehicle } from "constant/types";

type Props = {
  filters: FilterVehicle;
  setFilters: (filters: FilterVehicle) => void;
};

const { INPUT } = TYPE_FIELD;

const Filter: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] = useState<FilterVehicle>({});

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const css1 = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 6, xl: 6 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 18, xl: 18 };

  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên khách hàng",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.customerId,
      onChange: (e: any) =>
        setFilterData({ ...filterData, customerId: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
    {
      key: 2,
      label: "CCCD/CC/HC/CMTQĐ/MST/ĐKKD",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.customerIdentity,
      onChange: (e: any) =>
        setFilterData({ ...filterData, customerIdentity: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
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
            <Form labelAlign="left" labelWrap size="large">
              <Row gutter={[16, 4]}>
                <InputFields data={inputSearch} />
                <Col
                  xs={css1.xs}
                  sm={css1.sm}
                  md={css1.md}
                  lg={css1.lg}
                  xl={css1.xl}
                  style={{ justifyContent: "end", display: "flex" }}
                >
                  <Space>
                    <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        setFilters({});
                        setFilterData({});
                      }}
                    />
                    <ButtonCustom
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => {
                        setFilters({ ...filterData });
                        message.info("Tính năng đang phát triển.");
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
export default Filter;
