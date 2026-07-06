import { DownOutlined } from "@ant-design/icons";
import {
  Form,
  Row,
  Space,
  Typography,
  message,
  Spin,
  Modal,
  DatePickerProps,
} from "antd";
import { noteDocumentInMonth } from "apis/noteDocumentInMonth";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterQuantityFileArisingInMonth } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Staff } from "constants/types/common.type";
import React, { useEffect, useState } from "react";
import { useStaffByRole } from "utils/request";
import "./style.scss";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { APPRAISAL_STATUS_OPTIONS, BUTTON_CODES } from "constant/common";
import { addressApi } from "apis/adress";
import { assetCommonApi } from "apis/assetCommon";
import { feeNotificationStatus } from "constant/types/fee";
import dayjs from "dayjs";
import { disabledEndDate, disabledStartDate } from "utils/date";
import { configFilterAppraisalFile } from "utils/string";

const { DATE_PICKER, SELECT, INPUT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterQuantityFileArisingInMonth;
  setFilters: (filters: FilterQuantityFileArisingInMonth) => void;
};

const QuantityFileArisingInMonthFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [filterData, setFilterData] =
    useState<FilterQuantityFileArisingInMonth>({
      roleCode: null,
      year: null,
      month: null,
      approveEndDate: null,
      approveStartDate: null,
      startDate: null,
      endDate: null,
    });

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

  const [exporting, setExporting] = useState(false);

  const globalState = useSelector((state: RootState) => state.globalSlice);

  const {
    data: dataStaff,
    isLoading: isLoadingStaff,
    error: errorStaff,
    mutate: mutateStaff,
  } = useStaffByRole("CVTD");

  const listStaff = dataStaff?.filter((staff: any) => staff.belongs === 1);

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo hồ sơ phát sinh trong tháng?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await noteDocumentInMonth.exportExcell(
        configFilterAppraisalFile(filterData),
        "search"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Hs_phat_sinh_thang.xlsx");
    } catch (error) {
      // message.error("Xuất báo cáo thất bại!");
      message.error(`Không tìm thấy báo cáo!`);
    } finally {
      setExporting(false);
    }
  };

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

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Từ ngày",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.startDate ? dayjs(filterData.startDate) : null,
      disabledDate: (value: any) => {
        return disabledStartDate(value, filterData?.endDate || "");
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,
          startDate: dayjs(value).valueOf(),
        }));
      },
      allowClear: true,
    },
    {
      key: 2,
      label: "Đến ngày",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filterData.endDate ? dayjs(filterData.endDate) : null,
      disabledDate: (value: any) => {
        return disabledEndDate(value, filterData?.startDate || "");
      },
      onChange: (value: DatePickerProps["value"]) => {
        setFilterData((prevFilterData: any) => ({
          ...prevFilterData,
          endDate: dayjs(value).valueOf(),
        }));
      },
      allowClear: true,
    },
    {
      key: 3,
      label: "Chi nhánh/Phòng GD",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.proposalUnit,
      options: globalState.sacombankUnitOptions,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          proposalUnit: value,
        }));
      },
      allowClear: true,
    },
    {
      key: 4,
      label: "Thời gian phê duyệt từ",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
          approveStartDate: dayjs(value).valueOf(),
        }));
      },
    },
    {
      key: 5,
      label: "Thời gian phê duyệt đến",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
          approveEndDate: dayjs(value).valueOf(),
        }));
      },
    },
    {
      key: 6,
      label: "Đơn vị định giá",
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      label: "Tỉnh/Thành phố",
      type: SELECT,
      options: globalState.provinceOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 8,
      label: "Quận/Huyện/Thị xã",
      type: SELECT,
      options: addressData.districts,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 9,
      label: "Xã/Phường/Thị trấn",
      type: SELECT,
      options: addressData.wards,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 10,
      label: "Đường phố",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.street || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          street: e.target.value,
        }));
      },
    },
    {
      key: 11,
      label: "Tên khách hàng",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 12,
      label: "Thẩm định viên",
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: listStaff
        ? listStaff.map((item: Staff) => ({
            label: item.staffName,
            value: item.staffId,
          }))
        : [],
      css: css,
      showSearch: true,
      value: filterData.staffId || null,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          staffId: value,
        }));
      },
      allowClear: true,
      placeholder: "Chọn hoặc nhập tên thẩm định viên",
    },
    {
      key: 13,
      label: "Trạng thái hồ sơ",
      type: SELECT,
      options: APPRAISAL_STATUS_OPTIONS,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 14,
      label: "Trạng thái phí",
      type: SELECT,
      options: feeNotificationStatus,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: "climsCode",
      label: "Mã Clims",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.climsCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          climsCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 16,
      label: "Số tờ trình",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.reportCode || null,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          reportCode: e.target.value.trim(),
        }));
      },
    },
    {
      key: 17,
      label: "Mục đích thẩm định",
      type: SELECT,
      options: globalState.appraisalPurposeOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 18,
      label: "Người gửi",
      type: INPUT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.rmName,
      allowClear: true,
      onChange: (e: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          rmName: e.target.value,
        }));
      },
    },
    {
      key: 19,
      label: "Loại tài sản",
      type: SELECT,
      options: globalState.assetLevelOneOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 20,
      label: "Loại hình tài sản",
      type: SELECT,
      options: assetsData.levelTwo,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 21,
      label: "Phân loại tài sản",
      type: SELECT,
      options: assetsData.levelThree,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
      key: 22,
      label: "Năm",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: Array.from(
        { length: new Date().getFullYear() - 1991 + 1 },
        (_, index) => {
          const year = new Date().getFullYear() - index;
          return {
            label: `Năm ${year}`,
            value: `${year}`,
          };
        }
      ),
      value: filterData.year,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          year: value,
        }));
      },
    },
    {
      key: 23,
      label: "Tháng",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: [
        {
          label: "Tháng 1",
          value: "1",
        },
        {
          label: "Tháng 2",
          value: "2",
        },
        {
          label: "Tháng 3",
          value: "3",
        },
        {
          label: "Tháng 4",
          value: "4",
        },
        {
          label: "Tháng 5",
          value: "5",
        },
        {
          label: "Tháng 6",
          value: "6",
        },
        {
          label: "Tháng 7",
          value: "7",
        },
        {
          label: "Tháng 8",
          value: "8",
        },
        {
          label: "Tháng 9",
          value: "9",
        },
        {
          label: "Tháng 10",
          value: "10",
        },
        {
          label: "Tháng 11",
          value: "11",
        },
        {
          label: "Tháng 12",
          value: "12",
        },
      ],
      value: filterData.month,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          month: value,
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
                  label="Xuất báo cáo"
                  icon={
                    exporting ? (
                      <div className="spin-overlay">
                        <Spin className="spin" />
                      </div>
                    ) : (
                      <Excell />
                    )
                  }
                  className={`button-Report ${exporting ? "exporting" : ""}`}
                  size="small"
                  onClick={() => {
                    if (filters.month || filters.year) {
                      showConfirm();
                    } else if (
                      !(filters.month && filters.year) &&
                      !(filters.startDate && filters.endDate)
                    ) {
                      message.error(
                        "Vui lòng chọn từ ngày và đến ngày để xuất báo cáo!"
                      );
                    } else {
                      showConfirm();
                    }
                  }}
                  disabled={exporting}
                  code={BUTTON_CODES.bchspst_export}
                />
                <ButtonCustom
                  className="btn-del"
                  label="Xóa"
                  onClick={() => {
                    setFilters({
                      roleCode: null,
                      approveEndDate: null,
                      approveStartDate: null,
                      startDate: null,
                      endDate: null,
                      month: null,
                      year: null,
                    });
                    setFilterData({
                      roleCode: null,
                      approveEndDate: null,
                      approveStartDate: null,
                      startDate: null,
                      endDate: null,
                      month: null,
                      year: null,
                    });
                  }}
                />
                <ButtonCustom
                  className="btn-search"
                  label="Tìm kiếm"
                  bgColor="#2862AF"
                  type="primary"
                  onClick={() => {
                    setFilters({ ...filterData });
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

export default QuantityFileArisingInMonthFilter;
