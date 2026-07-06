import { Row, Typography, Form, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { FilterCategoryExpirationDateType } from "constant/types/categoryExpirationDate";
import { TYPE_FIELD } from "constants/enums";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";
import { InputFiledParams } from "constants/types/Form_Field_type";
import InputFields from "components/InputFields";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  filters: FilterCategoryExpirationDateType;
  setFilter: (filter: FilterCategoryExpirationDateType) => void;
  onChangeData: (data: FilterCategoryExpirationDateType) => void;
};

const { INPUT_NUMBER, SELECT } = TYPE_FIELD;

const CategoryExpirationDateFilter: FC<Props> = ({
  filters,
  setFilter,
  onChangeData,
}) => {
  const [filterData, setFilterData] =
    useState<FilterCategoryExpirationDateType>({});
  const { assetLevelOneOptions } = useSelector(
    (state: RootState) => state.globalSlice
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
    }, 200);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const css = { xs: 24, sm: 24, md: 24, lg: 8, xl: 8 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Loại tài sản",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      allowClear: true,
      options: assetLevelOneOptions || [],
      value: filterData.assetLevelOneId || null,
      onChange: (value: number) =>
        setFilterData({ ...filterData, assetLevelOneId: value }),
    },
    {
      key: 2,
      label: "Số ngày hiệu lực",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT_NUMBER,
      value: filterData.expirationDate || null,
      currencable: true,
      allowClear: true,
      onChange: (value: number) =>
        setFilterData({
          ...filterData,
          expirationDate: value ? Math.round(value) : null,
        }),
      // onKeyPress: (e: any) => {
      //   if (e.key === "Enter") {
      //     handleSearch();
      //   }
      // },
    },
  ];

  const handleSearch = async () => {
    onChangeData({
      ...filterData,
    });
  };

  const handleReset = async () => {
    onChangeData({
      expirationDate: null,
      assetLevelOneId: null,
    });
  };

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
              <Space
                style={{
                  display: "flex",
                  justifyContent: "end",
                  paddingTop: "4px",
                }}
              >
                <ButtonCustom label="Xóa" onClick={handleReset} />
                <ButtonCustom
                  label="Tìm kiếm"
                  bgColor="#2862AF"
                  type="primary"
                  onClick={handleSearch}
                />
              </Space>
            </Form>
          ),
        },
      ]}
    />
  );
};

export default CategoryExpirationDateFilter;
