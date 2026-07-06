import React from "react";
import { Modal, Row, Button, Space, Typography, Col, Divider } from "antd";
import FailedIcon from "./subcomponents/FailedIcon";
import { roleApi } from "apis/role";
import "./style.scss";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  isOpenDeletePermissionModal: boolean;
  closeDeletePermissionModal: () => void;
};

const DeletePermissionModal: React.FC<Props> = ({
  isOpenDeletePermissionModal,
  closeDeletePermissionModal,
}) => {
  const navigate = useNavigate();

  const {id: roleId} = useParams();

  const deleteRole = async() =>{
    try{
      await roleApi.delete(roleId);
      message.success('Xóa vai trò thành công!');
      setTimeout(()=>{
        navigate('/roles')
      },2000)
    }
    catch(error){
      message.error('Xóa vai trò thất bại!');
    }
  }

  return (
    <div>
      <Modal
        className="failedCreatePermission-modal"
        open={isOpenDeletePermissionModal}
        closable={false}
        footer={null}
        onCancel={closeDeletePermissionModal}
      >
        <Space
          direction="vertical"
          align="center"
          className="space-failedCreatePermission"
          size={"middle"}
        >
          <Row justify={"center"}>
            <FailedIcon />
          </Row>
          <Row justify={"center"}>
            <Typography className="failed-title-main">
              Xóa quyền
            </Typography>
          </Row>
          <Row justify={"center"}>
            <Typography className="failed-title">
              Bạn có chắc chắn muốn xóa quyền
            </Typography>
          </Row>
          <Row justify={"center"}>
            <Typography className="failed-title">"{roleId}" không?</Typography>
          </Row>
          <Row justify={"center"}>
            <Col span={24}>
            <Divider />
            </Col>
            <Col span={11}>
              <Button
                className="failed-createPermission-button cancel"
                onClick={closeDeletePermissionModal}
              >
                Hủy bỏ
              </Button>
            </Col>
            <Col span={11}>
              <Button
                className="failed-createPermission-button delete"
                onClick={deleteRole}
              >
                Xóa
              </Button>
            </Col>
          </Row>
        </Space>
      </Modal>
    </div>
  );
};

export default DeletePermissionModal;
