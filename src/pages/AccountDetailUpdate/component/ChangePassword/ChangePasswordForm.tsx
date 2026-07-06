import { Button, Divider, Form, Input, Row, Space, Typography, message } from 'antd'
import React from 'react'
import './style.scss'
import { accountApi } from 'apis/account'
import { AccountDataProps } from 'pages/AccountDetail/subcomponents/Profile'
import { useForm } from 'antd/es/form/Form';

const ChangePasswordForm: React.FC<AccountDataProps> = ({ account }) => {
  const [form] = useForm();
  const handleChangePassword = async (values: any) => {
    try {
      const response = await accountApi.changePassword(values);
      if (response.data.code === 200) {
        message.success(response?.data?.message);
        form.setFieldValue("oldPassword", "");
        form.setFieldValue("newPassword", "");
      } else {
        message.error(response?.data?.message)
      }
    } catch (error: any) {
      throw new Error(error)
    }

  }
  return (
    <Space className='acc-changePassword-wrapper' style={{ padding: "8px", width: "100%" }} direction="vertical">
      <Row justify='center'>
        <div style={{ width: "500px" }}>
          <Form
            form={form}
            onFinish={handleChangePassword}
            className="main-changePassword-form"
            layout='horizontal'
            size="small"
            style={{ width: "100%" }}
          >
            <Form.Item
              label="Mật khẩu cũ"
              className='form-changePassword_item'
              name="oldPassword"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input.Password
                placeholder="Nhập mật khẩu cũ" value={form.getFieldValue("oldPassword")}
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              className='form-changePassword_item'
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới" value={form.getFieldValue("newPassword")}
              />
            </Form.Item>
            <Form.Item
              label="Nhập lại mật khẩu mới"
              className='form-changePassword_item'
              name="oldPassword"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu mới" value={form.getFieldValue("oldPassword")}
              />
            </Form.Item>
            <Form.Item>
              <Row justify={"end"}>
                <Button style={{ marginRight: "6px" }}>Hủy</Button>
                <Button
                  type="primary"
                  htmlType="submit">Xác nhận</Button>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Row>
    </Space>
  )
}

export default ChangePasswordForm