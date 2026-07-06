import {Form, Row, Space, Typography} from "antd";
import InputFields from "components/InputFields";
import {TYPE_FIELD} from "constant/enums";
import {CompanyBranchAndRegionsType} from "constant/types/common";
import {InputFiledParams} from "constants/types/Form_Field_type";
import "./style.scss";
import React, {useEffect, useState} from "react";
import {useCategoryRegions} from "utils/request";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";

type Props = {
  filters: {companyBranchId: string | null};
  setFilter: (filters: {companyBranchId: string | null}) => void;
};

const {SELECT} = TYPE_FIELD;
type Option = {
  label: string;
  value: string;
};
const RegionsFunctionFilter: React.FC<Props> = ({filters, setFilter}) => {
  const [branchOptions, setBranchOptions] = useState<Option[]>([]);
  const {data = []} = useCategoryRegions();

  useEffect(() => {
    if (data.length > 0) {
      setBranchOptions(
        data.map((item: CompanyBranchAndRegionsType) => ({
          label: item.companyBranchName,
          value: item.companyBranchId,
        }))
      );
    }
  }, [data]);
  
  const css = {xs: 24, sm: 24, md: 24, lg: 24, xl: 24};
  const labelCol = {xs: 4, sm: 4, md: 4, lg: 4, xl: 4};
  const wrapperCol = {xs: 20, sm: 20, md: 20, lg: 20, xl: 20};
  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Chọn chi nhánh",
      css: css,
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filters.companyBranchId,
      options: branchOptions,
      onChange: (value: string) =>
        setFilter({...filters, companyBranchId: value}),
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
            </Form>
          ),
        },
      ]}
    />
  );
};

export default RegionsFunctionFilter;
