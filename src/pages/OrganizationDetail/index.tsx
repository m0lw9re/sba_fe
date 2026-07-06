import {
    Row,
    Space,
    Typography,
    Button,
    Avatar,
    Menu,
    Modal,
    Col,
} from "antd";
import { ReactComponent as UserCircle } from "assets/images/svg/UserCircle.svg";
import { ReactComponent as Banned } from "assets/images/svg/Banned.svg";
import { ReactComponent as Restore } from "assets/images/svg/Restore.svg";
import { ReactComponent as LockOutLine } from "assets/images/svg/LockOutLine.svg";
import React, { ReactNode, useEffect, useState } from "react";
import "./style.scss";
import { useParams } from "react-router-dom";
import { Staff } from "constants/types/common.type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "configs/configureStore";
import { CloseOutlined } from "@ant-design/icons";
import { fetchAsyncAccDetail, getAccountDetail, removeSelectedAccount } from "./store/OrganizationDetailSlice";
import Profile from "pages/AccountDetail/subcomponents/Profile";
import ChangePassword from "pages/AccountDetail/subcomponents/ChangePassword";

type MenuItem = {
    title: string;
    key: string;
    icon?: ReactNode;
};

const menudata: Array<MenuItem> = [
    {
        title: "Tài khoản",
        key: "account",
        icon: <UserCircle />,
    },
    {
        title: "Đổi mật khẩu",
        key: "changepass",
        icon: <LockOutLine />,
    },
];
const AccountDetail: React.FC = () => {
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [action, setAction] = useState("ban");
    const [tab, setTab] = useState("account");
    const { username } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const accDetail: Staff = useSelector(getAccountDetail)
    useEffect(() => {
        dispatch(fetchAsyncAccDetail(String(username)));
        return () => {
            dispatch(removeSelectedAccount());
        }
    }, [dispatch, username])

    const confirmBan = () => {
        setIsOpenModalConfirm(true);
        setAction("ban")
    }
    const confirmActive = () => {
        setIsOpenModalConfirm(true);
        setAction("active")
    }
    // const changeStatusAccount = async () => {
    //     try {
    //         const response = await accountApi.changeStatus({
    //             username: accDetail.username,
    //             status: accDetail.status === 1 ? 0 : 1
    //         })
    //         if (action === 'ban' && response.data.code === 200) {
    //             messageChangeStatus.open({
    //                 type: 'success',
    //                 content: "Cấm tài khoản thành công"
    //             })
    //         }
    //         else if (action === 'active' && response.data.code === 200) {
    //             messageChangeStatus.open({
    //                 type: 'success',
    //                 content: "Active tài khoản thành công"
    //             })
    //         }
    //         else {
    //             messageChangeStatus.open({
    //                 type: 'error',
    //                 content: response.data.message
    //             })
    //         }
    //     } catch (error: any) {
    //         console.log(error);
    //     }
    //     dispatch(fetchAsyncAccDetail(String(username)))
    //     setIsOpenModalConfirm(false)
    // }

    return (
        <div className="acc-detail-wrapper">
            <Modal
                className="failedCreateKey-modal"
                open={isOpenModalConfirm}
                closable={false}
                footer={null}
                onCancel={() => setIsOpenModalConfirm(false)}
            >
                <Space
                    direction="vertical"
                    align="center"
                    className="space-failedCreateKey"
                    size={"middle"}>
                    <Row justify={"end"}>
                        <Button
                            className="close-button-modal"
                            shape="circle"
                            icon={<CloseOutlined />}
                            onClick={() => setIsOpenModalConfirm(false)}
                        />
                    </Row>
                    {/* <Row justify={"center"}>
                        <FailedIcon />
                    </Row> */}
                    <Row justify={"center"}>
                        {action === 'ban' ? (
                            <Typography className="failed-title">
                                Bạn có chắc chắn muốn Ban tài khoản này?
                            </Typography>
                        ) : (
                            <Typography className="failed-title">
                                Bạn có chắc chắn muốn Unban tài khoản này?
                            </Typography>
                        )}
                    </Row>
                    <Row justify={"center"}>
                        <Col span={12}>
                            <Button
                                className="failed-createKey-button cancel"
                                onClick={() => setIsOpenModalConfirm(false)}
                            >
                                Hủy bỏ
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                className="failed-createKey-button delete"
                                // onClick={changeStatusAccount}
                            >
                                Xác nhận
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </Modal>
            <Row align={"middle"} className="acc-detail-header">
                <Space direction="horizontal">
                    <Typography.Title level={3} className="acc-detail-header_title" style={{ margin: '0' }}>Chi tiết tài khoản</Typography.Title>
                </Space>
            </Row>
            <Row className="acc-detail-content">
                <Space direction="vertical" size={20} className="acc-detail-menu" style={{ borderRadius: '12px', width: '30%', height: 'fit-content' }}>
                    <Space className="acc-detail-menu_title">
                        <Avatar shape="circle" src='https://xsgames.co/randomusers/avatar.php?g=pixel&key=1' size={80} />
                        <div>
                            <Typography.Title level={4} className="acc-detail-menu_title-name" style={{ margin: '0', padding: "2px 0"}}>{accDetail.staffName || "Unkown"}</Typography.Title>
                            <Typography.Paragraph className="acc-detail-menu_title-des" style={{fontSize: '16px', margin: '0', color: "rgba(0, 0, 0, 0.6)" }}>{accDetail.roleName || "Unkown"}</Typography.Paragraph>
                        </div>
                    </Space>
                    <Row className="w-100 menuTab">
                        <Menu mode="inline" inlineIndent={10}  defaultSelectedKeys={['account']}>
                            {menudata.map((menu) => (
                                <Menu.Item key={menu.key} icon={menu.icon} onClick={() => { setTab(menu.key) }}>
                                    {menu.title}
                                </Menu.Item>
                            ))}
                            {
                                accDetail.status ? <Button icon={<Banned />} className="acc-action acc-ban" onClick={confirmBan}>Tạm dừng</Button> : <Button icon={<Restore />} className="acc-action acc-unban" onClick={confirmActive}>Khôi phục</Button>
                            }

                        </Menu>
                    </Row>
                </Space>
                <div className="acc-detail-tab">
                    {tab === "account" ? <Profile account={accDetail}></Profile> : <ChangePassword account={accDetail}></ChangePassword>}
                </div>
            </Row>
        </div>

    );
};

export default AccountDetail;
