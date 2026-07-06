import { Col, Form, Input, Row, Space, Tooltip } from "antd";
import InputFields from "components/InputFields";
import FormItem from "components/InputFields/FormItem";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { useRoadInPrices } from "utils/request/useRoadInPrices";
import {
  isDeepEqual,
  reTypeEmptyString2NullObj,
  validLengthInput,
} from "utils/validate";
import * as Yup from "yup";
const { SELECT, INPUT_NUMBER } = TYPE_FIELD;

type RefProps = {
  getData: () => void;
};

type DetailAddressType = {
  roadInPriceRange: number | null;
  distanceToMainRoad: number | null;
  roadContiguousTypeId: number | null;
  positionInPriceRangeId: number | null;
  positionId: number | null;
  minWidthToMainRoad: number | null;
  maxWidthToMainRoad: number | null;
  zoneId: number | null;
  note: string | null;
};
type Props = {
  data: DetailAddressType;
  provinceCode: string | null;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const cssLabel = { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 };
const cssInput = { xs: 16, sm: 16, md: 16, lg: 16, xl: 16 };

const formSchema = Yup.object().shape({
  distanceToMainRoad: Yup.number()
    .nullable()
    .test("distanceToMainRoadFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  minWidthToMainRoad: Yup.number()
    .nullable()
    .test("minWidthToMainRoadFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
  maxWidthToMainRoad: Yup.number()
    .nullable()
    .test("maxWidthToMainRoadFormSchema", "Chỉ nhập được 50 ký tự", (val) =>
      validLengthInput(val, 50)
    ),
});

const DetailAddress = forwardRef<RefProps, Props>(
  ({ data, provinceCode }, ref) => {
    const {
      listPositionOptions,
      positionInPriceRangeOptions,
      zoneOptions,
      roadContiguousTypeOptions,
    } = useSelector((state: RootState) => state.globalSlice);
    const { data: roadInPrices } = useRoadInPrices(provinceCode);

    const form = useFormik({
      initialValues: {} as DetailAddressType,
      validationSchema: formSchema,
      onSubmit: (data: DetailAddressType): any => {
        return data;
      },
    });
    const handleChangeData = (data: any) => {
      const _data = reTypeEmptyString2NullObj(data);
      form.setValues({ ...form.values, ..._data });
    };
    const inputs1: InputFiledParams[] = [
      {
        key: 1,
        label: "Đoạn đường trong khung giá",
        dataIndex: "roadInPriceRange",
        type: SELECT,
        options: roadInPrices?.map((item: any, index: number) => ({
          key: index.toString(),
          value: item.roadInPriceRangeId,
          label: item.road,
        })),
        placeholder: "Chọn",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        value: form.values.roadInPriceRange,
        onChange: (value: number) =>
          handleChangeData({ roadInPriceRange: value }),
      },
      {
        key: 2,
        label: "Khoảng cách đến đường chính (m)",
        dataIndex: "distanceToMainRoad",
        type: INPUT_NUMBER,
        placeholder: "Nhập",
        css: css,
        labelCol: cssLabel,
        currencable: true,
        wrapperCol: cssInput,
        value: form.values.distanceToMainRoad,
        error: form.errors.distanceToMainRoad,
        touched: form.touched.distanceToMainRoad,
        onChange: (value: number) =>
          handleChangeData({ distanceToMainRoad: value }),
      },
      {
        key: 3,
        label: "Loại đường tiếp giáp",
        dataIndex: "roadContiguousTypeId",
        type: SELECT,
        options: roadContiguousTypeOptions,
        placeholder: "Chọn",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        value: form.values.roadContiguousTypeId || null,
        onChange: (value: number) =>
          handleChangeData({ roadContiguousTypeId: value }),
      },
      {
        key: 4,
        label: "Vị trí trong khung giá",
        dataIndex: "positionInPriceRangeId",
        type: SELECT,
        options: positionInPriceRangeOptions,
        placeholder: "Chọn",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        value: form.values.positionInPriceRangeId,
        onChange: (value: number) =>
          handleChangeData({ positionInPriceRangeId: value }),
      },
      {
        key: 5,
        label: "Vị trí",
        dataIndex: "positionId",
        type: SELECT,
        options: listPositionOptions,
        placeholder: "Chọn",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        value: form.values.positionId,
        onChange: (value: number) => handleChangeData({ positionId: value }),
      },
    ];

    const inputs2: InputFiledParams[] = [
      {
        key: 6,
        label: "Khu vực",
        dataIndex: "zoneId",
        type: SELECT,
        options: zoneOptions,
        placeholder: "Chọn",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        value: form.values.zoneId,
        onChange: (value: number) => handleChangeData({ zoneId: value }),
      },
    ];

    useImperativeHandle(ref, () => ({
      getData: form.submitForm,
    }));

    useEffect(() => {
      form.setValues(data);
    }, [data]);

    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={"small"}
        className="otherInfo-wrapper"
      >
        <Row gutter={[24, 4]} style={{ marginBottom: "8px", marginTop: "8px" }}>
          <InputFields data={inputs1} />
          <Col span={12}>
            <Form.Item
              labelCol={cssLabel}
              wrapperCol={cssInput}
              colon={false}
              className="form-item-input-container"
              label={
                <Tooltip placement="bottom" title={"Độ rộng đường (m)"}>
                  {false ? (
                    <>
                      {"Độ rộng đường (m)"}
                      <span style={{ color: "#F25B60" }}> *</span>
                    </>
                  ) : (
                    "Độ rộng đường (m) "
                  )}
                </Tooltip>
              }
            >
              <Row gutter={[24, 0]}>
                <Col span={12}>
                  <FormItem
                    type={INPUT_NUMBER}
                    style={{ width: "100%" }}
                    value={form.values.minWidthToMainRoad}
                    error={form.errors.minWidthToMainRoad}
                    touched={form.touched.minWidthToMainRoad}
                    onChange={(value: number) =>
                      handleChangeData({ minWidthToMainRoad: value })
                    }
                    placeholder={"Độ rộng NN"}
                    currencable
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    type={INPUT_NUMBER}
                    style={{ width: "100%" }}
                    value={form.values.maxWidthToMainRoad}
                    error={form.errors.maxWidthToMainRoad}
                    touched={form.touched.maxWidthToMainRoad}
                    onChange={(value: number) =>
                      handleChangeData({ maxWidthToMainRoad: value })
                    }
                    placeholder={"Độ rộng LN"}
                    currencable
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <InputFields data={inputs2} />
          <Col span={24}>
            <Form.Item
              className="form-item-custom"
              labelCol={{ span: 4 }}
              colon={false}
              // validateStatus={
              //   form.errors.note && form.touched.note ? "error" : ""
              // }
              // help={
              //   form.errors.note && form.touched.note ? form.errors.note : ""
              // }
              label={
                <Tooltip placement="bottom" title={"Ghi chú"}>
                  Mô tả vị trí địa lý
                </Tooltip>
              }
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập"
                value={
                  form.values.note === null ? "" : String(form.values.note)
                }
                onChange={(e: any) =>
                  handleChangeData({ note: e.target.value })
                }
                className="form-input-custom"
                maxLength={4000}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Space>
    );
  }
);

export default memo(
  DetailAddress,
  (prevProps, nextProps) =>
    isDeepEqual(prevProps.data, nextProps.data) &&
    prevProps.provinceCode === nextProps.provinceCode
);
