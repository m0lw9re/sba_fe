import { Row, Space, Typography, Form } from "antd";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesFilter/style.scss";
import React, { useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import {
  FilterPriceFrameType,
  PriceFrameType,
} from "constant/types/priceFrame";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  filters: PriceFrameType;
  setFilters: (filters: FilterPriceFrameType) => void;
};

const { SELECT, INPUT } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };

const PriceFrameFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] = useState<FilterPriceFrameType>({});
  const { provinceOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

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
      label: "Tỉnh/Thành phố",
      type: SELECT,
      options: provinceOptions,
      css: css,
      labelCol: { xs: 8, sm: 8, md: 8, lg: 6, xl: 6 },
      wrapperCol: { xs: 16, sm: 16, md: 16, lg: 18, xl: 18 },
      showSearch: true,
      value: filterData.provinceCode || null,
      onChange: (value: string) =>
        setFilterData({
          ...filterData,
          provinceCode: value,
          isFiltering: true,
        }),
    },
    {
      key: 2,
      label: "Đường",
      type: INPUT,
      css: css,
      labelCol: { xs: 8, sm: 8, md: 8, lg: 6, xl: 6 },
      wrapperCol: { xs: 16, sm: 16, md: 16, lg: 18, xl: 18 },
      showSearch: true,
      value: filterData.road || null,
      onChange: (e: any) =>
        setFilterData({
          ...filterData,
          road: e.target.value,
          isFiltering: true,
        }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
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

export default PriceFrameFilter;
