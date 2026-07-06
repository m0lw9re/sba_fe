import { Col, Form, Input, Row, Space } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { addressApi } from "apis/adress";
import FormItem from "components/InputFields/FormItem";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { AssetProjectInfoType } from "constant/types/appraisalFile";
import { useFormik } from "formik";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import renderRequired from "components/RenderRequire";
import { formSchema } from "./config";

const { INPUT_NUMBER, INPUT, SELECT, POPUP_INPUT } = TYPE_FIELD;

type Props = {
  data: any;
  onChangeAreaWidth: (value: number | null) => void;
};
type RefProps = {
  updateSummaryTable: () => void;
};

type IOptions = {
  value: string | number;
  label: string;
};

const FeatureProjectSummaryTable = forwardRef<RefProps, Props>((props, ref) => {
  const { data, onChangeAreaWidth } = props;

  const formControl = useFormik({
    initialValues: data as any,
    validationSchema: formSchema,
    onSubmit: (data: any): any => {
      return data;
    },
  });

  const { addressByLos } = useSelector(
    (state: RootState) => state.appraisalFileDetailSlice
  );

  const { provinceOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  useImperativeHandle(ref, () => ({
    updateSummaryTable: async () => {
      return [await formControl.submitForm(), true];
      // return formControl
      //   .validateForm()
      //   .then(() => {
      //     return [formControl.values, true];
      //   })
      //   .catch(() => {
      //     return [formControl.values, false];
      //   });
    },
  }));

  const handleChange = (data: any) => {
    // update table data
    formControl.setValues({ ...formControl.values, ...data });
  };

  const handleProvinceChange = async (value: any) => {
    // get districts
    const districts = await addressApi.getDistricts({
      code: value,
    });
    const districtsOptions: IOptions[] = districts.data?.map((item: any) => ({
      value: item.code,
      label: item.fullName,
    }));
    handleChange({
      provinceCode: value,
      districtCode: null,
      wardCode: null,
      districts: districtsOptions,
      wards: [],
    });
  };

  const handleDistrictChange = async (value: any) => {
    // get wards
    const wards = await addressApi.getWards({
      code: value,
    });
    const wardsOptions: IOptions[] = wards.data?.map((item: any) => ({
      value: item.code,
      label: item.fullName,
    }));
    handleChange({
      districtCode: value,
      wardCode: null,
      wards: wardsOptions,
    });
  };

  const featureProjectErr: any = formControl.errors;
  const featureProjectTouched: any = formControl.touched;

  const columns: ColumnsType<AssetProjectInfoType> = useMemo(() => {
    return [
      {
        key: 3,
        title: renderRequired("Tỉnh/Thành phố"),
        dataIndex: "provinceCode",
        width: "180px",
        render: (provinceCode: any, _, index: number) => {
          return (
            <FormItem
              type={SELECT}
              showSearch
              options={provinceOptions}
              value={provinceCode || null}
              error={featureProjectErr?.provinceCode}
              touched={featureProjectTouched?.provinceCode}
              onChange={(value: any) => {
                handleProvinceChange(value);
              }}
            />
          );
        },
      },
      {
        key: 4,
        title: "Quận/Huyện/Thị xã",
        dataIndex: "districtCode",
        width: "180px",
        render: (
          districtCode: any,
          record: AssetProjectInfoType,
          index: number
        ) => {
          return (
            <FormItem
              type={SELECT}
              showSearch
              options={record?.districts || []}
              value={districtCode || ""}
              error={featureProjectErr?.districtCode}
              touched={featureProjectTouched?.districtCode}
              onChange={(value: any) => handleDistrictChange(value)}
            />
          );
        },
      },
      {
        key: 5,
        title: "Xã/Phường/Thị trấn",
        dataIndex: "wardCode",
        width: "180px",
        render(wardCode: any, record: AssetProjectInfoType, index: number) {
          return (
            <FormItem
              type={SELECT}
              showSearch
              options={record?.wards || []}
              value={wardCode || ""}
              error={featureProjectErr?.wardCode}
              touched={featureProjectTouched?.wardCode}
              onChange={(value: any) => handleChange({ wardCode: value })}
            />
          );
        },
      },
      {
        key: 6,
        title: renderRequired("Địa điểm thẩm định giá"),
        dataIndex: "appraisalLocation",
        width: "280px",
        render: (appraisalLocation: any, _, index: number) => {
          return (
            <FormItem
              type={POPUP_INPUT}
              showCount
              maxLength={500}
              value={appraisalLocation || ""}
              error={featureProjectErr?.appraisalLocation}
              touched={featureProjectTouched?.appraisalLocation}
              onChange={(e: any) => {
                handleChange({ appraisalLocation: e.target.value });
              }}
            />
          );
        },
      },
      {
        key: 8,
        title: renderRequired("Hiện trạng"),
        dataIndex: "currentAsset",
        width: "200px",
        render: (currentAsset: any, _, index: number) => {
          return (
            <FormItem
              type={POPUP_INPUT}
              showCount
              maxLength={2000}
              value={currentAsset || ""}
              error={featureProjectErr?.currentAsset}
              touched={featureProjectTouched?.currentAsset}
              onChange={(e: any) =>
                handleChange({ currentAsset: e.target.value })
              }
            />
          );
        },
      },
      {
        key: 7,
        title: renderRequired("Diện tích khuôn viên (m²)"),
        dataIndex: "areaWidth",
        width: "200px",
        render: (areaWidth: any, _, index: number) => {
          return (
            <FormItem
              type={INPUT_NUMBER}
              error={featureProjectErr?.areaWidth}
              touched={featureProjectTouched?.areaWidth}
              value={areaWidth}
              onChange={(value: number) => {
                handleChange({ areaWidth: value });
                onChangeAreaWidth(value);
              }}
              placeholder="Nhập"
              currencable
            />
          );
        },
      },
      {
        key: 9,
        title: renderRequired("Mô tả vị trí địa lý"),
        dataIndex: "description",
        width: "200px",
        render: (description: any, _, index: number) => {
          return (
            <FormItem
              type={POPUP_INPUT}
              value={description}
              error={featureProjectErr?.description}
              touched={featureProjectTouched?.description}
              onChange={(e: any) =>
                handleChange({ description: e.target.value })
              }
              placeholder="Nhập"
              maxLength={2000}
            />
          );
        },
      },
    ];
  }, [
    formControl.values,
    provinceOptions,
    featureProjectErr,
    featureProjectTouched,
  ]);

  useEffect(() => {
    if (data) {
      formControl.setValues(data);
    }
  }, [JSON.stringify(data)]);

  return (
    <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
      <Row gutter={[24, 8]} style={{ marginBottom: "8px" }}>
        <Col xs={24}>
          <Form.Item
            colon={false}
            className="form-item-input-container"
            label={"Địa chỉ tài sản"}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input.TextArea
              showCount={false}
              size={"small"}
              rows={3}
              value={addressByLos}
              placeholder={"Hệ thống tự nhập"}
              allowClear={false}
              maxLength={1000}
            />
          </Form.Item>
        </Col>
      </Row>
      <Table
        size="small"
        bordered
        scroll={{ x: 1980 }}
        pagination={false}
        columns={columns}
        dataSource={[{ ...formControl.values }]}
      />
    </Space>
  );
});
export default memo(FeatureProjectSummaryTable);
