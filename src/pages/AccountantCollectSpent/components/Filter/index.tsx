import { Row, Space, Typography, Form, Col } from "antd";
import "pages/CategoryManage/CategoryRisk/components/CategoryRiskFilter/style.scss";
import React, { useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { FilterAccountantCollectSpent } from "constant/types";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";

type Props = {
  filters: FilterAccountantCollectSpent;
  setFilters: (filters: FilterAccountantCollectSpent) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;

const Filter: React.FC<Props> = ({ filters, setFilters }) => {

  const [filterData, setFilterData] = useState<FilterAccountantCollectSpent>(
    {}
  );

  const [riskLevelData, setRiskLevelData] = useState<{
    riskLevel: Array<any>;
  }>({ riskLevel: [] });

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      type: INPUT,
      css: css,
      value: filterData.keyword || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
      allowClear: true,
    },
    {
      key: 2,
      label: "Loại",
      type: SELECT,
      css: css,
      options: [
        {
          label: "Phiếu thu",
          value: "1",
        },
        {
          label: "Phiếu chi",
          value: "2",
        },
      ],
      value: filterData.type,
      onChange: (value: string) =>
        setFilterData({ ...filterData, type: value }),
      allowClear: true,
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
            <Form labelAlign="left" labelWrap size="small">
              <Row gutter={[16, 4]}>
                <InputFields data={inputSearchBasic} />
                <Col
                  xs={css.xs}
                  sm={css.sm}
                  md={css.md}
                  lg={css.lg}
                  xl={css.xl}
                  style={{ justifyContent: "end", display: "flex" }}
                ></Col>
                <Col
                  style={{
                    justifyContent: "end",
                    display: "flex",
                    width: "100%",
                  }}
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
                      onClick={() => setFilters({ ...filterData })}
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
