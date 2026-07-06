import { Col, Form, Input, Row, Space, Tooltip } from "antd";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { FC, memo } from "react";
import { useSelector } from "react-redux";
import { isDeepEqual } from "utils";

const { SELECT, INPUT, INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  data: {
    realBuilding: string | null;
    numberFloors: number | null;
    nameBuilding: string | null;
    numberBasement: number | null;
    positionId: number | null;
    mainRoadWith: number | null;
    totalApartmentArea: number | null;
    uses: string | null;
    usingPurposeTypeId: string | null;
    termOfLandUse: string | null;
    description: string | null;
    // remainQuantity: number | null
  };
  handleChange: (data: any) => void;
  errors: any;
  touched: any;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const cssLabel = { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 };
const cssInput = { xs: 16, sm: 16, md: 16, lg: 16, xl: 16 };

const DetailAddress: FC<Props> = ({ data, handleChange, errors, touched }) => {
  const { usingPurposeOptions, listPositionOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const inputs1: InputFiledParams[] = [
    {
      key: 1,
      label: "Toà nhà thực tế",
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: data.realBuilding,
      error: errors.realBuilding,
      touched: touched.realBuilding,
      onChange: (e: any) => handleChange({ realBuilding: e.target.value }),
    },
    {
      key: 2,
      label: "Tên chung cư/dự án",
      type: INPUT,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: data.nameBuilding,
      onChange: (e: any) => handleChange({ nameBuilding: e.target.value }),
      error: errors.nameBuilding,
      touched: touched.nameBuilding,
    },
    {
      key: 3,
      label: "Số tầng toà nhà",
      type: INPUT_NUMBER,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: data.numberFloors,
      onChange: (value: number) => handleChange({ numberFloors: value }),
    },
    {
      key: 4,
      label: "Số hầm toà nhà",
      type: INPUT_NUMBER,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: data.numberBasement,
      onChange: (value: number) => handleChange({ numberBasement: value }),
    },
    {
      key: 5,
      label: "Vị trí",
      type: SELECT,
      options: listPositionOptions,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: data.positionId,
      onChange: (value: number) => handleChange({ positionId: value }),
      error: errors.positionId,
      touched: touched.positionId,
    },
    {
      key: 5,
      label: "Độ rộng đường chính (m)",
      type: INPUT_NUMBER,
      placeholder: "Nhập",
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: data.mainRoadWith,
      onChange: (value: number) => handleChange({ mainRoadWith: value }),
      currencable: true,
    },
  ];

  const inputs2: InputFiledParams[] = [
    // {
    //   key: 7,
    //   label: "Mô tả chi tiết vị trí",
    //   type: TEXT_AREA,
    //   placeholder: "Nhập",
    //   css: { ...css, lg: 24, xl: 24 },
    //   labelCol: { ...cssLabel, lg: 5, xl: 5 },
    //   wrapperCol: { ...cssInput, lg: 19, xl: 19 },
    //   value: data.note,
    //   maxLength: 4000,
    //   onChange: (e: any) => handleChange({ note: e.target.value }),
    // },
    {
      key: 8,
      label: "Tổng diện tích chung cư (m²)",
      type: INPUT_NUMBER,
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      currencable: true,
      value: data.totalApartmentArea,
      onChange: (value: number) => handleChange({ totalApartmentArea: value }),
    },
    {
      key: 9,
      label: "Hình thức sử dụng",
      type: INPUT,
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: data.uses,
      onChange: (e: any) => handleChange({ uses: e.target.value }),
    },
    {
      key: 10,
      label: "Mục đích sử dụng đất",
      type: SELECT,
      css: css,
      selectMultiple: true,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value:
        data.usingPurposeTypeId?.split(",").map((item) => Number(item)) || [],
      options: usingPurposeOptions.filter((item: any) => item.value !== 80),
      placeholder: "Chọn",
      onChange: (value: string[]) => {
        handleChange({ usingPurposeTypeId: value.join(",") });
      },
    },
    {
      key: 11,
      label: "Thời hạn sử dụng đất",
      type: INPUT,
      css: css,
      labelCol: cssLabel,
      wrapperCol: cssInput,
      value: data.termOfLandUse,
      onChange: (e: any) => handleChange({ termOfLandUse: e.target.value }),
    },
    // {
    //   key: 12,
    //   label: "Chất lượng còn lại (%)",
    //   type: INPUT_NUMBER,
    //   css: css,
    //   labelCol: cssLabel,
    //   wrapperCol: cssInput,
    //   value: data.remainQuantity,
    //   percentable: true,
    //   onChange: (e: number) => handleChange({ remainQuantity: e }),
    // },
  ];
  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="otherInfo-wrapper"
    >
      <Row gutter={[24, 4]} style={{ marginBottom: "8px", marginTop: "8px" }}>
        <InputFields data={inputs1} />
        <Col span={24}>
          <Form.Item
            className="form-item-custom"
            labelCol={{ span: 4 }}
            colon={false}
            validateStatus={
              errors.description && touched.description ? "error" : ""
            }
            help={
              errors.description && touched.description ? errors.description : ""
            }
            label={
              <Tooltip placement="bottom" title={"Ghi chú"}>
                Mô tả chi tiết vị trí
              </Tooltip>
            }
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập"
              value={data.description || ""}
              onChange={(e: any) =>
                handleChange({ description: e.target.value })
              }
              className="form-input-custom"
              maxLength={1000}
            />
          </Form.Item>
        </Col>
        <InputFields data={inputs2} />
      </Row>
    </Space>
  );
};

export default memo(
  DetailAddress,
  (prevProps, nextProps) =>
    isDeepEqual(prevProps.data, nextProps.data) &&
    isDeepEqual(prevProps.errors, nextProps.errors) &&
    isDeepEqual(prevProps.touched, nextProps.touched) &&
    prevProps.handleChange === nextProps.handleChange
);
