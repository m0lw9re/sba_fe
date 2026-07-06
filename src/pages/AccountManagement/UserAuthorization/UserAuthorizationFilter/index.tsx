import { Form, Row, Space, Typography } from "antd";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { DepartmentType, FilterStaffByRoleType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import React, { useEffect, useState } from "react";
import "pages/AccountManagement/UserAuthorization/UserAuthorizationFilter/style.scss";
import { useDepartment } from "utils/request";
import { useRoles } from "utils/request/useRoles";
import { RoleGroupType } from "constant/types";
import { CollapseCustom } from "components/CollapseCustom";
import { DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";

type Props = {
  filters: FilterStaffByRoleType;
  setFilter: (filters: FilterStaffByRoleType) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;

const UserAuthorizationFilter: React.FC<Props> = ({ filters, setFilter }) => {
  const [filterData, setFilterData] = useState<FilterStaffByRoleType>({
    roleCode: "",
  });

  const globalState = useSelector((state: RootState) => state.globalSlice);

  const departmentSWR = useDepartment();

  const rolesSWR = useRoles();

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

  const css = { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };
  const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
  const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      label: "Đơn vị",
      css: css,
      type: SELECT,
      options: globalState.branchOptions,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: filterData.companyBranchId,
      onChange: (value: number) =>
        setFilterData({ ...filterData, companyBranchId: value }),
    },
    {
      key: 2,
      label: "Bộ phận/ Phòng ban",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      options:
        departmentSWR?.data?.data?.map((item: DepartmentType) => {
          return {
            label: item.departmentName,
            value: item.departmentId,
          };
        }) || [],
      value: filterData.departmentId,
      onChange: (value: number) =>
        setFilterData({
          ...filterData,
          departmentId: value,
          isFiltering: true,
        }),
    },
    {
      key: 3,
      label: "Nhóm tài khoản",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      options:
        rolesSWR?.data?.data?.map((item: RoleGroupType) => {
          return {
            label: item.roleName,
            value: item.roleCode,
          };
        }) || [],
      value: filterData.roleCode,
      onChange: (value: string) =>
        setFilterData({ ...filterData, roleCode: value, isFiltering: true }),
    },
    {
      key: 4,
      label: "Tìm kiếm",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: filterData.keyword,
      onChange: (e: any) =>
        setFilterData({
          ...filterData,
          keyword: e.target.value,
          isFiltering: true,
        }),
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
              </Row>
              <Row justify={"end"} style={{ marginTop: "4px" }}>
                <Space>
                  <ButtonCustom
                    label="Xóa"
                    onClick={() => {
                      setFilter({ roleCode: "" });
                      setFilterData({ roleCode: "" });
                    }}
                  />
                  <ButtonCustom
                    label="Tìm kiếm"
                    bgColor="#2862AF"
                    type="primary"
                    onClick={() => setFilter({ ...filterData })}
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

export default UserAuthorizationFilter;
