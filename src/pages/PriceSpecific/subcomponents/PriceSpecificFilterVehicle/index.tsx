import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePickerProps,
  Form,
  Row,
  Space,
  Tooltip,
  Typography
} from "antd";
import { addressApi } from "apis/adress";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import FormItem from "components/InputFields/FormItem";
import { RootState } from "configs/configureStore";
import { LOCAL_STORAGE_KEY, TYPE_FIELD } from "constant/enums";
import { AssetLevelThreeType, FilterSpecificPricesType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import "pages/PriceSpecific/subcomponents/PriceSpecificFilter/style.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { useAssetLevelThree, useAssetLevelThreeAll } from "utils/request";

type Props = {
  assetType: number;
  filters: FilterSpecificPricesType;
  setFilters: (filter: FilterSpecificPricesType) => void;
  assetLevelTwoId: number | null;
};

const { INPUT, SELECT, DATE_PICKER, INPUT_NUMBER } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 10, md: 10, lg: 10, xl: 12 };
const wrapperCol = { xs: 14, md: 14, lg: 14, xl: 12 };

const PriceSpecificVehicleFilter = (props: Props) => {
  const [filterData, setFilterData] = useState<FilterSpecificPricesType>({
    dateFrom: null,
    dateTo: null,
  });
  const {
    provinceOptions,
    infoSourceOptions,
    listPositionOptions,
    categoryCommonsOptions,
  } = useSelector((state: RootState) => state.globalSlice);

  const navigate = useNavigate();
  const location = useLocation();

  const assetSWR = useAssetLevelThree(props.assetLevelTwoId)

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

  const dateFormat = "DD/MM/YYYY";

  useEffect(() => {
    if (filtersStorage) {
      setFilterData((prevFilterData) => ({
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

      // Log previous key and current key
      // console.log("Prev key: ", prevKey?.prevKey);
      // console.log("Current key: ", currentKey);

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
    {
      key: 1,
      label: "Phân loại tài sản",
      type: SELECT,
      css: css,
      options: assetSWR
        ? assetSWR?.data?.map((item: AssetLevelThreeType) => ({
            label: item.assetLevelThreeName,
            value: item.assetLevelThreeId,
          }))
        : [],
      value: filterData.assetLevelThreeId,
      require: true,
      onChange: (value: any) =>
        setFilterData({ ...filterData, assetLevelThreeId: value }),
    },
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
    // {
    //   key: 3,
    //   allowClear: true,
    //   label: "Mục đích sử dụng đất",
    //   type: SELECT,
    //   css: css,
    //   value: filterData.usingPurposeId || null,
    //   options:
    //     landEstateUsings?.data?.content?.map((item: any) => {
    //       return {
    //         label: item.usingPurposeName,
    //         value: item.usingPurposeId,
    //       };
    //     }) || [],
    //   onChange: (value: number) => {
    //     setFilterData((prevFilterData) => ({
    //       ...prevFilterData,
    // 
    //       usingPurposeId: value,
    //     }));
    //   },
    // },
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
    // {
    //   key: 8,
    //   label: "Đường phố",
    //   css: css,
    //   type: INPUT,
    //   allowClear: true,
    //   value: filterData.addressStreet || null,
    //   onChange: (e: any) => {
    //     setFilterData((prevFilterData) => ({
    //       ...prevFilterData,
    // 
    //       addressStreet: e.target.value,
    //       assetType: props.assetType,
    //       approved: prevFilterData.approved,
    //     }));
    //   },
    // },
    {
      key: 8,
      label: "Mô tả chi tiết",
      css: css,
      type: INPUT,
      allowClear: true,
      value: filterData.addressDetail || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          
          addressDetail: e.target.value,
          assetType: props.assetType,
          approved: prevFilterData.approved,
        }));
      },
    },
    {
      key: 9,
      label: "Mã kho",
      type: INPUT,
      css: css,
      value: filterData.assetCode,
      onChange: (e: any) =>
        setFilterData({ ...filterData, assetCode: e.target.value }),
    },
     {
      key: 10,
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
  ]

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
                <Col
                  xs={css.xs}
                  lg={css.lg}
                  xl={css.xl}
                  style={{
                    justifyContent: "end",
                    display: "flex",
                  }}
                >
                  <Space>
                  <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        // props.setFilters({
                        //   assetType: props.assetType,
                        //   approved: props.filters.approved,
                        // });
                        // setFilterData({
                        //   assetType: props.assetType,
                        //   approved: props.filters.approved,
                        // });
                        props.setFilters({
                          assetType: props.assetType,
                          approved: props.filters.approved,
                          dateFrom: null,
                          dateTo: null,
                        });
                        setFilterData((prevFilterData) => ({
                          assetType: props.assetType,
                          
                          approved: prevFilterData.approved,
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
          ),
        },
      ]}
    />
  );
};

export default PriceSpecificVehicleFilter;
