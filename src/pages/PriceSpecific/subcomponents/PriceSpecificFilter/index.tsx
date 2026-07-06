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
  message,
} from "antd";
import { addressApi } from "apis/adress";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import FormItem from "components/InputFields/FormItem";
import { RootState } from "configs/configureStore";
import { LOCAL_STORAGE_KEY, TYPE_FIELD } from "constant/enums";
import { FilterSpecificPricesType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import "pages/PriceSpecific/subcomponents/PriceSpecificFilter/style.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { disabledEndDate, disabledStartDate } from "utils/date";

type Props = {
  assetType: number;
  filters: FilterSpecificPricesType;
  setFilters: (filter: FilterSpecificPricesType) => void;
};
const dateFormat = "DD/MM/YYYY";
const { INPUT, SELECT, DATE_PICKER, INPUT_NUMBER } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 10, md: 10, lg: 10, xl: 12 };
const wrapperCol = { xs: 14, md: 14, lg: 14, xl: 12 };

const PriceSpecificFilter = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filterData, setFilterData] = useState<FilterSpecificPricesType>({
    assetType: props.assetType,
    approved: true,
    dateFrom: null,
    dateTo: null,
  });

  const {
    provinceOptions,
    infoSourceOptions,
    usingPurposeOptions,
    listPositionOptions,
    categoryCommonsOptions,
  } = useSelector((state: RootState) => state.globalSlice);

  const [collapse, setCollapse] = useState<number>(1);
  const [addressData, setAddressData] = useState<{
    addressDistrict: Array<any>;
    addressWard: Array<any>;
  }>({ addressDistrict: [], addressWard: [] });
  const [filtersStorage, setFiltersStorage] =
    useState<FilterSpecificPricesType>({ dateFrom: null, dateTo: null });

  const getDistricts = async (districtValue: any) => {
    try {
      const res = await addressApi.getDistricts({
        code: districtValue,
      });
      setAddressData((prevAddressData) => ({
        ...prevAddressData,
        addressDistrict: res.data?.map((item: any) => ({
          value: item.code,
          label: item.fullName,
        })),
      }));
      await getWards(filterData.addressDistrict);
    } catch (error) {}
  };

  const getWards = async (wardValue: any) => {
    try {
      const res = await addressApi.getWards({
        code: wardValue,
      });
      setAddressData((prevAddressData) => ({
        ...prevAddressData,
        addressWard: res.data?.map((item: any) => ({
          value: item.code,
          label: item.fullName,
        })),
      }));
    } catch (error) {}
  };

  useEffect(() => {
    if (filterData.addressProvince) {
      getDistricts(filterData.addressProvince);
    } else {
      // setFilterData({ ...filterData, district: undefined, ward: undefined });
      setFilterData((prevFilterData) => ({
        ...prevFilterData,

        addressDistrict: undefined,
        addressWard: undefined,
      }));
      setAddressData((prevState: any) => ({
        ...prevState,
        addressDistrict: [],
        addressWard: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.addressProvince]);

  useEffect(() => {
    if (filterData.addressDistrict) {
      getWards(filterData.addressDistrict);
    } else {
      // setFilterData({ ...filterData, ward: undefined });
      setFilterData((prevFilterData) => ({
        ...prevFilterData,

        addressWard: undefined,
      }));
      setAddressData((prevState: any) => ({
        ...prevState,
        addressWard: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.addressDistrict]);

  const handleCollapse = (value: number) => {
    setCollapse(value);
  };

  useEffect(() => {
    if (filtersStorage) {
      setFilterData((prevFilterData: any) => ({
        ...prevFilterData,

        ...filtersStorage,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersStorage]);

  useEffect(() => {
    const fetchData = async () => {
      const storedParams = localStorage.getItem(
        LOCAL_STORAGE_KEY.PRICE_SPECIFIC
      );

      let currentKey = window.history.state?.key;
      let prevKey;

      // Set prevKey in the first run
      if (!localStorage.getItem(LOCAL_STORAGE_KEY.PRICE_SPECIFIC_KEY)) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.PRICE_SPECIFIC_KEY,
          JSON.stringify({ prevKey: null })
        );
      }

      // Get prevKey from localStorage and parse it as JSON
      prevKey = localStorage.getItem(LOCAL_STORAGE_KEY.PRICE_SPECIFIC_KEY);
      prevKey = prevKey !== null ? JSON.parse(prevKey) : null;

      // Update prevKey with currentKey
      localStorage.setItem(
        LOCAL_STORAGE_KEY.PRICE_SPECIFIC_KEY,
        JSON.stringify({ prevKey: currentKey })
      );

      if (currentKey && currentKey === prevKey?.prevKey) {
        if (storedParams && storedParams !== "{}") {
          try {
            const parsedParams = JSON.parse(storedParams);
            setFiltersStorage((prevFilterData) => ({
              ...prevFilterData,
              ...parsedParams,
              isFiltering: false,
            }));
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY.PRICE_SPECIFIC);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.PRICE_SPECIFIC);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      props.setFilters({
        ...props.filters,
        ...value,
      });
      localStorage.setItem(
        LOCAL_STORAGE_KEY.PRICE_SPECIFIC,
        JSON.stringify({
          ...props.filters,
          ...value,
        })
      );
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
      allowClear: true,
      value: filterData.infoSourceId || null,
      options: infoSourceOptions,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          infoSourceId: value,
        }));
      },
    },
    {
      key: 3,
      allowClear: true,
      label: "Mục đích sử dụng đất",
      type: SELECT,
      css: css,
      value: filterData.usingPurposeId || null,
      options: usingPurposeOptions,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          usingPurposeId: value,
        }));
      },
    },
    {
      key: 4,
      label: "Phân loại kho",
      type: SELECT,
      css: css,
      allowClear: true,
      value: filterData.storedTypeId || null,
      options: categoryCommonsOptions,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          storedTypeId: value,
        }));
      },
    },
    {
      key: 5,
      label: "Tỉnh/Thành phố",
      type: SELECT,
      css: css,
      allowClear: true,
      options: provinceOptions,
      value: filterData.addressProvince || null,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          addressProvince: value,
          addressDistrict: null,
          addressWard: null,
        }));
      },
    },
    {
      key: 6,
      label: "Quận/Huyện/Thị xã",
      type: SELECT,
      css: css,
      allowClear: true,
      value: filterData.addressDistrict || null,
      options: addressData.addressDistrict,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          addressDistrict: value,
          addressWard: null,
        }));
      },
    },
    {
      key: 7,
      label: "Xã/Phường/Thị trấn",
      allowClear: true,
      type: SELECT,
      options: addressData.addressWard,
      css: css,
      value: filterData.addressWard || null,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          addressWard: value,
        }));
      },
    },
    {
      key: 8,
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
      key: 9,
      label: "Chi tiết",
      css: css,
      type: INPUT,
      allowClear: true,
      value: filterData.addressDetail || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          addressDetail: e.target.value,
        }));
      },
    },
    {
      key: 9.5,
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

          assetCode: e.target.value.trim(),
        })),
    },
    {
      key: 10,
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
      key: 11,
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
  ];

  const inputSearchAdvanced: InputFiledParams[] = [
    {
      key: 12,
      label: "Vị trí",
      allowClear: true,
      type: SELECT,
      css: css,
      value: filterData.positionId || null,
      options: listPositionOptions,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          positionId: value,
        }));
      },
    },
    // {
    //   key: 13,
    //   label: 'Mã kho',
    //   allowClear: true,
    //   type: INPUT,
    //   css: css,
    //   value: filterData.assetCode || null,
    //   onChange: (e: any) => {
    //     setFilterData(prevFilterData => ({
    //       ...prevFilterData,
    //       assetCode: e.target.value,
    //     }));
    //   },
    // },
    {
      key: 14,
      label: "Số hồ sơ pháp lý",
      type: INPUT,
      css: css,
      allowClear: true,
      value: filterData.legal || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          legal: e.target.value,
        }));
      },
    },
    {
      key: 15,
      label: "Số tờ bản đồ",
      type: INPUT,
      css: css,
      value: filterData.mapSheetNumber || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          mapSheetNumber: e.target.value,
        }));
      },
    },
    {
      key: 16,
      label: "Số thửa",
      type: INPUT,
      allowClear: true,
      css: css,
      value: filterData.landPlotNumber || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          landPlotNumber: e.target.value,
        }));
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

  return (
    <div
      className="price-specific-filter-container"
      onKeyDown={(e: any) => {
        if (e.key === "Enter") {
          props.setFilters({ ...filterData });
        }
      }}
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
                <InputFields data={inputSearchBasic} />
                {collapse === 2 ? (
                  <>
                    <InputFields data={inputSearchAdvanced} />
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
                              value={filterData.priceFrom || null}
                              onChange={(value: any) => {
                                setFilterData((prevFilterData) => ({
                                  ...prevFilterData,

                                  priceFrom: value,
                                }));
                              }}
                            />
                          </Col>
                          <Col span={12}>
                            <FormItem
                              type={INPUT_NUMBER}
                              label={"Đến"}
                              value={filterData.priceTo || null}
                              onChange={(value: any) => {
                                setFilterData((prevFilterData) => ({
                                  ...prevFilterData,

                                  priceTo: value,
                                }));
                              }}
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
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  // xs={collapse === 2 ? 24 - 2 * css.xs : 24}
                  // sm={collapse === 2 ? 24 - 2 * css.sm : 24}
                  // md={collapse === 2 ? 24 - 2 * css.md : 24}
                  // lg={collapse === 2 ? 24 - 2 * css.lg : 24}
                  // xl={collapse === 2 ? 24 - 2 * css.xl : 24}
                  style={{ justifyContent: "end", display: "flex" }}
                >
                  <Space style={{ width: "fit-content" }}>
                    <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        props.setFilters({
                          approved: true,
                          assetType: props.assetType,
                          dateFrom: null,
                          dateTo: null,
                        });
                        setFilterData((prevFilterData) => ({
                          approved: true,

                          assetType: props.assetType,
                          dateFrom: null,
                          dateTo: null,
                        }));
                      }}
                    />
                    <ButtonCustom
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => {
                        setFilterData({ ...filterData });
                      }}
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
};

export default PriceSpecificFilter;
