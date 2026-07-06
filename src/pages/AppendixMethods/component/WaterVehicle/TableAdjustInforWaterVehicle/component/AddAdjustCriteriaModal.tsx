import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Row, Space } from "antd";
import "./style.scss";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ButtonCustom from "components/ButtonCustom";
import { useAdjustCriteria } from "utils/request";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useEffect, useState } from "react";
import InputFields from "components/InputFields";
import { useLocation } from "react-router-dom";

const { MULTI_SELECT_SEARCH } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  onSave: (data: any) => void;
  selectedCriteriaIds: Array<any>;
};

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

const AddAdjustCriteriaModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  onSave,
  selectedCriteriaIds,
}) => {
  const location = useLocation();

  const { data, error } = useAdjustCriteria(location.state.assetLevelTwoId);

  const [selectedAdjustCriteria, setSelectedCriteria] = useState<Array<any>>(
    []
  );

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Phương thức điều chỉnh",
      type: MULTI_SELECT_SEARCH,
      css: css,
      options: data
        ? data
            .map((el: any) => ({
              value: el.adjustCriteriaId,
              label: el.adjustCriteriaName,
            }))
        : [],

      value: selectedAdjustCriteria,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      onChange: (value: any) => {
        setSelectedCriteria([...value]);
      },
    },
  ];
  useEffect(() => {
    setSelectedCriteria(selectedCriteriaIds);
  }, [JSON.stringify(selectedCriteriaIds)]);

  if (error) return null;

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalAdditionRequired"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" align="center" size={"small"}>
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalAdditionRequired-header"
        >
          <CardTitleCustomUpdate title="Thêm phương thức điều chỉnh" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>

        <div
          style={{
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Form labelWrap size="small">
            <InputFields data={inputSearchBasic} />
          </Form>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "right",
            gap: "8px",
            padding: "8px",
          }}
        >
          <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
          <ButtonCustom
            label="Thêm"
            type="primary"
            htmlType="submit"
            bgColor="rgba(40, 98, 175, 1)"
            onClick={() => onSave(selectedAdjustCriteria)}
          />
        </div>
      </Space>
    </Modal>
  );
};
export default AddAdjustCriteriaModal;
