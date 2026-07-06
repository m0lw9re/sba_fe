import {
  Button,
  Card,
  Col,
  DatePickerProps,
  Form,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { addressApi } from "apis/adress";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import FormItem from "components/InputFields/FormItem";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { FilterSpecificPricesType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import "pages/PriceSpecific/subcomponents/PriceSpecificFilter/style.scss";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";

type Props = {
  assetType: number;
  filters: FilterSpecificPricesType;
  setFilters: (filter: FilterSpecificPricesType) => void;
};

const { INPUT, SELECT, DATE_PICKER, INPUT_NUMBER } = TYPE_FIELD;
const dateFormat = "DD/MM/YYYY";
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 10, md: 10, lg: 10, xl: 12 };
const wrapperCol = { xs: 14, md: 14, lg: 14, xl: 12 };

const ListTSSSFilter = forwardRef((props: Props, ref) => {
  const [filterData, setFilterData] = useState<FilterSpecificPricesType>({
    assetType: props.assetType,
    dateFrom: null,
    dateTo: null,
  });
  const {
    provinceOptions,
    listPositionOptions,
    usingPurposeOptions,
    infoSourceOptions,
    categoryCommonsOptions,
  } = useSelector((state: RootState) => state.globalSlice);

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
              label: item.fullName,
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
              label: item.fullName,
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

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      props.setFilters({
        ...props.filters,
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
    // {
    //   key: 1,
    //   label: "Phân loại tài sản",
    //   type: SELECT,
    //   css: css,
    //   value: filters.assetLevelThreeCode,
    //   require: true,
    //   onChange: (value: number) =>
    //     setFilters({ ...filters, assetLevelThreeCode: value }),
    // },
    {
      key: 2,
      label: "Nguồn thông tin",
      type: SELECT,
      css: css,
      value: filterData.infoSourceId,
      options: infoSourceOptions,
      allowClear: true,
      onChange: (value: number) =>
        setFilterData({ ...filterData, infoSourceId: value }),
    },
    {
      key: 3,
      label: "Mục đích sử dụng đất",
      type: SELECT,
      css: css,
      value: filterData.usingPurposeId,
      options: usingPurposeOptions,
      allowClear: true,
      onChange: (value: number) =>
        setFilterData({ ...filterData, usingPurposeId: value }),
    },
    {
      key: 4,
      label: "Phân loại kho",
      type: SELECT,
      css: css,
      value: filterData.storedTypeId,
      options: categoryCommonsOptions,
      allowClear: true,
      onChange: (value: number) =>
        setFilterData({ ...filterData, storedTypeId: value }),
    },
    {
      key: 5,
      label: "Tỉnh/Thành phố",
      type: SELECT,
      css: css,
      options: provinceOptions,
      value: filterData.addressProvince,
      allowClear: true,
      onChange: (value: string) =>
        setFilterData({
          ...filterData,
          addressProvince: value,
          addressDistrict: null,
          addressWard: null,
        }),
    },
    {
      key: 6,
      label: "Quận/Huyện/Thị xã",
      type: SELECT,
      css: css,
      value: filterData.addressDistrict,
      options: districts,
      allowClear: true,
      onChange: (value: string) =>
        setFilterData({
          ...filterData,
          addressDistrict: value,
          addressWard: null,
        }),
    },
    {
      key: 7,
      label: "Xã/Phường/Thị trấn",
      type: SELECT,
      options: wards,
      css: css,
      value: filterData.addressWard,
      allowClear: true,
      onChange: (value: string) =>
        setFilterData({
          ...filterData,
          addressWard: value,
        }),
    },
    {
      key: 7.5,
      label: "Đường phố",
      css: css,
      type: INPUT,
      allowClear: true,
      value: filterData.addressStreet || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          addressStreet: e.target.value,
        }));
      },
    },
    {
      key: 8,
      label: "Chi tiết",
      css: css,
      type: INPUT,
      value: filterData.addressDetail,
      allowClear: true,
      onChange: (value: any) => {
        setFilterData({ ...filterData, addressDetail: value.target.value });
      },
    },
    {
      key: 8.5,
      label: "Mã kho",
      css: css,
      allowClear: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.assetCode,
      onChange: (e: any) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          assetCode: e.target.value,
        })),
    },
    {
      key: 9,
      label: "Hiệu lực từ ngày",
      allowClear: true,
      type: DATE_PICKER,
      css: css,
      placeholder: dateFormat,
      formatDatetime: dateFormat,
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
      placeholder: dateFormat,
      formatDatetime: dateFormat,
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
      key: 11,
      label: "Vị trí",
      type: SELECT,
      css: css,
      value: filterData.positionId,
      options: listPositionOptions,
      allowClear: true,
      onChange: (value: number) =>
        setFilterData({ ...filterData, positionId: value }),
    },
    {
      ...(props.assetType === 1 && {
        key: 11,
        label: "Tên chung cư/dự án",
        css: css,
        type: INPUT,
        value: filterData.projectName,
        allowClear: true,
        onChange: (value: any) => {
          setFilterData({ ...filterData, projectName: value.target.value });
        },
      }),
    } as InputFiledParams,
    {
      ...(props.assetType === 1 && {
        key: 8,
        label: "Tòa nhà thực tế",
        css: css,
        type: INPUT,
        value: filterData.building,
        allowClear: true,
        onChange: (value: any) => {
          setFilterData({ ...filterData, building: value.target.value });
        },
      }),
    } as InputFiledParams,
  ];

  const inputSearchAdvanced: InputFiledParams[] = [
    {
      key: 12,
      label: "Số hồ sơ pháp lý",
      type: INPUT,
      css: css,
      value: filterData.legal,
      allowClear: true,
      onChange: (e: any) =>
        setFilterData({ ...filterData, legal: e.target.value }),
    },
    {
      key: 13,
      label: "Số tờ bản đồ",
      type: INPUT,
      css: css,
      value: filterData.mapSheetNumber,
      allowClear: true,
      onChange: (e: any) =>
        setFilterData({ ...filterData, mapSheetNumber: e.target.value }),
    },
    {
      key: 14,
      label: "Số thửa",
      type: INPUT,
      css: css,
      value: filterData.landPlotNumber,
      allowClear: true,
      onChange: (e: any) =>
        setFilterData({ ...filterData, landPlotNumber: e.target.value }),
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
        <Row justify={"space-between"} style={{ marginBottom: "4px" }}>
          <CardTitleCustomUpdate title="Tìm kiếm" />
          <div
            style={{ height: "22px", display: "flex", alignItems: "center" }}
          >
            {searchText()}
          </div>
        </Row>
        {collapse ? (
          <>
            <Form labelAlign="left" labelWrap size="small">
              <Row gutter={[8, 4]}>
                <InputFields
                  data={inputSearchBasic.filter((item) => item.key)}
                />
                {collapse === 2 ? (
                  <>
                    <InputFields
                      data={inputSearchAdvanced.filter((item) => item.key)}
                    />
                    <Col
                      xs={css.xs}
                      sm={css.sm}
                      md={css.md}
                      lg={css.lg}
                      xl={css.xl}
                    >
                      <Form.Item
                        className="form-item-manual"
                        colon={false}
                        label={
                          <Tooltip
                            placement="bottom"
                            title={"Giá trị định giá"}
                          >
                            Giá trị định giá
                          </Tooltip>
                        }
                        labelCol={labelCol}
                        wrapperCol={wrapperCol}
                      >
                        <Row gutter={[4, 24]}>
                          <Col span={12}>
                            <FormItem
                              type={INPUT_NUMBER}
                              label={"Từ"}
                              value={filterData.priceFrom}
                              onChange={(value: number) =>
                                setFilterData({
                                  ...filterData,
                                  priceFrom: value,
                                })
                              }
                            />
                          </Col>
                          <Col span={12}>
                            <FormItem
                              type={INPUT_NUMBER}
                              label={"Đến"}
                              value={filterData.priceTo}
                              onChange={(value: number) =>
                                setFilterData({ ...filterData, priceTo: value })
                              }
                            />
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <></>
                )}
                <Col
                  xs={collapse === 2 ? 24 - 2 * css.xs : 24}
                  sm={collapse === 2 ? 24 - 2 * css.sm : 24}
                  md={collapse === 2 ? 24 - 2 * css.md : 24}
                  lg={collapse === 2 ? 24 - 2 * css.lg : 24}
                  xl={collapse === 2 ? 24 - 2 * css.xl : 24}
                  style={{ justifyContent: "end", display: "flex" }}
                >
                  <Space style={{ width: "fit-content" }}>
                    <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        props.setFilters({
                          assetType: props.assetType,
                          approved: props.filters.approved,
                          dateFrom: null,
                          dateTo: null,
                        });
                        setFilterData({
                          assetType: props.assetType,
                          approved: props.filters.approved,
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
                  </Space>
                </Col>
              </Row>
            </Form>
          </>
        ) : null}
      </Card>
    </div>
  );
});

export default ListTSSSFilter;
