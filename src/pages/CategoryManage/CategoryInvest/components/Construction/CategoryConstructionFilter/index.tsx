import { Row, Space, Typography, Form } from "antd";
import "pages/CategoryManage/CategoryRisk/components/CategoryRiskFilter/style.scss";
import React, { useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { FilterCategoryConstruction } from "constant/types/categoryinvest";

type Props = {
  filters: FilterCategoryConstruction;
  setFilters: (filters: FilterCategoryConstruction) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;

const CategoryConstructionFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [filterData, setFilterData] = useState<FilterCategoryConstruction>({});

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

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên công trình xây dựng",
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
    },
    {
      key: 2,
      label: "Trạng thái",
      type: SELECT,
      css: css,
      value: filterData.isActive || null,
      options: [
        { label: "Đang hoạt động", value: "true" },
        { label: "Ngưng hoạt động", value: "false" },
      ],
      onChange: (value: any) =>
        setFilterData({
          ...filterData,
          isActive: value || null,
        }),
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
            </Form>
          ),
        },
      ]}
    />
  );
};

export default CategoryConstructionFilter;
