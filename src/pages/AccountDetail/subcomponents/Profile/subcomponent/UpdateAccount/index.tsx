import Icon from "@ant-design/icons/lib/components/Icon";
import { Avatar, Button, Form, Row, Space, message } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import { ReactComponent as Upload } from "assets/images/svg/Upload.svg";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import { useFormik } from "formik";
import { accountApi } from "apis/account";

const { INPUT } = TYPE_FIELD;

type Props = {
    account: any
}
export type PropsUpdateAccountRef = {
    hanldeUpdateAccount: () => void;
}
type UpdateAccountData = {
    staffId?: string;
    username?: string;
    email?: string;
    phone?: string;
}

const UpdateAccount = forwardRef<PropsUpdateAccountRef, Props>(({ account }, ref) => {
    const functionC = () => {
        formUpdateAccount.submitForm();
    }
    const initialFormData: UpdateAccountData = {
        username: account.username,
        staffId: account.staffId,
        email: account.email,
        phone: account.phone
    }
    const formUpdateAccount = useFormik({
        initialValues: initialFormData,
        // validationSchema: createValuationProfileSchema,
        onSubmit: async (data: UpdateAccountData) => {
            try {
                const response = await accountApi.update(data);
                if (response.data.code === 200) {
                    message.success(response?.data?.message);
                }
                else {
                    message.error(response?.data?.message);
                }
            } catch (error) {
                message.error("Cập nhật tài khoản không thành công");
            }
        }
    })
    useImperativeHandle(ref, () => ({
        hanldeUpdateAccount: functionC
    }));
    const handleChangeUpdateAccount = (
        basicData: UpdateAccountData
    ) => {
        formUpdateAccount.setValues((state) => ({
            ...state,
            ...basicData,
        }));
    };
    const inputFields: InputFiledParams[] = [
        {
            key: 1,
            label: "Email",
            span: 12,
            type: INPUT,
            value: formUpdateAccount.values.email,
            onChange: (e: any) => { handleChangeUpdateAccount({ email: e.target.value }) },
        },
        {
            key: 2,
            label: "Tên tài khoản",
            span: 12,
            type: INPUT,
            value: formUpdateAccount.values.username,
            onChange: (e: any) => { handleChangeUpdateAccount({ username: e.target.value }) },
        },
        {
            key: 3,
            label: "Số điện thoại",
            span: 12,
            type: INPUT,
            value: formUpdateAccount.values.phone,
            onChange: (e: any) => { handleChangeUpdateAccount({ phone: e.target.value }) },
        },
    ];

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Form layout="vertical">
                <Space
                    className="acc-detail-content_left"
                    style={{ width: "120px", display: "block", position: "relative" }}
                >
                    <Avatar shape="circle" src="" size={120} />
                    <Button className="acc-uploadAva_btn">
                        <Icon
                            component={Upload}
                            className="account-uploadAva_icon"
                            style={{ fontSize: "24px", color: "transparent" }}
                        />
                    </Button>
                </Space>

                <Row gutter={[16, 16]} style={{ paddingTop: "30px" }}>
                    <InputFields data={inputFields} />
                </Row>
            </Form>

        </Space>
    );
});

export default UpdateAccount;
