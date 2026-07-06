import { Row, Typography, Form, Col, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { FilterCategoryTransactionType } from "constant/types";
import { TYPE_FIELD } from "constant/enums";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";
import { InputFiledParams } from "constants/types/Form_Field_type";
import InputFields from "components/InputFields";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";

type Props = {
  filters: FilterCategoryTransactionType;
  setFilter: (filter: FilterCategoryTransactionType) => void;
};

const { INPUT } = TYPE_FIELD;

const CategoryTransactionFilter: FC<Props> = ({ filters, setFilter }) => {
  const [filterData, setFilterData] = useState<FilterCategoryTransactionType>(
    {}
  );

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilter({
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

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 };

  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.keyword,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilter({ ...filterData });
        }
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
                <InputFields data={inputSearch} />
                <Col
                  xs={css.xs}
                  sm={css.sm}
                  md={css.md}
                  lg={css.lg}
                  xl={css.xl}
                  style={{ justifyContent: "end", display: "flex" }}
                >
                  <Space>
                    <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        setFilter({});
                        setFilterData({});
                      }}
                    />
                    <ButtonCustom
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => setFilter({ ...filterData })}
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

export default CategoryTransactionFilter;
