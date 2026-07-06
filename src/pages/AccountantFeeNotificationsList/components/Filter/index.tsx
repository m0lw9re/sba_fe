import {
  Button,
  Card,
  Row,
  Space,
  Typography,
  Form,
  Col,
  DatePickerProps,
} from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import "./style.scss";
import Icons from "assets/icons";
import React, { useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { FilterAccountantFeeNotificationsUpdate } from "constant/types";
import { DATE_TIME_FORMAT } from "constant/enums";
import dayjs from "dayjs";
const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;

type Props = {
  filters: FilterAccountantFeeNotificationsUpdate;
  setFilters: (filters: FilterAccountantFeeNotificationsUpdate) => void;
};

const Filter: React.FC<Props> = ({ filters, setFilters }) => {
  const [collapse, setCollapse] = useState<number>(1);

  const [filterData, setFilterData] =
    useState<FilterAccountantFeeNotificationsUpdate>({startDate: null, endDate: null});

  const handleCollapse = (value: number) => {
    setCollapse(value);
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      type: INPUT,
      span: 8,
      value: filterData.keyword || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilters({ ...filterData });
        }
      },
    },
    {
      key: 2,
      label: "Đơn vị",
      span: 8,
      type: SELECT,
      options: [
        {
          label: "",
          value: "",
        },
      ],
      value: filterData.type,
      onChange: (value: string) =>
        setFilterData({ ...filterData, type: value }),
    },
    {
      key: 3,
      span: 8,
      label: "Người lập",
      type: SELECT,
      options: [
        {
          label: "",
          value: "",
        },
      ],
      value: filterData.type,
      onChange: (value: string) =>
        setFilterData({ ...filterData, type: value }),
    },
    {
      key: 4,
      label: "Ngày thông báo",
      span: 8,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      value: filterData.startDate ? dayjs(filterData.startDate) : null,
      onChange: (value: DatePickerProps["value"]) =>
      setFilterData((prevFilterData: any) => ({
        ...prevFilterData,
        startDate: dayjs(value).valueOf(),
        isFiltering: true,
      })),
    },
    {
      key: 5,
      span: 8,
      label: "Trạng thái",
      type: SELECT,
      options: [
        {
          label: "",
          value: "",
        },
      ],
      value: filterData.type,
      onChange: (value: string) =>
        setFilterData({ ...filterData, type: value }),
    },
  ];

  useEffect(() => {
    if (filters) {
      setFilterData(filters);
    }
  }, [filters]);

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
          <Button type="text" size="small" onClick={() => handleCollapse(0)}>
            <Space>
              <Typography className="blue-text">Ẩn tìm kiếm</Typography>
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
    <div className="accountant-fee-notification-files-filter-container">
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
              <Row gutter={[16, 4]} className="row-btn-group">
                <InputFields data={inputSearchBasic} />
                <Col
                  xs={css.xs}
                  sm={css.sm}
                  md={css.md}
                  lg={css.lg}
                  xl={css.xl}
                  style={{ justifyContent: "end", display: "flex" }}
                ></Col>
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
                      label="Xóa"
                      onClick={() => {
                        setFilters({startDate: null, endDate: null});
                        setFilterData({startDate: null, endDate: null});
                      }}
                      className="btn-del"
                    />
                    <ButtonCustom
                      className="btn-search"
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => setFilters({ ...filterData })}
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

export default Filter;
