import { Row, Space, Typography, Form, DatePickerProps } from "antd";
import "pages/CategoryManage/CategoryRisk/components/CategoryRiskFilter/style.scss";
import React, { useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { AssetLevelTwoType, feeScheduleFilter } from "constant/types";
import { useAssetLevelTwoAll, useFeeScheduleNew } from "utils/request";
import { assetCommonApi } from "apis/assetCommon";
import dayjs from "dayjs";

type Props = {
  filters: feeScheduleFilter;
  setFilters: (filters: feeScheduleFilter) => void;
};

const { INPUT, SELECT, INPUT_NUMBER, DATE_PICKER } = TYPE_FIELD;

const FilterFeeSchedule: React.FC<Props> = ({ filters, setFilters }) => {
  const [filterData, setFilterData] = useState<feeScheduleFilter>({});

  const [assetsData, setAssetsData] = useState<{
    levelThree: Array<any>;
  }>({ levelThree: [] });

  const assetLV2 = useAssetLevelTwoAll();

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

  useEffect(() => {
    if (filterData.assetLevelTwo) {
      getAssetLevelThree(filterData.assetLevelTwo);
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
  }, [filterData.assetLevelTwo]);

  const css = { xs: 24, sm: 24, md: 24, lg: 8, xl: 8 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Loại hình tài sản",
      type: SELECT,
      options:
        assetLV2?.data?.map((item: AssetLevelTwoType) => {
          return {
            label: item.assetLevelTwoName,
            value: item.assetLevelTwoId,
          };
        }) || [],
      css: css,
      value: filterData.assetLevelTwo || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          assetLevelTwo: value,
          assetLevelThree: undefined,
        }));
      },
    },
    {
      key: 2,
      label: "Phân loại tài sản",
      type: SELECT,
      options: assetsData.levelThree,
      css: css,
      value: filterData.assetLevelThree || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          assetLevelThree: value,
        }));
      },
    },
    {
      key: 3,
      label: "Biểu phí",
      type: INPUT,
      css: css,
      value: filterData.feeCode || null,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          feeCode: e.target.value,
        }));
      },
    },
    {
      key: 4,
      label: "Giá trị TSTĐ từ (đồng)",
      type: INPUT_NUMBER,
      css: css,
      value: filterData.assetValidationForm || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          assetValidationForm: value,
        }));
      },
      currencable: true,
    },
    {
      key: 5,
      label: "Giá trị TSTĐ đến (đồng)",
      type: INPUT_NUMBER,
      css: css,
      value: filterData.assetValidationUpTo || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          assetValidationUpTo: value || null,
        }));
      },
      currencable: true,
    },
    {
      key: 6,
      label: "Mức phí tối thiểu",
      type: INPUT_NUMBER,
      css: css,
      value: filterData.minimumFee || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          minimumFee: value,
        }));
      },
      currencable: true,
    },
    {
      key: 7,
      label: "Mức phí tối đa HSTĐ mới (đồng)",
      type: INPUT_NUMBER,
      css: css,
      value: filterData.maximumFeeHstdNew || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          maximumFeeHstdNew: value,
        }));
      },
      currencable: true,
    },
    {
      key: 8,
      label: "Mức phí tối đa HSTĐ tái cấp (đồng)",
      type: INPUT_NUMBER,
      css: css,
      value: filterData.maximumFeeReissued || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          maximumFeeReissued: value,
        }));
      },
      currencable: true,
    },
    {
      key: 9,
      label: "Mức phí",
      type: SELECT,
      options: [
        {
          label: "Giá trị TSTĐ (đồng)",
          value: 0,
        },
        {
          label: "% giá trị TSTĐ",
          value: 1,
        },
      ],
      value: filterData?.feeLevel === undefined ? null : filterData?.feeLevel,
      onChange: (value: number) =>
        setFilterData({
          ...filterData,
          feeLevel: value,
        }),
      css: css,
      allowClear: true,
    },
    {
      key: 10,
      label: "Mức phí TĐHS mới",
      type: INPUT_NUMBER,
      css: css,
      value: filterData.newHstdRegistrationFee || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          newHstdRegistrationFee: value,
        }));
      },
      currencable: true,
    },
    {
      key: 11,
      label: "Mức phí TĐHS tái cấp",
      type: INPUT_NUMBER,
      css: css,
      value: filterData.registrationFeeHstdReissuance || null,
      allowClear: true,
      onChange: (value: number) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,

          registrationFeeHstdReissuance: value,
        }));
      },
      currencable: true,
    },
    {
      key: 12,
      label: "Trạng thái hiệu lực",
      type: SELECT,
      css: css,
      options: [
        {
          label: "Hoạt động",
          value: 0,
        },
        {
          label: "Không hoạt động",
          value: 1,
        },
        {
          label: "Xoá",
          value: 2,
        },
      ],
      value: filterData?.status === undefined ? null : filterData?.status,
      onChange: (value: number) =>
        setFilterData({
          ...filterData,
          status: value,
        }),
    },
    {
      key: 13,
      label: "Hiệu lực từ ngày",
      allowClear: true,
      type: DATE_PICKER,
      css: css,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.effectiveFrom ? dayjs(filterData.effectiveFrom) : null,

      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          effectiveFrom: value
            ? dayjs(value).hour(0).minute(0).second(0).toISOString()
            : null,
        }));
      },
    },
    {
      key: 14,
      label: "Hiệu lực đến ngày",
      allowClear: true,
      type: DATE_PICKER,
      css: css,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.validUntil ? dayjs(filterData.validUntil) : null,
      // disabledDate: (value: any) => {
      //   if (filterData?.effectiveFrom) {
      //     return disabledEndDate(value, filterData.effectiveFrom);
      //   }
      // },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          validUntil: value
            ? dayjs(value).hour(23).minute(59).second(59).toISOString()
            : null,
        }));
      },
    },

    {
      key: 15,
      label: "Áp dụng ưu đãi",
      type: SELECT,
      options: [
        {
          label: "Có áp dụng ưu đãi",
          value: 1,
        },
        {
          label: "Không áp dụng ưu đãi",
          value: 0,
        },
      ],
      value:
        filterData?.applyPromotion === true
          ? 1
          : filterData?.applyPromotion === false
          ? 0
          : null,
      onChange: (value: number) =>
        setFilterData({
          ...filterData,
          applyPromotion: value === 1 ? true : value === 0 ? false : null,
        }),
      css: css,
      allowClear: true,
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
                  onClick={() => setFilters({ ...filterData })}
                />
              </Space>
            </Form>
          ),
        },
      ]}
    />
  );
};

export default FilterFeeSchedule;
