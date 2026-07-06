import {
  Card,
  Row,
  Typography,
  Space,
  Button,
  Col,
  Form,
  DatePickerProps,
} from "antd";
import { useState } from "react";
import Icons from "assets/icons";
import "./style.scss";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import InputFields from "components/InputFields";
import ButtonCustom from "components/ButtonCustom";
import { EditSVG } from "assets/images";
import { FilterRoleFileType } from "constant/types/role";

const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;

const UserInfoCard = () => {
  const [collapse, setCollapse] = useState<number>(1);

  const [filterData, setFilterData] = useState<FilterRoleFileType>({});

  const handleCollapse = (value: number) => {
    setCollapse(value);
  };

  const [isDisable, setIsDisable] = useState<boolean>(true);

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };

  const csss = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tên quyền",
      type: INPUT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: filterData.roleName,
      placeholder: "Nhập",
      onChange: (e: any) =>
        setFilterData({ ...filterData, roleName: e.target.value }),
      disable: isDisable,
    },
    {
      key: 2,
      label: "ID quyền",
      type: INPUT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: filterData.roleId || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, roleId: e.target.value }),
      placeholder: "Nhập",
      disable: isDisable,
    },
    {
      key: 3,
      label: "Người tạo",
      type: SELECT,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: filterData.whoCreate || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, whoCreate: e.target.value }),
      placeholder: "Chọn",
      disable: isDisable,
    },
    {
      key: 4,
      label: "Ngày tạo",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: DATE_PICKER,
      value: filterData.dateCreate ? dayjs(filterData.dateCreate) : null,
      onChange: (value: DatePickerProps["value"]) =>
        setFilterData({ ...filterData, dateCreate: dayjs(value).valueOf() }),
      disable: isDisable,
      placeholder: "Chọn",
    },
    {
      key: 5,
      label: "Sửa lần cuối",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: DATE_PICKER,
      value: filterData.dateModify ? dayjs(filterData.dateCreate) : null,
      onChange: (value: DatePickerProps["value"]) =>
        setFilterData({ ...filterData, dateModify: dayjs(value).valueOf() }),
      disable: isDisable,
      placeholder: "Chọn",
    },
    {
      key: 6,
      label: "Trạng thái",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: INPUT,
      placeholder: "Nhập",
      value: filterData.status || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, status: e.target.value }),
      disable: isDisable,
    },
    {
      key: 7,
      label: "Ghi chú",
      type: INPUT,
      css: csss,
      span: 24,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 24, xl: 24 },
      placeholder: "Nhập",
      value: filterData.note || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, note: e.target.value }),
      disable: isDisable,
    },
  ];

  const hideShow = () => {
    switch (collapse) {
      case 0:
        return (
          <Button type="text" size="small" onClick={() => handleCollapse(1)}>
            <Space>
              <Typography className="blue-text">Hiện</Typography>
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
              <Typography className="blue-text">Ẩn</Typography>
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
    // <div style={{ width: "100%" }}>
    //   <div className="page-container">
    //     <Row justify={"space-between"} style={{ paddingBottom: "8px" }}>
    //       <CardTitleCustomUpdate title="Thông tin tài khoản" />
    //       <ButtonCustom label="Lưu" type="primary" size="small" />
    //     </Row>
    //   </div>
    // </div>

    <Card size="small" className="card-container">
      <Row justify={"space-between"} style={{ marginBottom: "4px" }}>
        <CardTitleCustomUpdate title="Thông tin chung" />
        <div style={{ height: "22px", display: "flex", alignItems: "center" }}>
          {hideShow()}
        </div>
      </Row>
      {collapse ? (
        <>
          <Form labelAlign="left" labelWrap size="large">
            <Row gutter={[16, 4]}>
              <InputFields data={inputSearchBasic} />
              <Col
                xs={css.xs}
                sm={css.sm}
                md={css.md}
                lg={css.lg}
                xl={css.xl}
                style={{ justifyContent: "end", display: "flex" }}
              ></Col>
            </Row>
          </Form>
          <Row justify={"end"}>
            <ButtonCustom
              onClick={() => {
                setIsDisable(!isDisable);
              }}
              label="Chỉnh sửa"
              icon={<EditSVG />}
              size="small"
            />
          </Row>
        </>
      ) : null}
    </Card>
  );
};

export default UserInfoCard;
