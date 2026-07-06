import { Col, DatePickerProps, Form, Row, Space, Typography } from "antd";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { FilterAccountantApprove, StaffType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import React, { useEffect, useState } from "react";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import "pages/AccountManagement/UserList/UserListFilter/style.scss";
import { useStaffs } from "utils/request";
import dayjs from "dayjs";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  filters: FilterAccountantApprove;
  setFilter: (filters: FilterAccountantApprove) => void;
};

const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;
const { momentTime } = DATE_TIME_FORMAT;

const AccountantApproveChiFilter: React.FC<Props> = ({
  filters,
  setFilter,
}) => {
  const [filterData, setFilterData] = useState<FilterAccountantApprove>({});

  const globalState = useSelector((state: RootState) => state.globalSlice);

  const staffsSWR = useStaffs();

  const handleChangeDateComplete: DatePickerProps["onChange"] = (date) => {
    setFilterData({
      ...filterData,
      completeDate: date ? date.format(momentTime).toString() : undefined,
    });
  };

  const handleChangeDateDocument: DatePickerProps["onChange"] = (date) => {
    setFilterData({
      ...filterData,
      documentDate: date ? date.format(momentTime).toString() : undefined,
    });
  };

  useEffect(() => {
    if (filters) {
      setFilterData(filters);
    }
  }, [filters]);

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.keyword,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value }),
      allowClear: true,
    },
    {
      key: 2,
      label: "Đơn vị",
      css: css,
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.companyBranchId,
      options: globalState.branchOptions,
      onChange: (value: number) =>
        setFilterData({ ...filterData, companyBranchId: value }),
      allowClear: true,
    },
    {
      key: 3,
      label: "Loại CT",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.typeOfDocument,
      onChange: (value: string) =>
        setFilterData({ ...filterData, typeOfDocument: value }),
      allowClear: true,
    },
    {
      key: 4,
      label: "Người lập",
      css: css,
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.staffId,
      options:
        staffsSWR?.data?.map((item: StaffType) => {
          return {
            label: item.staffName,
            value: item.staffId,
          };
        }) || [],
      onChange: (value: number) =>
        setFilterData({ ...filterData, staffId: value }),
      allowClear: true,
    },
    {
      key: 5,
      label: "Ngày HT",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      allowClear: true,
      placeholder: "Chọn",
      value: filterData.completeDate
        ? dayjs(filterData.completeDate, "DD/MM/YYYY")
        : undefined,
      onChange: handleChangeDateComplete,
    },
    {
      key: 6,
      label: "Ngày CT",
      type: DATE_PICKER,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      allowClear: true,
      placeholder: "Chọn",
      value: filterData.documentDate
        ? dayjs(filterData.documentDate, "DD/MM/YYYY")
        : undefined,
      onChange: handleChangeDateDocument,
    },
    {
      key: 7,
      label: "Trạng thái",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      options: [
        {
          label: "Bình thường",
          value: 1,
        },
        {
          label: "Không bình thường",
          value: 0,
        },
      ],
      value: filterData.status,
      onChange: (value: number) =>
        setFilterData({ ...filterData, status: value }),
      allowClear: true,
    },
    {
      key: 8,
      label: "",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
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
                <InputFields data={inputSearch} />
                <Col
                  xs={css.xs}
                  sm={css.sm}
                  md={css.md}
                  lg={css.lg}
                  xl={css.xl}
                  style={{ justifyContent: "end", display: "flex" }}
                >
                  <Space>
                    <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        setFilter({});
                        setFilterData({});
                      }}
                    />
                    <ButtonCustom
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => setFilter({ ...filterData })}
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

export default AccountantApproveChiFilter;
