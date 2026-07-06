import { Col, DatePickerProps, Form, Row, Space, Typography } from "antd";
import "./style.scss";
import React from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  DATE_TIME_FORMAT,
  LOCAL_STORAGE_KEY,
  PAGE_SIZE_OPTIONS,
  TYPE_FIELD,
} from "constant/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import dayjs from "dayjs";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { AccDataDto } from "../../../../constant/types/appraisalFilesDetail";
import { useDispatch, useSelector } from "react-redux";
import { reloadTable } from "../../../App/store/appSlice";
import { RootState } from "configs/configureStore";

const { SELECT, DATE_PICKER, INPUT } = TYPE_FIELD;

type Props = {
  filters: AccDataDto;
  setFilters: (filters: AccDataDto) => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

const Filter: React.FC<Props> = ({ filters, setFilters }) => {
  const dispatch = useDispatch();

  const globalState = useSelector((state: RootState) => state.globalSlice);

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Từ ngày",
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: filters.fromDate ? dayjs(filters.fromDate) : null,
      allowClear: true,
      onChange: (value: DatePickerProps["value"]) =>
        setFilters({
          ...filters,
          page: 1,
          fromDate: value ? dayjs(value).format("YYYY-MM-DD") : null,
        }),
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
      value: filters.toDate ? dayjs(filters.toDate) : null,
      allowClear: true,
      onChange: (value: DatePickerProps["value"]) =>
        setFilters({
          ...filters,
          page: 1,
          toDate: value ? dayjs(value).format("YYYY-MM-DD") : null,
        }),
    },
    {
      key: 4,
      label: "Nội dung thanh toán",
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      type: INPUT,
      placeholder: "Nội dung thanh toán",
      value: filters.phaseDescription,
      onChange: (e: any) =>
        setFilters({
          ...filters,
          page: 1,
          phaseDescription: e.target.value,
        }),
    },
    {
      key: 3,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      label: "Trạng thái",
      type: SELECT,
      options: [
        {
          label: "Hồ sơ chưa xác định",
          value: 0,
        },
        {
          label: "Hồ sơ đã đối chiếu và chưa gửi EMS",
          value: 1,
        },
        {
          label: "Hồ sơ đã đối chiếu và gửi EMS",
          value: 2,
        },
        {
          label: "Hoàn tiền",
          value: 5,
        },
        {
          label: "Đối chiếu hồ sơ thủ công",
          value: 6,
        },
      ],
      value: filters.statusEms,
      allowClear: true,
      onChange: (value: number) =>
        setFilters({ ...filters, page: 1, statusEms: value }),
    },
    {
      key: 5,
      label: "Số tờ trình",
      type: INPUT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: filters.reportCode || null,
      onChange: (e: any) =>
        setFilters({ ...filters, page: 1, reportCode: e.target.value }),
    },
    {
      key: 6,
      label: "Tên khách hàng",
      type: INPUT,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      value: filters.customerName || null,
      onChange: (e: any) =>
        setFilters({ ...filters, page: 1, customerName: e.target.value }),
    },
    {
      key: 7,
      css: css,
      wrapperCol: wrapperCol,
      labelCol: labelCol,
      label: "Đơn vị đề nghị",
      type: SELECT,
      options: globalState.sacombankUnitOptions,
      value: filters.proposalUnit,
      allowClear: true,
      onChange: (value: string) =>
        setFilters({ ...filters, page: 1, proposalUnit: value }),
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
            <Form
              labelAlign="left"
              labelWrap
              size="small"
              className="form-control"
            >
              <Row gutter={[16, 4]} className="row-btn-group">
                <InputFields data={inputSearchBasic} />
                <Col
                  className="col-btn-group"
                  style={{
                    justifyContent: "end",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <Space>
                    <ButtonCustom
                      className="btn-del"
                      label="Xóa"
                      onClick={() => {
                        setFilters({
                          limit: localStorage.getItem(
                            LOCAL_STORAGE_KEY.PAGE_SIZE
                          )
                            ? Number(
                                localStorage.getItem(
                                  LOCAL_STORAGE_KEY.PAGE_SIZE
                                )
                              )
                            : PAGE_SIZE_OPTIONS.OPTION_10,
                          page: 1,
                          statusEms: 0,
                        });
                      }}
                    />
                    <ButtonCustom
                      className="btn-search"
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => {
                        setFilters({ ...filters, page: 1 });
                        dispatch(reloadTable());
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

export default Filter;
