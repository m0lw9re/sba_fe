import { Col, DatePickerProps, Form, Row, Space, Typography } from "antd";
import { addressApi } from "apis/adress";
import { assetCommonApi } from "apis/assetCommon";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import { APPRAISAL_STATUS_OPTIONS } from "constant/common";
import {
  DATE_TIME_FORMAT,
  LOCAL_STORAGE_KEY,
  TYPE_FIELD,
} from "constant/enums";
import {
  FilterAppraisalFileTest,
  FilterAppraisalFileType,
} from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesFilter/style.scss";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { CollapseCustom } from "components/CollapseCustom";
import { RootState } from "configs/configureStore";
import { useSelector } from "react-redux";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { feeNotificationStatus } from "constant/types/fee";

type Props = {
  filters: FilterAppraisalFileType;
  setFilters: (filters: FilterAppraisalFileType) => void;
};

const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };

const AppraisalFilesFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const globalState = useSelector((state: RootState) => state.globalSlice);
  const [filterData, setFilterData] = useState<FilterAppraisalFileTest>({
    startDate: null,
    endDate: null,
    approveEndDate: null,
    approveStartDate: null,
    sendReportResultStartDate: null,
    sendReportResultEndDate: null,
    signatureEndDate: null,
    signatureStartDate: null,
  });
  const [filtersStorage, setFiltersStorage] = useState<FilterAppraisalFileType>(
    {}
  );

  const [assetsData, setAssetsData] = useState<{
    levelTwo: Array<any>;
    levelThree: Array<any>;
  }>({ levelTwo: [], levelThree: [] });

  const [addressData, setAddressData] = useState<{
    districts: Array<any>;
    wards: Array<any>;
  }>({ districts: [], wards: [] });

  const getAssetLevelTwo = async (levelOneValue: any) => {
    if (levelOneValue) {
      try {
        const res = await assetCommonApi.getAssetLevel2(levelOneValue);
        setAssetsData((prevAssetsData) => ({
          ...prevAssetsData,
          levelTwo: res.data?.map((item: any) => ({
            value: item.assetLevelTwoId.toString(),
            label: item.assetLevelTwoName,
          })),
        }));
        await getAssetLevelThree(filterData.assetLevelTwoId);
      } catch (error) {}
    }
  };

  const getAssetLevelThree = async (levelTwoValue: any) => {
    if (levelTwoValue) {
      try {
        const res = await assetCommonApi.getAssetLevel3(levelTwoValue);
        setAssetsData((prevAssetsData) => ({
          ...prevAssetsData,
          levelThree: res.data?.map((item: any) => ({
            value: item.assetLevelThreeId.toString(),
            label: item.assetLevelThreeName,
          })),
        }));
      } catch (error) {}
    }
  };

  const getDistricts = async (districtValue: any) => {
    try {
      const res = await addressApi.getDistricts({
        code: districtValue,
      });
      setAddressData((prevAddressData) => ({
        ...prevAddressData,
        districts: res.data?.map((item: any) => ({
          value: item.code,
          label: item.fullName,
        })),
      }));

      await getWards(filterData.district);
    } catch (error) {}
  };

  const getWards = async (wardValue: any) => {
    try {
      const res = await addressApi.getWards({
        code: wardValue,
      });
      setAddressData((prevAddressData) => ({
        ...prevAddressData,
        wards: res.data?.map((item: any) => ({
          value: item.code,
          label: item.fullName,
        })),
      }));
    } catch (error) {}
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
      const storedParams = localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL);

      let currentKey = window.history.state?.key;
      let prevKey;

      // Set prevKey in the first run
      if (!localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL_KEY)) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.APPRAISAL_KEY,
          JSON.stringify({ prevKey: null })
        );
      }

      // Get prevKey from localStorage and parse it as JSON
      prevKey = localStorage.getItem(LOCAL_STORAGE_KEY.APPRAISAL_KEY);
      prevKey = prevKey !== null ? JSON.parse(prevKey) : null;

      // Log previous key and current key
      // console.log("Prev key: ", prevKey?.prevKey);
      // console.log("Current key: ", currentKey);

      // Update prevKey with currentKey
      localStorage.setItem(
        LOCAL_STORAGE_KEY.APPRAISAL_KEY,
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
        localStorage.removeItem(LOCAL_STORAGE_KEY.APPRAISAL);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.APPRAISAL);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (filterData.assetLevelOneId) {
      getAssetLevelTwo(filterData.assetLevelOneId);
    } else {
      setFilterData((prevFilterData) => ({
        ...prevFilterData,

        assetLevelTwoId: undefined,
        assetLevelThreeId: undefined,
      }));
      setAssetsData((prevState: any) => ({
        ...prevState,
        levelTwo: [],
        levelThree: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.assetLevelOneId]);

  useEffect(() => {
    if (filterData.assetLevelTwoId) {
      getAssetLevelThree(filterData.assetLevelTwoId);
    } else {
      setFilterData((prevFilterData) => ({
        ...prevFilterData,

        assetLevelThreeId: undefined,
      }));
      setAssetsData((prevState: any) => ({
        ...prevState,
        levelThree: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.assetLevelTwoId]);

  useEffect(() => {
    if (filterData.province) {
      getDistricts(filterData.province);
    } else {
      // setFilterData({ ...filterData, district: undefined, ward: undefined });
      setFilterData((prevFilterData) => ({
        ...prevFilterData,

        district: undefined,
        ward: undefined,
      }));
      setAddressData((prevState: any) => ({
        ...prevState,
        districts: [],
        wards: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.province]);

  useEffect(() => {
    if (filterData.district) {
      getWards(filterData.district);
    } else {
      // setFilterData({ ...filterData, ward: undefined });
      setFilterData((prevFilterData) => ({
        ...prevFilterData,

        ward: undefined,
      }));
      setAddressData((prevState: any) => ({
        ...prevState,
        wards: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.district]);

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilters({
        ...filters,
        ...value,
      });
      localStorage.setItem(
        LOCAL_STORAGE_KEY.APPRAISAL,
        JSON.stringify({
          ...filters,
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
      label: "Thời gian gửi đề nghị từ",
      css: css,
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

          startDate: dayjs(value).hour(0).minute(0).second(0).valueOf(),
        }));
      },
    },
    {
      key: 2,
      label: "Thời gian gửi đề nghị đến",
      css: css,
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

          endDate: dayjs(value).hour(23).minute(59).second(59).valueOf(),
        }));
      },
    },
    {
      key: 3,
      label: "Đơn vị đề nghị",
      type: SELECT,
      options: globalState.sacombankUnitOptions,
      css: css,
      value: filterData.proposalUnit || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          proposalUnit: value,
        }));
      },
    },
    {
      key: 4,
      label: "Thời gian phê duyệt từ",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.approveStartDate
        ? dayjs(filterData.approveStartDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.approveEndDate) {
          return disabledStartDate(value, filterData.approveEndDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          approveStartDate: dayjs(value).hour(0).minute(0).second(0).valueOf(),
        }));
      },
    },
    {
      key: 5,
      label: "Thời gian phê duyệt đến",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.approveEndDate
        ? dayjs(filterData.approveEndDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.approveStartDate) {
          return disabledEndDate(value, filterData.approveStartDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          approveEndDate: dayjs(value).hour(23).minute(59).second(59).valueOf(),
        }));
      },
    },
    {
      key: 6,
      label: "Đơn vị định giá",
      type: SELECT,
      options: globalState.branchOptions,
      css: css,
      value: filterData.appraisalUnit || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          appraisalUnit: value,
        }));
      },
    },
    {
      key: 7,
      label: "Thời điểm TBKQ từ",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.sendReportResultStartDate
        ? dayjs(filterData.sendReportResultStartDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.sendReportResultEndDate) {
          return disabledStartDate(value, filterData.sendReportResultEndDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          sendReportResultStartDate: dayjs(value)
            .hour(0)
            .minute(0)
            .second(0)
            .valueOf(),
        }));
      },
    },
    {
      key: 8,
      label: "Thời điểm TBKQ đến",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.sendReportResultEndDate
        ? dayjs(filterData.sendReportResultEndDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.sendReportResultStartDate) {
          return disabledEndDate(value, filterData.sendReportResultStartDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          sendReportResultEndDate: dayjs(value)
            .hour(23)
            .minute(59)
            .second(59)
            .valueOf(),
        }));
      },
    },
    {
      key: 9,
      label: "Trạng thái hồ sơ",
      type: SELECT,
      options: APPRAISAL_STATUS_OPTIONS,
      css: css,
      value: filterData.fileStatusId || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          fileStatusId: value,
        }));
      },
    },
    {
      key: 27,
      label: "Thời điểm gửi KQ từ",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.sendEndResultStartDate
        ? dayjs(filterData.sendEndResultStartDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.sendEndResultEndDate) {
          return disabledStartDate(value, filterData.sendEndResultEndDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          sendEndResultStartDate: dayjs(value)
            .hour(0)
            .minute(0)
            .second(0)
            .valueOf(),
        }));
      },
    },
    {
      key: 28,
      label: "Thời điểm gửi KQ đến",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.sendEndResultEndDate
        ? dayjs(filterData.sendEndResultEndDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.sendEndResultStartDate) {
          return disabledEndDate(value, filterData.sendEndResultStartDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          sendEndResultEndDate: dayjs(value)
            .hour(23)
            .minute(59)
            .second(59)
            .valueOf(),
        }));
      },
    },
    {
      key: 26,
      label: "CV khảo sát",
      type: INPUT,
      css: css,
      value: filterData.surveyGuide,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          surveyGuide: e.target.value,
        }));
      },
    },
    {
      key: 10,
      label: "Thời điểm ký số từ",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.signatureStartDate
        ? dayjs(filterData.signatureStartDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.signatureEndDate) {
          return disabledStartDate(value, filterData.signatureEndDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          signatureStartDate: dayjs(value)
            .hour(0)
            .minute(0)
            .second(0)
            .valueOf(),
        }));
      },
    },
    {
      key: 11,
      label: "Thời điểm ký số đến",
      css: css,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.signatureEndDate
        ? dayjs(filterData.signatureEndDate)
        : null,
      allowClear: true,
      disabledDate: (value: any) => {
        if (filterData?.signatureStartDate) {
          return disabledEndDate(value, filterData.signatureStartDate);
        }
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,

          signatureEndDate: dayjs(value)
            .hour(23)
            .minute(59)
            .second(59)
            .valueOf(),
        }));
      },
    },
    {
      key: 12,
      label: "Trạng thái phí",
      type: SELECT,
      options: feeNotificationStatus,
      css: css,
      value: filterData.feeStatus || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          feeStatus: value,
        }));
      },
    },
    {
      key: 13,
      label: "Tỉnh/Thành phố",
      type: SELECT,
      options: globalState.provinceOptions,
      css: css,
      showSearch: true,
      value: filterData.province || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          province: value,
          district: undefined,
          ward: undefined,
        }));
      },
    },
    {
      key: 14,
      label: "Quận/Huyện/Thị xã",
      type: SELECT,
      options: addressData.districts,
      css: css,
      showSearch: true,
      value: filterData.district || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          district: value,
          ward: undefined,
        }));
      },
    },
    {
      key: 15,
      label: "Xã/Phường/Thị trấn",
      type: SELECT,
      options: addressData.wards,
      css: css,
      showSearch: true,
      value: filterData.ward || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          ward: value,
        }));
      },
    },
    {
      key: 16,
      label: "Đường phố",
      type: INPUT,
      //options: [],
      css: css,
      value: filterData.street || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          street: e.target.value,
        }));
      },
    },
    {
      key: 17,
      label: "Tên khách hàng",
      type: INPUT,
      css: css,
      value: filterData.customerName || null,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          customerName: e.target.value,
        }));
      },
    },
    {
      key: "climsCode",
      label: "Mã Clims",
      type: INPUT,
      css: css,
      value: filterData.climsCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          climsCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 18,
      label: "Mã đề nghị",
      type: INPUT,
      css: css,
      value: filterData.proposalCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          proposalCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 19,
      label: "Mã tài sản",
      type: INPUT,
      css: css,
      value: filterData.assetCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          assetCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 20,
      label: "Số tờ trình",
      type: INPUT,
      css: css,
      value: filterData.reportCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          reportCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 21,
      label: "Loại tài sản",
      type: SELECT,
      options: globalState.assetLevelOneOptions,
      css: css,
      value: filterData.assetLevelOneId || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          assetLevelOneId: value,
          assetLevelTwoId: undefined,
          assetLevelThreeId: undefined,
        }));
      },
    },
    {
      key: 22,
      label: "Loại hình tài sản",
      type: SELECT,
      options: assetsData.levelTwo,
      css: css,
      value: filterData.assetLevelTwoId || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          assetLevelTwoId: value,
          assetLevelThreeId: undefined,
        }));
      },
    },
    {
      key: 23,
      label: "Phân loại tài sản",
      type: SELECT,
      options: assetsData.levelThree,
      css: css,
      value: filterData.assetLevelThreeId || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          assetLevelThreeId: value,
        }));
      },
    },
    {
      key: 24,
      label: "Mục đích thẩm định",
      type: SELECT,
      options: globalState.appraisalPurposeOptions,
      css: css,
      value: filterData.appraisalPurposeId || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          appraisalPurposeId: value,
        }));
      },
    },
    {
      key: 25,
      label: "Người gửi",
      type: INPUT,
      css: css,
      value: filterData.rmName,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          rmName: e.target.value,
        }));
      },
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
                    setFilterData({
                      startDate: null,
                      endDate: null,
                      approveEndDate: null,
                      approveStartDate: null,
                    });
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
            </Form>
          ),
        },
      ]}
    />
  );
};

export default AppraisalFilesFilter;
