import { DownOutlined } from "@ant-design/icons";
import { Col, Form, Row, Space, Typography } from "antd";
import { addressApi } from "apis/adress";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { FilterSpecificPricesType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "pages/PriceShared/AssetListApprovalWaiting/AssetListApprovalWaitingFilter/style.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  filters: FilterSpecificPricesType;
  setFilter: (filters: FilterSpecificPricesType) => void;
};

const { SELECT, INPUT } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
const assetTypeOptions = [
  {
    value: 0,
    label: "Nhà đất",
  },
  {
    value: 1,
    label: "Chung cư",
  },
  {
    value: 2,
    label: "PTVT đường bộ",
  },
  {
    value: 3,
    label: "PTVT đường thủy",
  },
  {
    value: 4,
    label: "Máy móc thiết bị",
  },
  {
    value: 5,
    label: "Dự án",
  },
  {
    value: 6,
    label: "Dự toán",
  },
];

const AssetListApprovalDenyFilter: React.FC<Props> = ({
  filters,
  setFilter,
}) => {
  const [filterData, setFilterData] = useState<FilterSpecificPricesType>({ assetType: 0, dateFrom: null, dateTo: null, approved: false });
  const { provinceOptions, infoSourceOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (filterData.addressProvince) {
      const getDistricts = async () => {
        try {
          const res = await addressApi.getDistricts({
            code: filterData.addressProvince || "",
          });
          setDistricts(
            res.data?.map((item: any) => ({
              value: item.code,
              label: item.fullName,
            }))
          );
        } catch (error) { }
      };
      getDistricts();
    }
  }, [filterData.addressProvince]);

  useEffect(() => {
    if (filterData.addressDistrict) {
      const getWards = async () => {
        try {
          const res = await addressApi.getWards({
            code: filterData.addressDistrict || "",
          });
          setWards(
            res.data?.map((item: any) => ({
              value: item.code,
              label: item.fullName,
            }))
          );
        } catch (error) { }
      };

      getWards();
    }
  }, [filterData.addressDistrict]);

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

  const [errorSearch, setErrorSearch] = useState<string | null>(null);

  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Phân loại tài sản",
      css: css,
      type: SELECT,
      labelCol: labelCol,
      error: errorSearch,
      wrapperCol: wrapperCol,
      value: filterData.assetType,
      options: assetTypeOptions,
      allowClear: false,
      onChange: (value: number) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          assetType: value,
        })),
    },
    {
      key: 2,
      label: "Nguồn thông tin",
      css: css,
      allowClear: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.infoSourceId,
      options: infoSourceOptions,
      onChange: (value: number) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          infoSourceId: value,

        })),
    },
    {
      key: 2.5,
      label: "Mã tài sản",
      css: css,
      allowClear: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.assetCode,
      onChange: (e: any) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          assetCode: e.target.value.trim(),

        })),
    },
    {
      key: 3,
      label: "Tỉnh/Thành phố",
      css: css,
      allowClear: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      options: provinceOptions,
      value: filterData.addressProvince,
      onChange: (value: string) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          addressProvince: value,

          addressDistrict: null,
          addressWard: null,
        })),
    },
    {
      key: 4,
      label: "Quận/Huyện/Thị xã",
      css: css,
      allowClear: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      options: districts,
      value: filterData.addressDistrict,
      onChange: (value: string) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          addressDistrict: value,

          addressWard: null,
        })),
    },
    {
      key: 5,
      label: "Xã/Phường/Thị trấn",
      css: css,
      allowClear: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.addressWard,
      options: wards,
      onChange: (value: string) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          addressWard: value,

        })),
    },
    {
      key: 6,
      label: "Đường phố",
      css: css,
      allowClear: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.addressStreet,
      options: [],
      onChange: (value: any) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          addressStreet: value.target.value,

        })),
    },
    {
      key: 7,
      label: "Mô tả chi tiết",
      css: css,
      allowClear: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.addressDetail,
      onChange: (value: any) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          addressDetail: value.target.value,
        })),
    },
  ];

  const handleSearch = () => {
    if (filterData.assetType === null || filterData.assetType === undefined) {
      setErrorSearch("Vui lòng chọn phân loại tài sản");
    } else {
      setFilter({ ...filterData });
      setErrorSearch(null);
    }
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
            <Form labelAlign="left" labelWrap size="large">
              <Row gutter={[16, 4]}>
                <InputFields data={inputSearch} />
                <Col
                  span={24}
                  style={{ justifyContent: "end", display: "flex" }}
                >
                  <Space>
                    <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        setFilter({ assetType: 0, dateFrom: null, dateTo: null, approved: false });
                        setFilterData({ assetType: 0, dateFrom: null, dateTo: null, approved: false });
                        setErrorSearch(null);
                      }}
                    />
                    <ButtonCustom
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => {
                        handleSearch();
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

export default AssetListApprovalDenyFilter;
