import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  message,
} from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { useAppraisalFileDetail, useRefuseToPrice } from "utils/request";
import "./style.scss";
// import { CommonGetAllParams } from "constants/types/common.type";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { AppraisalFileType, RefuseToPriceData } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import useAppraisalFileFunction from "hooks/useAppraisalFileFunction";
import { useState } from "react";
import * as Yup from "yup";
import RefuseToPriceTable from "./RefuseToPriceTable";
import { APPRAISAL_FILE_STATUS, REFUSED_RADIO_OPTIONS } from "constant/common";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  assetLevelTwoId: number | null;
  appraisalFileId: string;
  disableBtnSave?: boolean;
};

type RefuseToPriceBasicData = {
  contentRefused?: string;
  refusedStatus?: number;
};

const initialFormData: RefuseToPriceData = {
  contentRefused: "",
  refusedStatus: 0,
};

const formSchema = Yup.object().shape({
  contentRefused: Yup.string()
    .nullable()
    .required("Phải nhập nội dung lý do từ chối định giá"),
});

const { TEXT_AREA } = TYPE_FIELD;

const RefuseToPriceModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  assetLevelTwoId,
  appraisalFileId,
  disableBtnSave,
}) => {
  let { id }: { id?: string } = useParams();

  const handleChangeRefuseToPriceData = (basicData: RefuseToPriceBasicData) => {
    formRefuseToPriceData.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };

  const {
    data: appraisalFileDetail,
    mutate: mutateAppraisalFileDetail,
  }: {
    data: AppraisalFileType;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useAppraisalFileDetail(id || "");
  const { mutate } = useRefuseToPrice(appraisalFileId);
  const { isUserCanNotUpdate, isUserCanNotCompleteFileFromLos } =
    useAppraisalFileFunction({
      appraisalId: appraisalFileId,
    });
  const isCannotEdit =
    (isUserCanNotCompleteFileFromLos() && isUserCanNotUpdate()) ||
    appraisalFileDetail.fileStatus === APPRAISAL_FILE_STATUS.MINUS_ONE;
  const [loading, setLoading] = useState<boolean>(false);
  const formRefuseToPriceData = useFormik({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (data: RefuseToPriceData) => {
      setLoading(true);
      try {
        const response = await appraisalFilesApi.getRefuseToPrice(
          data,
          appraisalFileId!
        );
        if (response.data.code === 200) {
          message.success("Từ chối định giá thành công");
          formRefuseToPriceData.resetForm();
          mutate();
          mutateAppraisalFileDetail();
          closeModal();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Từ chối định giá không thành công");
      } finally {
        setLoading(false);
      }
    },
  });

  const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Lý do từ chối yêu cầu định giá",
      placeholder: "Nhập",
      type: TEXT_AREA,
      value: formRefuseToPriceData.values.contentRefused,
      error: formRefuseToPriceData.errors.contentRefused,
      touched: formRefuseToPriceData.touched.contentRefused,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      css: css,
      require: true,
      onChange: (e: any) =>
        handleChangeRefuseToPriceData({ contentRefused: e.target.value }),
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalRefuseToPrice"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalRefuseToPrice-header"
        >
          <CardTitleCustomUpdate title="Từ chối định giá" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => {
              formRefuseToPriceData.resetForm();
              closeModal();
            }}
            size="small"
          />
        </Row>
        {!isCannotEdit && (
          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[24, 4]}>
              <InputFields data={inputFields} />
            </Row>
            <Row
              justify={"space-between"}
              style={{ padding: "8px 0" }}
              className="button-row"
            >
              <Radio.Group
                onChange={(e: RadioChangeEvent) =>
                  handleChangeRefuseToPriceData({
                    refusedStatus: e.target.value,
                  })
                }
                value={formRefuseToPriceData.values.refusedStatus || 0}
                options={REFUSED_RADIO_OPTIONS}
                style={{ display: "flex", flexDirection: "column" }}
              />
              <Space>
                <ButtonCustom
                  label="Hủy bỏ"
                  onClick={() => {
                    formRefuseToPriceData.resetForm();
                    closeModal();
                  }}
                />
                <ButtonCustom
                  label="Xác nhận"
                  type="primary"
                  loading={loading}
                  onClick={formRefuseToPriceData.submitForm}
                  className="btn-refuse"
                />
              </Space>
            </Row>
          </Form>
        )}
        <div className="table-addition" style={{ padding: "0 8px" }}>
          <RefuseToPriceTable appraisalFileId={appraisalFileId} />
        </div>
      </Space>
    </Modal>
  );
};
export default RefuseToPriceModal;
