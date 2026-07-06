import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import { EditSVG } from "assets/images";
import InputFields from "components/InputFields";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constants/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "./style.scss";
import { FC, Fragment, memo } from "react";
import dayjs from "dayjs";
import ButtonCustom from "components/ButtonCustom";

const { INPUT, SELECT, DATE_PICKER } = TYPE_FIELD;
const AccountInformation: FC<any> = ({ accountDetail }) => {
  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  // const inputFields: InputFiledParams[] = [
  //     {
  //         key: 1,
  //         label: "Tên đăng nhập",
  //         type: INPUT,
  //         css: css,
  //         labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
  //         wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
  //         value: "Hệ thông tự nhập",
  //         require: true,
  //         disable: true,
  //     },
  //     {
  //         key: 2,
  //         css: css,
  //     },
  //     {
  //         key: 3,
  //         label: "Mật khẩu",
  //         css: css,
  //         labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
  //         wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
  //         type: SELECT,
  //         options: [],
  //         value: "*****",
  //         disable: true,
  //     },
  //     {
  //         key: 4,
  //         label: "Ngày sinh",
  //         css: css,
  //         type: DATE_PICKER,
  //         formatDatetime: DATE_TIME_FORMAT.day,
  //         labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
  //         wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
  //         value: dayjs("1990-10-22T17:00:00.000+00:00"),
  //         // onChange: (value: DatePickerProps["value"]) =>
  //         //     setFilterData({ ...filterData, startDate: dayjs(value).valueOf() }),
  //         onChange: () => { },
  //         disable: true
  //     },
  //     {
  //         key: 5,
  //         label: "Email",
  //         css: css,
  //         labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
  //         wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
  //         type: INPUT,
  //         value: "Hệ thống tự nhập",
  //         disable: true,
  //     },
  //     {
  //         key: 6,
  //         label: "Số điện thoại",
  //         css: css,
  //         labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
  //         wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
  //         type: INPUT,
  //         value: "Hệ thống tự nhập",
  //         disable: true,
  //     },
  // ];

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="accountInformation-wrapper"
    >
      <Form labelAlign="left" labelWrap size="small">
        <Row gutter={[24, 4]}>
          {/* <InputFields data={inputFields} /> */}
          <Col span={12}>
            <Form.Item
              className="form-item-custom"
              labelCol={{ span: 8 }}
              colon={false}
              label={
                <Tooltip placement="bottom" title={"Tên đăng nhập"}>
                  <>Tên đăng nhập</>
                </Tooltip>
              }
            >
              <Input
                value={accountDetail?.username}
                placeholder={"Nhập"}
                className="form-input-custom"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item
              className="form-item-custom"
              labelCol={{ span: 8 }}
              colon={false}
              label={
                <Tooltip placement="bottom" title={"Mật khẩu"}>
                  <>Mật khẩu</>
                </Tooltip>
              }
            >
              <Input.Password
                value={"Hệ thống tự nhập"}
                placeholder={"Nhập"}
                className="form-input-custom"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          {/* <Col span={12}>
            <Form.Item
              className="form-item-custom"
              labelCol={{ span: 8 }}
              colon={false}
              label={
                <Tooltip placement="bottom" title={"Ngày tạo"}>
                  <>Ngày tạo</>
                </Tooltip>
              }
            >
              <DatePicker
                value={dayjs("1990-10-22T17:00:00.000+00:00")}
                placeholder={"Nhập"}
                className="form-input-custom"
                disabled
              />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item className="form-item-custom" colon={false}>
              <Switch
                defaultChecked
                checked={true}
                onChange={() => {}}
                size="small"
                style={{ marginRight: "8px" }}
              />
              <>Mở khóa tài khoản</>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row justify={"end"}>
        {/* <ButtonCustom
          onClick={() => {}}
          label="Đổi mật khẩu"
          icon={<EditSVG />}
          size="small"
        /> */}
      </Row>
    </Space>
  );
};

export default memo(AccountInformation);
