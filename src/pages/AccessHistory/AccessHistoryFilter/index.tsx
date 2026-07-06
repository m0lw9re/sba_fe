import {
  Button,
  Card,
  Row,
  Space,
  Typography,
  Form,
  DatePickerProps,
} from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import "./style.scss";
import Icons from "assets/icons";
import React, { useEffect, useState } from "react";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constants/enums";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import dayjs from "dayjs";
import { FilterSystemLoginType } from "constant/types/system";
import { Staff } from "constants/types/common.type";
import { accountApi } from "apis/account";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";

type Props = {
  filters: FilterSystemLoginType;
  setFilters: (filters: FilterSystemLoginType) => void;
};

const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;

const AccessHistoryFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const [collapse, setCollapse] = useState<number>(1);
  const [filterData, setFilterData] = useState<FilterSystemLoginType>({});
  const [staffs, setStaffs] = useState<Staff[]>([]);

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

  const getStaffs = async () => {
    try {
      const res = await accountApi.search({
        page: 1,
        limit: 1000,
      });
      setStaffs(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStaffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCollapse = (value: number) => {
    setCollapse(value);
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      type: INPUT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      css: css,
      value: filterData.keyword || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value, isFiltering: true, }),
      allowClear: true,
    },
    {
      key: 2,
      label: "Tài khoản",
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: staffs
        ? staffs.map((item: Staff) => ({
            label: item.username,
            value: item.staffId,
          }))
        : [],
      css: css,
      showSearch: true,
      value: filterData.staffId || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, staffId: value, isFiltering: true, }),
      allowClear: true,
    },
    {
      key: 3,
      label: "Nhân viên",
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: staffs ? staffs.map((item: Staff) => ({
        label: item.staffName,
        value: item.staffId,
      })) : [],
      css: css,
      showSearch: true,
      allowClear: true,
      value: filterData.staffId || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, staffId: value, isFiltering: true, }),
    },
    {
      key: 4,
      label: "Ngày truy cập",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: DATE_PICKER,
      showTime: true,
      placeholder: DATE_TIME_FORMAT.dateTime,
      formatDatetime: DATE_TIME_FORMAT.dateTime,
      value: filterData.start ? dayjs(filterData.start) : null,
      onChange: (value: DatePickerProps["value"]) =>
        setFilterData({ ...filterData, start: dayjs(value).valueOf(), isFiltering: true, }),
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
          )
        }
      ]}
    />
  );
};

export default AccessHistoryFilter;
