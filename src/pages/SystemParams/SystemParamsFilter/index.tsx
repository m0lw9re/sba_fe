import {
  Row,
  Space,
  Typography,
  Form,
} from "antd";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesFilter/style.scss";
import React, { useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { FilterSystemParamsType } from "constant/types/system";
import { systemApi } from "apis/system";
import { DownOutlined } from "@ant-design/icons";
import { CollapseCustom } from "components/CollapseCustom";

type Props = {
  filters: FilterSystemParamsType;
  setFilters: (filters: FilterSystemParamsType) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;

const SystemParamsFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const [collapse, setCollapse] = useState<number>(1);
  const [filterData, setFilterData] = useState<FilterSystemParamsType>({});
  const [groups, setGroups] = useState<any>([]);
  const getGroups = async () => {
    const res = await systemApi.getAllGroups();
    setGroups(res.data);
  }

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
  }, [filterData])

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.keyword || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value, isFiltering: true, }),
    },
    {
      key: 2,
      label: "Loại giá trị",
      type: SELECT,
      options: [
        {
          value: 1,
          label: "Kiểu chữ"
        },
        {
          value: 2,
          label: "Kiểu số"
        }
      ],
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      showSearch: true,
      allowClear: true,
      value: filterData.type || null,
      onChange: (value: number) =>
        setFilterData({ ...filterData, type: value, isFiltering: true, }),
    },
    {
      key: 3,
      label: "Nhóm",
      type: SELECT,
      options: groups
      ? groups.map((item: any) => ({
          label: item.systemParametersGroupName,
          value: item.id,
        }))
      : [],
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      showSearch: true,
      allowClear: true,
      value: filterData.groups || null,
      onChange: (value: number) =>
        setFilterData({ ...filterData, groups: value, isFiltering: true, }),
    }
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
              <Space style={{display:"flex", justifyContent: "end", paddingTop: "4px"}}>
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

export default SystemParamsFilter;
