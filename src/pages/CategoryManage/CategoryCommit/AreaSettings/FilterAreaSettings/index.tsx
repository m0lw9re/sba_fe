import { Form, Row, Space, Typography } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "./style.scss";
import React, { useEffect, useState } from "react";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { useAddressProvince, useArea } from "utils/request";
import { FilterAreaSettingType, ProvinceType } from "constant/types";
import ButtonCustom from "components/ButtonCustom";

type Props = {
  filters: FilterAreaSettingType;
  setFilters: (filters: FilterAreaSettingType) => void;
};

const { SELECT } = TYPE_FIELD;

const FilterAreaSettings: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] = useState<FilterAreaSettingType>({});

  const useAreaTypeSWR = useArea();
  const provinceCodeSWR = useAddressProvince();

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
  // const labelCol = { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 };
  // const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 };
  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Chọn địa bàn",
      css: css,
      type: SELECT,
      // labelCol: labelCol,
      // wrapperCol: wrapperCol,
      value: filters.areaOption,
      options: useAreaTypeSWR?.data?.data?.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      }),
      onChange: (value: number) =>
        setFilterData({ ...filters, areaOption: value }),
    },
    {
      key: 2,
      label: "Chọn tỉnh",
      css: css,
      type: SELECT,
      // labelCol: labelCol,
      // wrapperCol: wrapperCol,
      value: filters.provinceCode,
      options: provinceCodeSWR?.data?.map((item: ProvinceType) => {
        return {
          label: item.fullName,
          value: item.code,
        };
      }),
      onChange: (value: string) =>
        setFilterData({ ...filters, provinceCode: value, isFiltering: true }),
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
              </Row>
              <Row justify={"end"} style={{ marginTop: "4px" }}>
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
              </Row>
            </Form>
          ),
        },
      ]}
    />
  );
};

export default FilterAreaSettings;
