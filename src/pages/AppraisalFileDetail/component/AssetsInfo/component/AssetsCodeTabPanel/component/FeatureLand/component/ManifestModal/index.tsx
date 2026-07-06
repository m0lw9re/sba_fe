import { Button, Modal, Row, Space } from "antd";
import { RepairHistoryType } from "constant/types";
import Icons from "assets/icons";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ModalForm from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/ManifestModal/ManifestModalForm";
import "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureLand/component/ManifestModal/style.scss";

type Props = {
  isOpen: boolean;
  modalType: "add" | "edit";
  onClose: () => void;
  onChange: (record: RepairHistoryType, type: "add" | "edit") => void;
  record?: any;
  mutate?: any;
};

const ManifestModal: React.FC<Props> = ({
  isOpen,
  record,
  modalType,
  onClose,
  onChange,
}) => {
  return (
    <Modal
      open={isOpen}
      closable={false}
      footer={null}
      onCancel={onClose}
      className="media-type-modal-container"
      title={
        <Space direction="vertical" align="center" size={"small"}>
          <Row
            justify={"space-between"}
            align={"middle"}
            className="modal-media-type-header"
          >
            <CardTitleCustomUpdate
              title={`${modalType === "add" ? "Thêm" : "Sửa"} file xem bảng kê`}
            />
            <Button
              shape="circle"
              icon={<Icons.close />}
              onClick={onClose}
              size="small"
            />
          </Row>
          <ModalForm record={record} onClose={onClose} modalType={modalType} />
        </Space>
      }
    />
  );
};

export default ManifestModal;
