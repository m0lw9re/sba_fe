import { Button, Divider, Form, Input, Row, Space, Typography, message } from 'antd'
import React from 'react'
import 'pages/AccountDetail/subcomponents/ChangePassword/style.scss'
import { accountApi } from 'apis/account'
import { AccountDataProps } from 'pages/AccountDetail/subcomponents/Profile'
import { useForm } from 'antd/es/form/Form';

const ChangePassword: React.FC<AccountDataProps> = ({ account }) => {
  const [form] = useForm();
  const handleChangePassword = async (values: any) => {
    try {
      const response = await accountApi.changePassword(values);
      if(response.data.code === 200){
         message.success(response?.data?.message);
         form.setFieldValue("oldPassword", "");
         form.setFieldValue("newPassword", "");
      }else{
          message.error(response?.data?.message)
      }
    } catch (error:any) {
        throw new Error(error)
    }
      
  }
  return (
    <Space className='acc-changePassword-wrapper' style={{padding: "8px", width: "100%"}} direction="vertical">
      <Row align={"middle"} className="acc-detail-header" justify='space-between'>
        <Space direction="horizontal" wrap align='center'>
          <Typography style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}>Đổi mật khẩu</Typography>
        </Space>
      </Row>
      <Divider/>
      <Row justify='center'>
        <div style={{width: "360px"}}>
          <Form
            form={form}
            onFinish={handleChangePassword}
            className="main-changePassword-form"
            layout='vertical'
            size="small"
          >
            <Form.Item
              label="Mật khẩu cũ"
              className='form-changePassword_item'
              name="oldPassword"
            >
              <Input.Password
                placeholder="Nhập mật khẩu cũ" value={form.getFieldValue("oldPassword")}
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              className='form-changePassword_item'
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới" value={form.getFieldValue("newPassword")}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="changePassword_btn"
              >Lưu</Button>
            </Form.Item>
          </Form>
        </div>
      </Row>
    </Space>
  )
}

export default ChangePassword