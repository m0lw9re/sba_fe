import { Card, Col, Row, Typography } from "antd";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "pages/AppraisalFileCreate/component/GeneralInfor/component/CommonInfor/style.scss";
import { useFormik } from "formik";
import { AssetLevelTwoType } from "constant/types";
import { assetCommonApi } from "apis/assetCommon";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  setAssetLevelTwoId,
  setAssetLevelOneId,
} from "pages/AppraisalFileCreate/store/appraisalFileCreateSlice";
import SelectCustom from "components/SelectCustom";
import { RootState } from "configs/configureStore";
import { setChangeAppraisalFileCreate } from "configs/globalSlice";

type RefProps = {
  addCommonInfor: () => void;
};

type FormDataType = {
  assetLevelOneId: number | null;
  assetLevelTwoId: number | null;
  appraisalPurposeId: number | null;
};

const initialValue: FormDataType = {
  assetLevelTwoId: null,
  appraisalPurposeId: null,
  assetLevelOneId: null,
};

const formSchema = Yup.object().shape({
  appraisalPurposeId: Yup.number().typeError(
    "Vui lòng chọn mục đích thẩm định"
  ),
  assetLevelOneId: Yup.number().typeError("Vui lòng chọn loại tài sản"),
  assetLevelTwoId: Yup.number().typeError("Vui lòng chọn loại hình tài sản"),
});

const CommonInfor = forwardRef<RefProps>(({}, ref) => {
  const dispatch = useDispatch();
  const form = useFormik({
    initialValues: initialValue,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: (data: FormDataType): any => {
      return data;
    },
  });

  const { assetLevelOneOptions, appraisalPurposeOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  useImperativeHandle(ref, () => ({
    addCommonInfor: form.submitForm,
  }));

  const [assetLevelTwoOptions, setAssetLevelTwoOptions] = useState<
    AssetLevelTwoType[]
  >([]);

  useEffect(() => {
    const getAssetLevelTwoOptions = async () => {
      setAssetLevelTwoOptions([]);
      dispatch(setAssetLevelTwoId(null));
      dispatch(setAssetLevelOneId(form.values.assetLevelOneId));
      if (form.values.assetLevelOneId) {
        const response = await assetCommonApi.getAssetLevel2(
          form.values.assetLevelOneId
        );
        setAssetLevelTwoOptions(response.data);
      }
    };
    getAssetLevelTwoOptions();
  }, [dispatch, form.values.assetLevelOneId]);

  const handleChange = useCallback(
    (data: any) => {
      form.setValues({ ...form.values, ...data });
      dispatch(
        setChangeAppraisalFileCreate({
          title: "Tạo mới hồ sơ",
          value: { ...form.values, ...data },
        })
      );
    },
    [form.values]
  );

  const fixData = [
    {
      label: "Mã đề nghị",
      value: "",
    },
    {
      label: "Số tờ trình",
      value: "",
    },
    {
      label: "Thời gian gửi yêu cầu",
      value: "",
    },
  ];

  const selectableData = [
    {
      label: "Loại tài sản",
      value: form.values.assetLevelOneId,
      onChange: (value: number) => {
        handleChange({
          assetLevelOneId: value,
          assetLevelTwoId: null,
        });
      },
      options: assetLevelOneOptions,
      errors: form.errors.assetLevelOneId,
      touched: form.touched.assetLevelOneId,
    },
    {
      label: "Loại hình tài sản",
      value: form.values.assetLevelTwoId,
      onChange: (value: number) => {
        dispatch(setAssetLevelTwoId(value));
        handleChange({ assetLevelTwoId: value });
      },
      options:
        assetLevelTwoOptions?.map((item) => {
          return {
            label: item.assetLevelTwoName,
            value: item.assetLevelTwoId,
          };
        }) || [],
      errors: form.errors.assetLevelTwoId,
      touched: form.touched.assetLevelTwoId,
    },
    {
      label: "Mục đích thẩm định",
      value: form.values.appraisalPurposeId,
      onChange: (value: number) => handleChange({ appraisalPurposeId: value }),
      options: appraisalPurposeOptions,
      errors: form.errors.appraisalPurposeId,
      touched: form.touched.appraisalPurposeId,
    },
  ];

  const css = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8 };
  return (
    <div className="common-infor-div-container">
      <Card size="small" className="card-container">
        <Row gutter={[12, 8]}>
          {fixData.map((item) => (
            <Col xl={css.xl} lg={css.lg} md={css.md} sm={css.sm} xs={css.xs}>
              <Row className="infor-item-container">
                <Col span={12}>
                  <Typography style={{ opacity: 0.6, flex: 0.4 }}>
                    {item.label}
                  </Typography>
                </Col>
                <Col span={12}>
                  <Typography style={{ opacity: 0.6, flex: 0.4 }}>
                    {item.value}
                  </Typography>
                </Col>
              </Row>
            </Col>
          ))}
          {selectableData.map((item) => (
            <Col xl={css.xl} lg={css.lg} md={css.md} sm={css.sm} xs={css.xs}>
              <Row className="infor-item-container">
                <Col span={11}>
                  <Typography style={{ opacity: 0.6, flex: 0.4 }}>
                    {item.label}
                    <span style={{ color: "#F25B60", opacity: 1 }}> *</span>
                  </Typography>
                </Col>
                <Col span={13}>
                  <SelectCustom
                    size="small"
                    showSearch={true}
                    placeholder="Chọn"
                    value={item.value}
                    options={item.options}
                    onChange={item.onChange}
                  />
                  {item.touched && item.errors ? (
                    <div style={{ color: "red" }}>{item.errors}</div>
                  ) : null}
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
});

export default CommonInfor;
