import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Row, Space, Typography, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import './style.scss'
import { accountApi } from "apis/account";

type Props = {
    isOpenModal: boolean;
    closeModal: () => void;
    action: any;
    account: any;
};

const ChangeStatusAccountModal: React.FC<Props> = ({ isOpenModal, closeModal, action, account }) => {
    
    const changeStatusAccount = async () => {
        try {
            const response = await accountApi.updateStatus({
                staffId: account.body.staffId,
                status: account.body.status === 1 ? 0 : 1
            })
            if (action === 'ban' && response.data.code === 200) {
                message.success("Tạm dừng tài khoản thành công")
            }
            else if (action === 'active' && response.data.code === 200) {
                message.success("Khôi phục tài khoản thành công")
            }
            else {
                message.error(response.data.code)
            }
        } catch (error: any) {
            message.error("Cập nhật trạng thái tài khoản lỗi")
        }
        closeModal();
    }

    return (
        <Modal
            open={isOpenModal}
            closable={false}
            footer={null}
            onCancel={closeModal}
            className="modal-change-status"
            style={{ display: "flex", justifyContent: "center" }}
        >
            <Space
                direction="vertical"
                align="center"
            >
                <Row justify={"end"} style={{ width: "100%" }}>
                    <Button
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={closeModal}
                    />
                </Row>
                <Row justify={"center"}>
                    {action === "ban" ? (
                        <Typography className="confirm-check-title">
                            Bạn có chắc chắn muốn tạm dừng tài khoản này?
                        </Typography>
                    ) : (
                        <Typography className="confirm-check-title">
                            Bạn có chắc chắn muốn khôi phục tài khoản này?
                        </Typography>
                    )}
                </Row>
                <Row justify={"end"}>
                    <Space style={{ width: "60%" }}>
                        <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
                        <ButtonCustom label="Xác nhận" type="primary" onClick={changeStatusAccount}/>
                    </Space>
                </Row>
            </Space>
        </Modal>
    )
}
export default ChangeStatusAccountModal;
