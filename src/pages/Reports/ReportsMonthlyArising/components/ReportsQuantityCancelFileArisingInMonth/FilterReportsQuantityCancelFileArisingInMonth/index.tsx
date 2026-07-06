import { DownOutlined } from "@ant-design/icons";
import { Form, Row, Space, Typography, message, Spin, Modal, Col } from "antd";
import { noteDocumentInMonth } from "apis/noteDocumentInMonth";
import { Excell } from "assets";
import ButtonCustom from "components/ButtonCustom";
import { CollapseCustom } from "components/CollapseCustom";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { FilterQuantityCancelFileArisingInMonth } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Staff } from "constants/types/common.type";
import React, { useEffect, useState } from "react";
import { useStaffByRole } from "utils/request";
import { saveAs } from "file-saver";
import "./style.scss";
import { RootState } from "configs/configureStore";
import { useSelector } from "react-redux";
import { BUTTON_CODES } from "constant/common";

const { SELECT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type Props = {
  filters: FilterQuantityCancelFileArisingInMonth;
  setFilters: (filters: FilterQuantityCancelFileArisingInMonth) => void;
};

const QuantityCancelFileArisingInMonthFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const month = filters.month || ``;
  const year = filters.year || ``;

  const [filterData, setFilterData] =
    useState<FilterQuantityCancelFileArisingInMonth>({ year: year });

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

  const { provinceOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const {
    data: dataStaff,
    isLoading: isLoadingStaff,
    error: errorStaff,
    mutate: mutateStaff,
  } = useStaffByRole("CVTD");

  const listStaff = dataStaff?.filter((staff: any) => staff.belongs === 1);

  const exportExcell = async () => {
    try {
      setExporting(true);
      const res = await noteDocumentInMonth.exportExcell(
        {
          ...filterData,
        },
        "cancel"
      );
      var blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Hs_huy_phat_sinh_thang.xlsx");
    } catch (error) {
      // message.error("Xuất báo cáo thất bại!");
      message.error(
        `Không tìm thấy hồ sơ hủy phát sinh trong tháng ${month} năm ${year}!`
      );
    } finally {
      setExporting(false);
    }
  };

  const showConfirm = () => {
    const month = filters.month || `${new Date().getMonth() + 1}`;
    const year = filters.year || `${new Date().getFullYear()}`;

    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xuất báo cáo của tháng ${month} năm ${year}?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        exportExcell();
      },
    });
  };

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 6,
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
      defaultValue: `${new Date().getFullYear()}`,
      value: filterData.year,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          year: value,
        }));
      },
    },
    {
      key: 1,
      label: "Tháng",
      type: SELECT,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      // disable: filterData.year ? false : true,
      // defaultValue: `${new Date().getMonth() + 1}`,
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

    {
      key: 2,
      label: "Chi nhánh/Phòng GD",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.transOfficeCode,
      options: globalState.sacombankUnitOptions,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          transOfficeCode: value,
        }));
      },
      allowClear: true,
    },
    {
      key: 3,
      label: "Tỉnh/Thành phố",
      type: SELECT,
      options: provinceOptions,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      showSearch: true,
      value: filterData.provinceCode || null,
      allowClear: true,
      onChange: (value: any) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          provinceCode: value,
        }));
      },
    },
    {
      key: 4,
      label: "Thẩm định viên",
      type: SELECT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      options: listStaff
        ? listStaff.map((item: Staff) => ({
            label: item.username,
            value: item.staffId,
          }))
        : [],
      value: filterData.staffId,
      onChange: (value: string | null) =>
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          staffId: value,
        })),
    },
    {
      key: 5,
      label: "Đơn vị định giá",
      type: SELECT,
      options: globalState.branchOptions,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: filterData.appraisalUnit || null,
      allowClear: true,
      onChange: (value: string) => {
        setFilterData((prevFilterData) => ({
          ...prevFilterData,
          isFiltering: true,
          appraisalUnit: value,
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
                  justifyContent: "end",
                  display: "flex",
                  marginTop: "4px"
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
                  onClick={showConfirm}
                  disabled={exporting}
                  code={BUTTON_CODES.bchspst_export}
                />
                <ButtonCustom
                  className="btn-del"
                  label="Xóa"
                  onClick={() => {
                    setFilters({});
                    setFilterData({});
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

export default QuantityCancelFileArisingInMonthFilter;
