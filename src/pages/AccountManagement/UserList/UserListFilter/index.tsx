import { Col, Form, Row, Space, Typography } from "antd";
import { TYPE_FIELD } from "constant/enums";
import {
  CompanyBranchType,
  DepartmentType,
  FilterStaffType,
} from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import React, { useEffect, useState } from "react";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import "pages/AccountManagement/UserList/UserListFilter/style.scss";
import { useDepartment } from "utils/request";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { Staff } from "constants/types/common.type";
import { accountApi } from "apis/account";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  filters: FilterStaffType;
  setFilter: (filters: FilterStaffType) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;

const UserListFilter: React.FC<Props> = ({ filters, setFilter }) => {
  const [filterData, setFilterData] = useState<FilterStaffType>({});

  const globalState = useSelector((state: RootState) => state.globalSlice);

  const departmentSWR = useDepartment();

  const [staffs, setStaffs] = useState<Staff[]>([]);

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

  useEffect(() => {
    const handleDebouncedChange = (value: any) => {
      setFilter({
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

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Đơn vị",
      css: css,
      type: SELECT,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.companyBranchId,
      options: globalState.branchOptions,
      onChange: (value: number) =>
        setFilterData({ ...filterData, companyBranchId: value }),
    },
    {
      key: 2,
      label: "Bộ phận",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      value: filterData.departmentId,
      options:
        departmentSWR?.data?.data?.map((item: DepartmentType) => {
          return {
            label: item.departmentName,
            value: item.departmentId,
          };
        }) || [],
      onChange: (value: number) =>
        setFilterData({ ...filterData, departmentId: value }),
    },
    {
      key: 3,
      label: "Trạng thái",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      options: [
        {
          label: "Đang hoạt động",
          value: 1,
        },
        {
          label: "Không hoạt động",
          value: 0,
        },
      ],
      value: filterData.status,
      onChange: (value: number) =>
        setFilterData({ ...filterData, status: value }),
    },
    {
      key: 4,
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
      key: 5,
      label: "Tìm kiếm",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.keyword,
      onChange: (e: any) =>
        setFilterData({ ...filterData, keyword: e.target.value }),
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilter({ ...filterData });
        }
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

export default UserListFilter;
