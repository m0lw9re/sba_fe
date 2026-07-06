import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePickerProps,
  Form,
  Row,
  Space,
  Typography,
} from "antd";
import { addressApi } from "apis/adress";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterAssetMoveableEstateType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";
import "./style.scss";

type Props = {
  assetType: number;
  filters: FilterAssetMoveableEstateType;
  setFilters: (filter: FilterAssetMoveableEstateType) => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const { INPUT, SELECT, DATE_PICKER, INPUT_NUMBER } = TYPE_FIELD;

const AssetMoveableEstateFilter = forwardRef((props: Props, ref) => {
  const [filterData, setFilterData] = useState<FilterAssetMoveableEstateType>({
    dateFrom: null,
    dateTo: null,
  });
  const { provinceOptions, infoSourceOptions ,dataSourceOptions, categoryCommonsOptions } =
    useSelector((state: RootState) => state.globalSlice);

  useEffect(() => {
    setFilterData(props.filters);
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const [collapse, setCollapse] = useState<number>(1);
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
              label: item.name,
            }))
          );
        } catch (error) {}
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
              label: item.name,
            }))
          );
        } catch (error) {}
      };

      getWards();
    }
  }, [filterData.addressDistrict]);

  const handleCollapse = (value: number) => {
    setCollapse(value);
  };

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Nguồn thông tin",
      type: SELECT,
      css: css,
      value: filterData.infoSourceId,
      options: infoSourceOptions,
      onChange: (value: number) =>
        setFilterData({ ...filterData, infoSourceId: value }),
    },
    {
      key: 2,
      label: "Phân loại kho",
      type: SELECT,
      css: css,
      value: filterData.storedTypeId,
      options: categoryCommonsOptions,
      onChange: (value: number) =>
        setFilterData({ ...filterData, storedTypeId: value }),
    },
    {
      key: 3,
      label: "Mã kho",
      type: INPUT,
      css: css,
      value: filterData.assetCode,
      onChange: (e: any) =>
        setFilterData({ ...filterData, assetCode: e.target.value }),
    },
    {
      key: 4,
      label: "Tỉnh/Thành phố",
      type: SELECT,
      css: css,
      options: provinceOptions,
      value: filterData.addressProvince,
      onChange: (value: string) =>
        setFilterData({
          ...filterData,
          addressProvince: value,
          addressDistrict: null,
          addressWard: null,
        }),
    },
    {
      key: 5,
      label: "Quận/Huyện/Thị xã",
      type: SELECT,
      css: css,
      value: filterData.addressDistrict,
      options: districts,
      onChange: (value: string) =>
        setFilterData({
          ...filterData,
          addressDistrict: value,
          addressWard: null,
        }),
    },
    {
      key: 6,
      label: "Xã/Phường/Thị trấn",
      type: SELECT,
      options: wards,
      css: css,
      value: filterData.addressWard,
      onChange: (value: string) =>
        setFilterData({
          ...filterData,
          addressWard: value,
        }),
    },
    {
      key: 8,
      label: "Giá rao bán",
      css: css,
      type: INPUT_NUMBER,
      currencable: true,
      value: filterData.transactionPrice,
      onChange: (value: number) => {
        setFilterData({ ...filterData, transactionPrice: value });
      },
    },
    {
      key: 9,
      label: "Hiệu lực từ ngày",
      allowClear: true,
      type: DATE_PICKER,
      css: css,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.dateFrom ? dayjs(filterData.dateFrom) : null,
      disabledDate: (value: any) => {
        if (filterData?.dateTo) {
          return disabledStartDate(value, filterData.dateTo);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          dateFrom: value ? dayjs(value).format("YYYY-MM-DD 00:00:00") : null,
        }));
      },
    },
    {
      key: 10,
      label: "Hiệu lực đến ngày",
      allowClear: true,
      type: DATE_PICKER,
      css: css,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.dateTo ? dayjs(filterData.dateTo) : null,
      disabledDate: (value: any) => {
        if (filterData?.dateFrom) {
          return disabledEndDate(value, filterData.dateFrom);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          dateTo: value ? dayjs(value).format("YYYY-MM-DD 23:59:59") : null,
        }));
      },
    },
    {
      key: 7,
      label: "Mô tả chi tiết",
      css: css,
      type: INPUT,
      value: filterData.addressDetail,
      onChange: (value: any) => {
        setFilterData({ ...filterData, addressDetail: value.target.value });
      },
    },
  ];

  const searchText = () => {
    switch (collapse) {
      case 0:
        return (
          <Button type="text" size="small" onClick={() => handleCollapse(1)}>
            <Space>
              <Typography className="blue-text">Hiển thị tìm kiếm</Typography>
              <Typography className="blue-text">
                <Icons.down />
              </Typography>
            </Space>
          </Button>
        );
      case 1:
        return (
          <Button type="text" size="small" onClick={() => handleCollapse(2)}>
            <Space>
              <Typography className="blue-text">
                Hiển thị tìm kiếm nâng cao
              </Typography>
              <Typography className="blue-text">
                <Icons.down />
              </Typography>
            </Space>
          </Button>
        );
      case 2:
        return (
          <Button type="text" size="small" onClick={() => handleCollapse(0)}>
            <Space>
              <Typography className="blue-text">Ẩn tất cả tìm kiếm</Typography>
              <Typography className="blue-text">
                <Icons.up />
              </Typography>
            </Space>
          </Button>
        );
      default:
        return <></>;
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: (e: any) => {
      onKeyDown(e);
    },
  }));

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      props.setFilters({ ...filterData });
    }
  };

  return (
    <div
      className="price-specific-filter-container"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <Card size="small" className="card-container">
        <CollapseCustom
          expandIcon={({ isActive }) => (
            <Space>
              <Typography style={{ color: "#2862af", width: "100px" }}>
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
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "1rem",
                      }}
                    >
                      <ButtonCustom
                        label="Xóa"
                        onClick={() => {
                          props.setFilters({
                            assetType: props.assetType,
                            assetLevelThreeId: filterData?.assetLevelThreeId || undefined,
                            dateFrom: null,
                            dateTo: null,
                          });
                          setFilterData({
                            assetType: props.assetType,
                            assetLevelThreeId: filterData?.assetLevelThreeId || undefined,
                            dateFrom: null,
                            dateTo: null,
                          });
                        }}
                      />
                      <ButtonCustom
                        label="Tìm kiếm"
                        bgColor="#2862AF"
                        type="primary"
                        onClick={() => props.setFilters({ ...filterData })}
                      />
                    </div>
                  </Row>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
});

export default AssetMoveableEstateFilter;
