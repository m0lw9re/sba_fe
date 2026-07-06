import { DownOutlined } from "@ant-design/icons";
import { Form, Row, Space, Typography } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import {
  FilterCategoriesBussinessFeeType,
} from "constant/types/categories";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesFilter/style.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  filters: FilterCategoriesBussinessFeeType;
  setFilters: (filters: FilterCategoriesBussinessFeeType) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };

const CategoriesBussinessFeeFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [filterData, setFilterData] = useState<FilterCategoriesBussinessFeeType>({});
  const {provinceOptions, branchOptions} = useSelector((state: RootState) => state.globalSlice)
  

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
      label: "Điểm đi",
      type: SELECT,
      options: branchOptions,
      css: css,
      labelCol: { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 },
      wrapperCol: { xs: 16, sm: 16, md: 16, lg: 16, xl: 16 },
      showSearch: true,
      value: filterData.branchCode || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, branchCode: value, isFiltering: true, }),
    },
    {
      key: 2,
      label: "Điểm đến",
      type: SELECT,
      options: provinceOptions,
      css: css,
      labelCol: { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 },
      wrapperCol: { xs: 16, sm: 16, md: 16, lg: 16, xl: 16 },
      showSearch: true,
      value: filterData.provinceCode || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, provinceCode: value, isFiltering: true, }),
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

export default CategoriesBussinessFeeFilter;
