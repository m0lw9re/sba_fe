import {  Row, Space, Typography, Form, message } from "antd";
import "pages/CategoryManage/CategoryRisk/components/CategoryRiskFilter/style.scss";
import React, { useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { AssetType, FilterCategoryCommit } from "constant/types";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { assetCommonApi } from "apis/assetCommon";

type Props = {
  filters: FilterCategoryCommit;
  setFilters: (filters: FilterCategoryCommit) => void;
};
const { INPUT, SELECT } = TYPE_FIELD;

const CategoryCommitFilters: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] = useState<FilterCategoryCommit>({});

  const [assetType, setAssetType] = useState<AssetType[]>([]);

  const getAssetType = async () => {
    try {
      const res = await assetCommonApi.getAssetType({
        page: 1,
        limit: 1000,
      });
      setAssetType(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAssetType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      type: INPUT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: filterData.keyword || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters(filterData);
        }
      },
    },
    {
      key: 2,
      label: "Địa bàn",
      type: SELECT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      options: [
        {
          label: "Tất cả",
          value: "1",
        },
        {
          label: "Nội thành",
          value: "2",
        },
        {
          label: "Tỉnh",
          value: "3",
        },
        {
          label: "Ngoại thành",
          value: "4",
        },
      ],
      value: filterData.areaId,
      onChange: (value: number) =>
        setFilterData({ ...filterData, areaId: value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
    {
      key: 3,
      label: "Loại tài sản",
      type: SELECT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      allowClear: false,
      options:
        assetType?.map((item: AssetType) => {
          return {
            label: item.name,
            value: item.id,
          };
        }) || [],
      value: filterData.assetTypeId || [],
      onChange: (value: number) =>
        setFilterData({ ...filterData, assetTypeId: value }),
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
                  onClick={() => {
                    setFilters({ ...filterData });
                  }}
                />
              </Space>
            </Form>
          ),
        },
      ]}
    />
  );
};
export default CategoryCommitFilters;
