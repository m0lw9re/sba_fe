import { Button, Modal, Row, Space } from "antd";
import { RepairHistoryType } from "constant/types";
import Icons from "assets/icons";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ModalForm from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/RepairWarrantyInfo/MediaTypeModal/ModalForm";
import "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/RepairWarrantyInfo/MediaTypeModal/style.scss";

type Props = {
  isOpen: boolean;
  assetId: string;
  modalType: "add" | "edit";
  onClose: () => void;
  onChange: (record: RepairHistoryType, type: "add" | "edit") => void;
  record?: RepairHistoryType;
  mutate?: any;
};

const MediaTypeModal: React.FC<Props> = ({
  isOpen,
  record,
  assetId,
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
              title={`${
                modalType === "add" ? "Thêm" : "Sửa"
              } thông tin sửa chữa và bảo hành`}
            />
            <Button
              shape="circle"
              icon={<Icons.close />}
              onClick={onClose}
              size="small"
            />
          </Row>
          <ModalForm
            assetId={assetId}
            record={record}
            onClose={onClose}
            modalType={modalType}
            onChange={onChange}
          />
        </Space>
      }
    />
  );
};

export default MediaTypeModal;
