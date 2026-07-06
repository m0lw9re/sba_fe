import { Alert, Card, Col, Row, Typography } from "antd";
import SelectCustom from "components/SelectCustom";
import { RootState } from "configs/configureStore";
import { ASSET_LV2 } from "constant/enums";
import { AppraisalFileType, AssetLevelTwoType } from "constant/types";
import { useFormik } from "formik";
import "pages/AppraisalFileDetail/component/GeneralInfo/component/FixedInfor/style.scss";
import { setAssetLevelTwoId } from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
import { formatDateWithHour } from "utils/date";
import { useAppraisalFileDetail, useAssetLevelTwo } from "utils/request";
import * as Yup from "yup";

type RefProps = {
  updateCommonInfor: () => void;
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

type Props = {
  commonInforData: {
    assetLevelOneId: number | null;
    assetLevelTwoId: number | null;
    appraisalPurposeId: number | null;
    checkClimsLos: boolean | null;
    rePricingNumber: number | null;
  };
  disableEdit: boolean;
  disableEditRoleCBTH: boolean;
  receivedFromLos: boolean;
};
const css = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8 };

const formSchema = Yup.object().shape({
  appraisalPurposeId: Yup.number().typeError(
    "Vui lòng chọn mục đích thẩm định"
  ),
  assetLevelOneId: Yup.number().typeError("Vui lòng chọn loại tài sản"),
  assetLevelTwoId: Yup.number().typeError("Vui lòng chọn loại hình tài sản"),
});

const FixedInfor = forwardRef<RefProps, Props>(
  (
    { commonInforData, disableEdit, disableEditRoleCBTH, receivedFromLos },
    ref
  ) => {
    const dispatch = useDispatch();
    const globalSliceData = useSelector(
      (state: RootState) => state.globalSlice
    );
    const form = useFormik({
      initialValues: initialValue,
      validationSchema: formSchema,
      validateOnChange: true,
      onSubmit: (data: FormDataType): any => {
        return data;
      },
    });

    useEffect(() => {
      form.setValues({
        ...commonInforData,
      });
    }, []);

    let { id }: { id?: string } = useParams();

    useImperativeHandle(ref, () => ({
      updateCommonInfor: form.submitForm,
    }));

    const handleChange = useCallback(
      (data: any) => {
        form.setValues({ ...form.values, ...data });
      },
      [form.values]
    );

    const {
      data: appraisalFileDetail,
      isLoading,
    }: {
      data: AppraisalFileType;
      isLoading: boolean;
      error: any;
      mutate: () => void;
    } = useAppraisalFileDetail(id || "");
    const assetLevelTwoSWR = useAssetLevelTwo(form.values.assetLevelOneId);

    const fixData = [
      {
        label: "Mã đề nghị",
        value: appraisalFileDetail?.proposalCode,
      },
      {
        label: "Số tờ trình",
        value: appraisalFileDetail?.reportCode,
      },
      {
        label: "Thời gian gửi yêu cầu",
        value: appraisalFileDetail?.proposalDate
          ? formatDateWithHour(appraisalFileDetail.proposalDate)
          : null,
      },
    ];

    const selectableData = [
      {
        label: "Loại tài sản",
        value: form.values.assetLevelOneId,
        disable: true,
        onChange: (value: number) => {
          handleChange({
            assetLevelOneId: value,
            assetLevelTwoId: null,
          });
        },
        options: globalSliceData.assetLevelOneOptions,
        errors: form.errors.assetLevelOneId,
        touched: form.touched.assetLevelOneId,
      },
      {
        label: "Loại hình tài sản",
        value: form.values.assetLevelTwoId,
        disable:
          (disableEditRoleCBTH && disableEdit) ||
          commonInforData?.assetLevelTwoId === ASSET_LV2.APARTMENT ||
          (!receivedFromLos &&
            (commonInforData?.assetLevelTwoId === ASSET_LV2.PROJECT ||
              commonInforData?.assetLevelTwoId === ASSET_LV2.ESTIMATE ||
              commonInforData?.assetLevelTwoId === ASSET_LV2.LAND)) ||
          (commonInforData?.assetLevelOneId === 2 &&
            appraisalFileDetail.fileStatus === 1),
        onChange: (value: number) => {
          dispatch(setAssetLevelTwoId(value));
          handleChange({ assetLevelTwoId: value });
        },
        options:
          assetLevelTwoSWR?.data?.map((item: AssetLevelTwoType) => {
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
        disable: true,
        onChange: (value: number) =>
          handleChange({ appraisalPurposeId: value }),
        options: globalSliceData.appraisalPurposeOptions,
        errors: form.errors.appraisalPurposeId,
        touched: form.touched.appraisalPurposeId,
      },
    ];

    return (
      <div className="fixed-infor-div-container">
        <Card size="small" loading={isLoading}>
          {commonInforData.checkClimsLos && (
            <div className="flex-center" style={{ margin: "0 0 12px 0" }}>
              <Alert
                message="Tài sản bị trùng mã CLIMS"
                type="warning"
                showIcon
                style={{
                  width: "35%",
                }}
              />
            </div>
          )}
          <Row gutter={[12, 8]}>
            {fixData.map((item, index: number) => (
              <Col
                xl={css.xl}
                lg={css.lg}
                md={css.md}
                sm={css.sm}
                xs={css.xs}
                key={index}
              >
                <Row className="infor-item-container">
                  <Col span={11}>
                    <Typography style={{ opacity: 0.6, flex: 0.4 }}>
                      {item.label}
                    </Typography>
                  </Col>
                  <Col span={13}>
                    <Typography style={{ opacity: 0.6, flex: 0.4 }}>
                      {item.value}
                    </Typography>
                  </Col>
                </Row>
              </Col>
            ))}
            {selectableData.map((item, index: number) => (
              <Col
                xl={css.xl}
                lg={css.lg}
                md={css.md}
                sm={css.sm}
                xs={css.xs}
                key={index}
              >
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
                      disabled={item.disable}
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
            {appraisalFileDetail.parentId && (
              <Col xl={css.xl} lg={css.lg} md={css.md} sm={css.sm} xs={css.xs}>
                <Row
                  className="infor-item-container"
                  style={{ padding: "0.5rem 0 0 0" }}
                >
                  <Col span={11}>
                    <Link
                      to={APPRAISAL_FILE_DETAIL.replace(
                        ":id",
                        appraisalFileDetail.parentId
                      )}
                      replace
                      target="_blank"
                    >
                      Xem thông tin hồ sơ gốc
                    </Link>
                  </Col>
                  <Col span={13}>
                    <span style={{ color: "#1677FF" }}>
                      Số lần tái định giá:{" "}
                      {commonInforData.rePricingNumber
                        ? commonInforData?.rePricingNumber
                            .toString()
                            .padStart(2, "0")
                        : "01"}
                    </span>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Card>
      </div>
    );
  }
);

export default memo(FixedInfor);
