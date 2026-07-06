import { Button, Form, Input, Row, Space, Typography, message } from 'antd'
import React from 'react'
import 'pages/AccountDetail/subcomponents/ChangePassword/style.scss'
import { accountApi } from 'apis/account'
import { AccountDataProps } from 'pages/AccountDetail/subcomponents/Profile'
import { useForm } from 'antd/es/form/Form';

const ChangePassword: React.FC<AccountDataProps> = ({ account }) => {
  const [messageChangePassword, changePasswordMessageContent] = message.useMessage();
  const [form] = useForm();
  const handleChangePassword = async (values: any) => {
    try {
      const response = await accountApi.changePassword(values);
      if(response.data.code === 200){
         messageChangePassword.success(response.data.message);
         form.setFieldValue("oldPassword", "");
         form.setFieldValue("newPassword", "");
      }else{
          messageChangePassword.error(response.data.message)
      }
    } catch (error:any) {
        throw new Error(error)
    }
      
  }
  return (
    <div className='acc-changePassword-wrapper'>
      {changePasswordMessageContent}
      <Row align={"middle"} className="acc-detail-header" style={{ padding: '0 0 24px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.07)' }} justify='space-between'>
        <Space direction="horizontal" wrap align='center'>
          <Typography.Title level={4} className="acc-detail-header_title" style={{ margin: '0' }}>Đổi mật khẩu</Typography.Title>
        </Space>
      </Row>
      <Row className="acc-changePassword-content" justify='center'>
        <div className="changePassword-form-wrapper">
          <Form
            size="small"
            form={form}
            onFinish={handleChangePassword}
            className="main-changePassword-form"
            layout='vertical'
          >
            <Form.Item
              label="Old password"
              className='form-changePassword_item'
              name="oldPassword"
            >
              <Input.Password
                placeholder="Input" value={form.getFieldValue("oldPassword")}
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New password"
              className='form-changePassword_item'
            >
              <Input.Password
                placeholder="Input" value={form.getFieldValue("newPassword")}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="changePassword_btn"
              >Save</Button>
            </Form.Item>
          </Form>

        </div>
      </Row>
    </div>
  )
}

export default ChangePassword