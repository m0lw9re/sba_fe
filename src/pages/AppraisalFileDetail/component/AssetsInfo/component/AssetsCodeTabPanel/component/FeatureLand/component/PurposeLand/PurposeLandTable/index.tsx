import { Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { ArrowRightSVG } from "assets";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { FC, memo } from "react";
import { numberUtils } from "utils";
import { isDeepEqual } from "utils/validate";
import "./style.scss";

const { INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  data: {
    legalAreaWidth: number | null;
    legalAreaInPlan: number | null;
    legalAreaUnPlan: number | null;
    legalPrivateArea: number | null;
    legalCommonArea: number | null;
    legalAreaNotConsiderValue: number | null;
    realAreaWidth: number | null;
    realAreaInPlan: number | null;
    realAreaUnPlan: number | null;
    realPrivateArea: number | null;
    realCommonArea: number | null;
    realAreaNotConsiderValue: number | null;
  };

  handleChange: (data: any) => void;
  errors: any;
  touched: any;
  updateListTab: any;
};

const PurposeLandTable: FC<Props> = ({
  data,
  handleChange,
  errors,
  touched,
  updateListTab,
}) => {
  const handleCopyLegalToReal = () => {
    handleChange({
      realAreaWidth: data.legalAreaWidth,
      realAreaInPlan: data.legalAreaInPlan,
      realAreaUnPlan: data.legalAreaUnPlan,
      realPrivateArea: data.legalPrivateArea,
      realCommonArea: data.legalCommonArea,
      realAreaNotConsiderValue: data.legalAreaNotConsiderValue,
    });
    updateListTab();
  };

  const dataSource = [
    {
      type: "Diện tích khuôn viên (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalAreaWidth}
          onChange={(value: number) => {
            if (value >= data.legalAreaInPlan!) {
              handleChange({
                legalAreaWidth: value,
                legalAreaUnPlan: numberUtils.roundDecimalNumber(
                  Number(value) -
                    Number(data.legalAreaInPlan) -
                    Number(data.legalAreaNotConsiderValue)
                ),
              });
            } else {
              message.error(
                '"Diện tích khuôn viên" phải lớn hơn hoặc bằng "Diện tích phù hợp quy hoạch"'
              );
            }
          }}
          error={errors.legalAreaWidth}
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realAreaWidth}
          onChange={(value: number) => {
            if (value >= Number(data.realAreaInPlan)) {
              handleChange({
                realAreaWidth: value,
                realAreaUnPlan: numberUtils.roundDecimalNumber(
                  Number(value) -
                    Number(data.realAreaInPlan) -
                    Number(data.realAreaNotConsiderValue)
                ),
              });
              updateListTab();
            } else {
              message.error(
                '"Diện tích khuôn viên" phải lớn hơn hoặc bằng "Diện tích phù hợp quy hoạch"'
              );
            }
          }}
          error={errors.realAreaWidth}
          touched={touched.realAreaWidth}
          currencable
        />
      ),
    },
    {
      type: "Diện tích phù hợp quy hoạch (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalAreaInPlan}
          onChange={(value: number) => {
            if (value <= data.legalAreaWidth!) {
              handleChange({
                legalAreaInPlan: value,
                legalAreaUnPlan: numberUtils.roundDecimalNumber(
                  Number(
                    Number(data.legalAreaWidth) -
                      Number(data.legalAreaNotConsiderValue) -
                      Number(value)
                  )
                ),
              });
            } else {
              message.error(
                '"Diện tích phù hợp quy hoạch" phải nhỏ hơn "Diện tích khuôn viên"'
              );
            }
          }}
          error={errors.legalAreaInPlan}
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realAreaInPlan}
          onChange={(value: number) => {
            if (value <= data.realAreaWidth!) {
              handleChange({
                realAreaInPlan: value,
                realAreaUnPlan: numberUtils.roundDecimalNumber(
                  Number(data.realAreaWidth) -
                    Number(data.realAreaNotConsiderValue) -
                    Number(value)
                ),
              });
              updateListTab();
            } else {
              message.error(
                '"Diện tích phù hợp quy hoạch" phải nhỏ hơn "Diện tích khuôn viên"'
              );
            }
          }}
          error={errors.realAreaInPlan}
          currencable
        />
      ),
    },
    {
      type: "Diện tích không phù hợp quy hoạch (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalAreaUnPlan}
          error={errors.legalAreaUnPlan}
          placeholder="Nhập"
          disable={true}
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realAreaUnPlan}
          error={errors.realAreaUnPlan}
          touched={errors.realAreaUnPlan}
          placeholder="Nhập"
          disable={true}
          currencable
        />
      ),
    },
    {
      type: "Diện tích mở đường/Diện tích không xem xét giá trị (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalAreaNotConsiderValue}
          onChange={(value: number) => {
            if (value <= data.legalAreaWidth!) {
              handleChange({
                legalAreaNotConsiderValue: value,
                legalAreaUnPlan: numberUtils.roundDecimalNumber(
                  Number(
                    Number(data.legalAreaWidth) -
                      Number(data.legalAreaInPlan) -
                      Number(value)
                  )
                ),
              });
            } else {
              message.error(
                '"Diện tích mở đường/Diện tích không xem xét giá trị" phải nhỏ hơn "Diện tích khuôn viên"'
              );
            }
          }}
          error={errors.legalAreaNotConsiderValue}
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realAreaNotConsiderValue}
          onChange={(value: number) => {
            if (value <= data.realAreaWidth!) {
              handleChange({
                realAreaNotConsiderValue: value,
                realAreaUnPlan: numberUtils.roundDecimalNumber(
                  Number(data.realAreaWidth) -
                    Number(data.realAreaInPlan) -
                    Number(value)
                ),
              });
              updateListTab();
            } else {
              message.error(
                '"Diện tích mở đường/Diện tích không xem xét giá trị" phải nhỏ hơn "Diện tích khuôn viên"'
              );
            }
          }}
          error={errors.realAreaNotConsiderValue}
          touched={errors.realAreaNotConsiderValue}
          currencable
        />
      ),
    },
    {
      type: "Diện tích sử dụng riêng (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalPrivateArea}
          onChange={(value: number) =>
            handleChange({ legalPrivateArea: value })
          }
          error={errors.legalPrivateArea}
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realPrivateArea}
          onChange={(value: number) => {
            handleChange({ realPrivateArea: value });
            updateListTab();
          }}
          error={errors.realPrivateArea}
          currencable
        />
      ),
    },
    {
      type: "Diện tích sử dụng chung (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalCommonArea}
          onChange={(value: number) => handleChange({ legalCommonArea: value })}
          error={errors.legalCommonArea}
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realCommonArea}
          onChange={(value: number) => {
            handleChange({ realCommonArea: value });
            updateListTab();
          }}
          error={errors.realCommonArea}
          currencable
        />
      ),
    },
  ];

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "Đặc điểm",
      dataIndex: "type",
      width: "30%",
    },
    {
      key: 2,
      title: "HSPL",
      dataIndex: "hspl",
      width: "30%",
    },
    {
      key: 3,
      title: (
        <ArrowRightSVG
          className="feature-table-icon-copy"
          onClick={handleCopyLegalToReal}
        />
      ),
      dataIndex: "icon",
      width: "5%",
    },
    {
      key: 4,
      title: "Thực tế",
      dataIndex: "real",
      width: "30%",
    },
  ];

  return (
    <Table
      size="small"
      className="form-item-table-add-custom-container"
      bordered
      scroll={{ x: true }}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
    />
  );
};

export default memo(
  PurposeLandTable,
  (prevProps, nextProps) =>
    isDeepEqual(prevProps.data, nextProps.data) &&
    isDeepEqual(prevProps.errors, nextProps.errors) &&
    isDeepEqual(prevProps.touched, nextProps.touched) &&
    prevProps.handleChange === nextProps.handleChange
);
