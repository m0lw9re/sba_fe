import { DownOutlined } from "@ant-design/icons";
import { Col, Form, Row, Space, Typography, message } from "antd";
import { addressApi } from "apis/adress";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { FilterAdviseType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesFilter/style.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style.scss";

type Props = {
  filters: FilterAdviseType;
  setFilters: (filters: FilterAdviseType) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;
type Option = {
  label: string;
  value: string;
};

const AdviseFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const {provinceOptions, branchOptions} = useSelector((state: RootState) => state.globalSlice)

  const [filterData, setFilterData] = useState<FilterAdviseType>({});

  const [addressData, setAddressData] = useState<{
    districts: Array<any>;
    wards: Array<any>;
  }>({ districts: [], wards: [] });

  useEffect(() => {
    if (filters) {
      setFilterData({ ...filterData, ...filters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (filterData.province) {
      const getDistricts = async () => {
        try {
          const res = await addressApi.getDistricts({
            code: filterData.province || "",
          });
          setAddressData({
            ...addressData,
            districts: res.data?.map((item: any) => ({
              value: item.code,
              label: item.fullName,
            })),
            wards: [],
          });
          setFilterData({
            ...filterData,
            district: undefined,
            ward: undefined,
          });
        } catch (error) {
          console.log(error);
        }
      };

      getDistricts();
    } else {
      setFilterData({ ...filterData, district: undefined, ward: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.province]);

  useEffect(() => {
    if (filterData.district) {
      const getWards = async () => {
        try {
          const res = await addressApi.getWards({
            code: filterData.district || "",
          });
          setAddressData({
            ...addressData,
            wards: res.data?.map((item: any) => ({
              value: item.code,
              label: item.fullName,
            })),
          });
          setFilterData({
            ...filterData,
            ward: undefined,
          });
        } catch (error) {
          console.log(error);
        }
      };

      getWards();
    } else {
      setFilterData({ ...filterData, ward: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.district]);

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const labelCol = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };
  const wrapperCol = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };
  
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      type: INPUT,
      css: css,
      value: filterData.keyword || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value }),
      allowClear: true,
    },
    {
      key: 2,
      label: "Khu vực",
      css: css,
      type: SELECT,
      value: filters.companyBranchId,
      options: branchOptions,
      onChange: (value: string) =>
        setFilters({ ...filters, companyBranchId: value }),
      allowClear: true,
    },
    {
      key: 3,
      label: "Tỉnh/Thành phố",
      type: SELECT,
      options: provinceOptions,
      css: css,
      showSearch: true,
      value: filterData.province || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, province: value }),
      allowClear: true,
    },
    {
      key: 4,
      label: "Quận/Huyện/Thị xã",
      type: SELECT,
      options: addressData.districts,
      css: css,
      showSearch: true,
      value: filterData.district || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, district: value }),
      allowClear: true,
    },
    {
      key: 5,
      label: "Xã/Phường/Thị trấn",
      type: SELECT,
      options: addressData.wards,
      css: css,
      showSearch: true,
      value: filterData.ward || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, ward: value }),
      allowClear: true,
    },
    {
      key: 6,
      label: "Tuyến đường",
      type: SELECT,
      options: addressData.wards,
      css: css,
      showSearch: true,
      value: filterData.ward || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, ward: value }),
      allowClear: true,
    },
    {
      key: 7,
      label: "Mức tăng giá so với 6 tháng trước (%)",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      className: "growUp",
      options: [
        {
          label: "10%",
          value: "1",
        },
        {
          label: "20%",
          value: "2",
        },
        {
          label: "30%",
          value: "3",
        },
        {
          label: "40%",
          value: "4",
        },
        {
          label: "50%",
          value: "5",
        },
        {
          label: "60%",
          value: "6",
        },
        {
          label: "70%",
          value: "7",
        },
        {
          label: "80%",
          value: "8",
        },
        {
          label: "90%",
          value: "9",
        },
        {
          label: "100%",
          value: "10",
        },
      ],
      value: filterData.priceIncrease,
      onChange: (value: string) =>
        setFilterData({ ...filterData, priceIncrease: value }),
      allowClear: true,
    },
    {
      key: 8,
      label: "",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
    },
  ];

  return (
    <CollapseCustom
      expandIcon={({isActive}) => (
        <Space>
          <Typography style={{color: "#2862af"}}>
            {isActive ? "Ẩn tìm kiếm" : "Hiển thị tìm kiếm"}
          </Typography>
          <DownOutlined
            rotate={isActive ? 180 : 0}
            style={{color: "#2862af"}}
          />
        </Space>
      )}
      itemList={[
        {
          label: "Tìm kiếm",
          forceRender: true,
          children: (
            <Form labelAlign="left" labelWrap size="large">
              <Row gutter={[16, 4]}>
                <InputFields data={inputSearchBasic} />
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
                        message.info("Tính năng đang phát triển.");
                      }}
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

export default AdviseFilter;
