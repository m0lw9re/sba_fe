import { Row, Typography, Form, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { FilterCategoryPurposeType } from "constant/types";
import { TYPE_FIELD } from "constants/enums";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";
import { InputFiledParams } from "constants/types/Form_Field_type";
import InputFields from "components/InputFields";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { useFeeScheduleParent } from "utils/request";

type Props = {
  filters: FilterCategoryPurposeType;
  setFilter: (filter: FilterCategoryPurposeType) => void;
  onChangeData: (data: any) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;

const CategoryPurposeFilter: FC<Props> = ({
  filters,
  setFilter,
  onChangeData,
}) => {
  const [filterData, setFilterData] = useState<FilterCategoryPurposeType>({});

  const { data: feeScheduleParentData } = useFeeScheduleParent();

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

  const css = { xs: 24, sm: 24, md: 24, lg: 8, xl: 8 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã mục đích",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.usingPurposeCode,
      onChange: (e: any) =>
        setFilterData({ ...filterData, usingPurposeCode: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      },
    },
    {
      key: 2,
      label: "MĐSD đất hiển thị trong tờ trình",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.usingPurposeName,
      onChange: (e: any) =>
        setFilterData({ ...filterData, usingPurposeName: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      },
    },
    {
      key: 3,
      label: "Trong/Ngoài KCN, CCN, KCX?",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      options: [
        {
          label: "Không",
          value: 0,
        },
        {
          label: "Trong KCN, CCN, KCX",
          value: 1,
        },
        {
          label: "Ngoài KCN, CCN, KCX",
          value: 2,
        },
      ],
      value: filterData.insideOutside,
      onChange: (value: number) =>
        setFilterData({ ...filterData, insideOutside: value }),
    },
    {
      key: 4,
      label: "Biểu phí áp dụng",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      allowClear: true,
      options: feeScheduleParentData
        ? feeScheduleParentData?.data.map((el: any) => ({
            label: el.feeCode,
            value: el.id,
          }))
        : [],
      value: filterData.idFeeScheduleIdNew,
      onChange: (value: number) =>
        setFilterData({ ...filterData, idFeeScheduleIdNew: value }),
    },
    {
      key: 5,
      label: "Trạng thái",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      allowClear: true,
      options: [
        {
          label: "Hoạt động",
          value: 1,
        },
        {
          label: "Ngưng hoạt động",
          value: 0,
        },
      ],
      value:
        filterData?.status === true
          ? 1
          : filterData?.status === false
          ? 0
          : null,
      onChange: (value: number) =>
        setFilterData({
          ...filterData,
          status: value === 1 ? true : value === 0 ? false : null,
        }),
    },
  ];

  const handleSearch = async () => {
    onChangeData({
      ...filterData,
      usingPurposeName: filterData.usingPurposeName,
    });
  };

  const handleReset = async () => {
    onChangeData({
      usingPurposeName: "",
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

export default CategoryPurposeFilter;
