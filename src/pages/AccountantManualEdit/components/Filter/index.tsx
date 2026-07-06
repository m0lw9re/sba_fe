import { DatePickerProps, Form, Row, Space, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import {
  DATE_TIME_FORMAT,
  TYPE_FIELD,
  LOCAL_STORAGE_KEY,
} from "constant/enums";
import { FilterAccountantFeeNotificationsUpdate } from "constant/types";
import { debtStatusOptions } from "constant/types/fee";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useStaffByRole } from "utils/request";
import { useLocation, useNavigate } from "react-router-dom";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterAccountantFeeNotificationsUpdate;
  setFilters: (filters: FilterAccountantFeeNotificationsUpdate) => void;
};

const Filter: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] =
    useState<FilterAccountantFeeNotificationsUpdate>({
      startDate: null,
      endDate: null,
    });

    const globalState = useSelector((state: RootState) => state.globalSlice);

  const {
    data: dataStaff,
    isLoading: isLoadingStaff,
    error: errorStaff,
    mutate: mutateStaff,
  } = useStaffByRole("CVTD");

  const [filtersStorage, setFiltersStorage] =
    useState<FilterAccountantFeeNotificationsUpdate>({
      startDate: null,
      endDate: null,
    });
  const location = useLocation();
  const navigate = useNavigate();

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Từ ngày",
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.startDate ? dayjs(filterData.startDate) : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.endDate) {
          return disabledStartDate(value, filterData.endDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,
          startDate: dayjs(value).valueOf(),
          isFiltering: true,
        }));
      },
    },
    {
      key: 2,
      label: "Đến ngày",
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.endDate
        ? dayjs(filterData.endDate)
        : filters.endDate
        ? dayjs(filters.endDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.startDate) {
          return disabledEndDate(value, filterData.startDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,
          endDate: dayjs(value).valueOf(),
          isFiltering: true,
        }));
      },
    },
    {
      key: 3,
      label: "Trạng thái",
      type: SELECT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      options: debtStatusOptions,
      value: filterData.statusId,
      onChange: (value: number) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          statusId: value,
          isFiltering: true,
        })),
    },
    {
      key: 4,
      label: "Chi nhánh STB",
      type: SELECT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      options: globalState.sacombankUnitOptions,
      value: filterData.branchName,
      onChange: (value: string | null) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          branchName: value,
          isFiltering: true,
        })),
    },
    // {
    //   key: 5,
    //   label: "Công nợ",
    //   type: SELECT,
    //   css: css,
    //   wrapperCol: wrapperCol,
    //   labelCol: labelCol,
    //   options: debtOptions,
    //   value: filterData.congNo,
    //   onChange: (value: number) =>
    //     setFilterData((prevFilterData) => ({
    //       ...prevFilterData,
    //       congNo: value,
    //       isFiltering: true,
    //     })),
    // },
    // {
    //   key: 6,
    //   label: "Số tiền",
    //   type: SELECT,
    //   css: css,
    //   wrapperCol: wrapperCol,
    //   labelCol: labelCol,
    //   options: priceOptions,
    //   value: filterData.price,
    //   onChange: (value: number) =>
    //     setFilterData((prevFilterData) => ({
    //       ...prevFilterData,
    //       price: value,
    //       isFiltering: true,
    //     })),
    // },
    {
      key: 7,
      label: "CVTĐ",
      type: SELECT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      options:
        (Array.isArray(dataStaff) &&
          dataStaff
            .filter((item: any) => item.username)
            .map((item: any, index: number) => ({
              key: index.toString(),
              label: item.username + " ",
              value: item.username,
            }))) ||
        [],
      value: filterData.whoCreate,
      onChange: (value: string | null) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          whoCreate: value,
          isFiltering: true,
        })),
    },
    {
      key: 10,
      label: "Đã thu",
      type: SELECT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      options: [
        { label: "Đã thu", value: 1 },
        { label: "Chưa thu", value: 2 },
      ],
      value: filterData.daThu,
      onChange: (value: number) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          daThu: value,
          isFiltering: true,
        })),
    },
    {
      key: 8,
      label: "Số tờ trình",
      type: INPUT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: filterData.reportCode || null,
      onChange: (e: any) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          reportCode: e.target.value.trim(),
          isFiltering: true,
        })),
    },
    {
      key: 9,
      label: "Mã đề nghị",
      type: INPUT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: filterData.proposalCode || null,
      onChange: (e: any) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          proposalCode: e.target.value.trim(),
          isFiltering: true,
        })),
    },
  ];

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
      const storedParams = localStorage.getItem(LOCAL_STORAGE_KEY.DEBT);

      let currentKey = window.history.state?.key;
      let prevKey;

      // Set prevKey in the first run
      if (!localStorage.getItem(LOCAL_STORAGE_KEY.DEBT_KEY)) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.DEBT_KEY,
          JSON.stringify({ prevKey: null })
        );
      }

      // Get prevKey from localStorage and parse it as JSON
      prevKey = localStorage.getItem(LOCAL_STORAGE_KEY.DEBT_KEY);
      prevKey = prevKey !== null ? JSON.parse(prevKey) : null;

      // Log previous key and current key
      // console.log("Prev key: ", prevKey?.prevKey);
      // console.log("Current key: ", currentKey);

      // Update prevKey with currentKey
      localStorage.setItem(
        LOCAL_STORAGE_KEY.DEBT_KEY,
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
        localStorage.removeItem(LOCAL_STORAGE_KEY.DEBT);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.DEBT);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilters({
        ...filters,
        ...value,
      });
      localStorage.setItem(
        LOCAL_STORAGE_KEY.DEBT,
        JSON.stringify({
          ...filters,
          ...value,
        })
      );
    };
    const timer = setTimeout(() => {
      handleDebouncedChange(filterData);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  return (
    <CollapseCustom
      itemList={[
        {
          label: "Tìm kiếm",
          children: (
            <Form labelAlign="left" labelWrap size="large">
              <Row gutter={[16, 4]}>
                <InputFields data={inputSearchBasic} />
              </Row>
              <Row justify={"end"}>
                <Space size={"small"}>
                  <ButtonCustom
                    className="btn-del"
                    label="Xóa"
                    onClick={() => {
                      setFilters({ endDate: null, startDate: null });
                      setFilterData({
                        isFiltering: true,
                        endDate: null,
                        startDate: null,
                      });
                    }}
                  />
                  <ButtonCustom
                    className="btn-search"
                    label="Tìm kiếm"
                    bgColor="#2862AF"
                    type="primary"
                    onClick={() => {
                      setFilterData({ ...filterData });
                    }}
                  />
                </Space>
              </Row>
            </Form>
          ),
        },
      ]}
    />
  );
};

export default Filter;
