import { Button, Form, Row, Space } from "antd";
import Icons from "assets/icons";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { AssetLanUsingPurposeType } from "constant/types/appraisalFile";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { FC, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { isDeepEqual, validLengthInput } from "utils/validate";
import PurposeLandTable from "./PurposeLandTable";

const { SELECT, INPUT, POPUP_INPUT } = TYPE_FIELD;

type Props = {
  assetLandUsingPurposeItem: AssetLanUsingPurposeType;
  handleChange: (key: string, data: AssetLanUsingPurposeType) => void;
  handleRemove: (key: string) => void;
  errors: any;
  touched: any;
  updateListTab: any;
};
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const labelCol = { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 };
const wrapperCol = { xs: 16, sm: 16, md: 16, lg: 16, xl: 16 };

const PurposeLand: FC<Props> = ({
  assetLandUsingPurposeItem,
  handleChange,
  handleRemove,
  errors,
  touched,
  updateListTab,
}) => {
  const { usingPurposeOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const handleChangeData = useCallback(
    (data: any) => {
      const tmpObj = { ...assetLandUsingPurposeItem, ...data };
      handleChange(assetLandUsingPurposeItem.key || "", tmpObj);
    },
    [assetLandUsingPurposeItem, handleChange]
  );

  const inputs: InputFiledParams[] = [
    {
      key: 1,
      label: "Mục đích sử dụng",
      dataIndex: "usingPurposeId",
      type: SELECT,
      placeholder: "Chọn",
      css: css,
      require: true,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      options: usingPurposeOptions,
      value: assetLandUsingPurposeItem.usingPurposeId,
      onChange: (value: number) => handleChangeData({ usingPurposeId: value }),
      error: errors?.usingPurposeId || "",
      touched: touched?.usingPurposeId || false,
    },
    {
      key: 2,
      label: "Nguồn gốc sử dụng",
      dataIndex: "usingOrigin",
      type: POPUP_INPUT,
      maxLength: 255,
      placeholder: "Nhập",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: assetLandUsingPurposeItem.usingOrigin,
      onChange: (e: any) => handleChangeData({ usingOrigin: e.target.value }),
      error: errors?.usingOrigin || "",
      touched: touched?.usingOrigin || false,
    },
    {
      key: 3,
      label: "Thời hạn sử dụng",
      dataIndex: "usingPeriod",
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: assetLandUsingPurposeItem.usingPeriod,
      onChange: (e: any) => handleChangeData({ usingPeriod: e.target.value }),
      error: errors?.usingPeriod || "",
      touched: touched?.usingPeriod || false,
    },
  ];

  console.log("MĐSD", assetLandUsingPurposeItem.usingPurposeId)

  return (
    <Space style={{ width: "100%" }} direction="vertical" size={"small"}>
      <Form labelWrap labelAlign="left" size="small">
        <Row gutter={[24, 8]}>
          <InputFields data={inputs} />
        </Row>
      </Form>
      <PurposeLandTable
        data={{
          legalAreaWidth: assetLandUsingPurposeItem.legalAreaWidth,
          legalAreaInPlan: assetLandUsingPurposeItem.legalAreaInPlan,
          legalAreaUnPlan: assetLandUsingPurposeItem.legalAreaUnPlan,
          legalPrivateArea: assetLandUsingPurposeItem.legalPrivateArea,
          legalCommonArea: assetLandUsingPurposeItem.legalCommonArea,

          realAreaWidth: assetLandUsingPurposeItem.realAreaWidth,
          realAreaInPlan: assetLandUsingPurposeItem.realAreaInPlan,
          realAreaUnPlan: assetLandUsingPurposeItem.realAreaUnPlan,
          realPrivateArea: assetLandUsingPurposeItem.realPrivateArea,
          realCommonArea: assetLandUsingPurposeItem.realCommonArea,
        }}
        handleChange={handleChangeData}
        errors={errors}
        touched={touched}
        updateListTab={updateListTab}
      />
      <Row justify={"end"}>
        <Button
          icon={<Icons.sub />}
          size="small"
          type="primary"
          danger
          onClick={() => handleRemove(assetLandUsingPurposeItem.key || "")}
        />
      </Row>
    </Space>
  );
};

export default memo(
  PurposeLand,
  (prevProps, nextProps) =>
    isDeepEqual(
      prevProps.assetLandUsingPurposeItem,
      nextProps.assetLandUsingPurposeItem
    ) &&
    isDeepEqual(prevProps.errors, nextProps.errors) &&
    isDeepEqual(prevProps.touched, nextProps.touched) &&
    prevProps.handleChange === nextProps.handleChange
);
