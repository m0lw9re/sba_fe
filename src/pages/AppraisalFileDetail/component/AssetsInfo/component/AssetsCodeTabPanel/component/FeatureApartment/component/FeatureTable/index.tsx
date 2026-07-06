import "./style.scss";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { ArrowRightSVG } from "assets";
import InputCustom from "components/InputCustom";
import { FC, memo } from "react";
import { isDeepEqual } from "utils/validate";
import { TYPE_FIELD } from "constant/enums";
import FormItem from "components/InputFields/FormItem";
import { numberUtils } from "utils";

const { INPUT, INPUT_NUMBER, TEXT_AREA } = TYPE_FIELD;

type Props = {
  data: {
    legalApartmentCode: string | null;
    legalFloorNo: number | null;
    legalNumberBedroom: number | null;
    legalNumberToilets: number | null;
    legalFurniture: string | null;
    legalFacades: number | null;
    legalMainBalconyDirection: string | null;
    legalPrivateUseArea: number | null;
    legalClearanceArea: number | null;
    legalBuildupArea: number | null;
    legalExtendArea: number | null;
    legalCurrentPrivateUsing: string | null;
    realApartmentCode: string | null;
    realFloorNo: number | null;
    realNumberBedroom: number | null;
    realNumberToilets: number | null;
    realFurniture: string | null;
    realFacades: number | null;
    realMainBalconyDirection: string | null;
    realPrivateUseArea: number | null;
    realClearanceArea: number | null;
    realBuildupArea: number | null;
    realExtendArea: number | null;
    realCurrentPrivateUsing: string | null;
  };

  handleChange: (data: any) => void;
  errors: any;
  touched: any;
  updateListTab: any;
};

const style = { width: "100%" };

const FeatureTables: FC<Props> = ({
  data,
  handleChange,
  errors,
  touched,
  updateListTab,
}) => {
  const handleCopyLegalToReal = () => {
    handleChange({
      realApartmentCode: data.legalApartmentCode,
      realFloorNo: data.legalFloorNo,
      realNumberBedroom: data.legalNumberBedroom,
      realNumberToilets: data.legalNumberToilets,
      realFurniture: data.legalFurniture,
      realFacades: data.legalFacades,
      realMainBalconyDirection: data.legalMainBalconyDirection,
      realPrivateUseArea: data.legalPrivateUseArea,
      realClearanceArea: data.legalClearanceArea,
      realBuildupArea: data.legalBuildupArea,
      realExtendArea: data.legalExtendArea,
      realCurrentPrivateUsing: data.legalCurrentPrivateUsing,
    });
    updateListTab();
  };

  const dataSource = [
    {
      type: "Mã căn hộ",
      hspl: (
        <FormItem
          type={INPUT}
          placeholder="Nhập"
          style={style}
          value={data.legalApartmentCode || ""}
          onChange={(e: any) =>
            handleChange({
              legalApartmentCode: e.target.value,
            })
          }
          error={errors.legalApartmentCode}
          touched={touched.legalApartmentCode}
        />
      ),
      real: (
        <FormItem
          type={INPUT}
          placeholder="Nhập"
          style={style}
          value={data.realApartmentCode || ""}
          onChange={(e: any) =>
            handleChange({
              realApartmentCode: e.target.value,
            })
          }
          error={errors.realApartmentCode}
          touched={touched.realApartmentCode}
        />
      ),
    },
    {
      type: "Tầng số",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalFloorNo}
          onChange={(value: number) =>
            handleChange({
              legalFloorNo: value,
            })
          }
          error={errors.legalFloorNo}
          touched={touched.legalFloorNo}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realFloorNo}
          onChange={(value: number) =>
            handleChange({
              realFloorNo: value,
            })
          }
          error={errors.realFloorNo}
          touched={touched.realFloorNo}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Số phòng ngủ",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalNumberBedroom}
          onChange={(value: number) =>
            handleChange({ legalNumberBedroom: value })
          }
          error={errors.legalNumberBedroom}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realNumberBedroom}
          onChange={(value: number) =>
            handleChange({ realNumberBedroom: value })
          }
          error={errors.realNumberBedroom}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Số phòng WC",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalNumberToilets}
          onChange={(value: number) =>
            handleChange({ legalNumberToilets: value })
          }
          error={errors.legalNumberToilets}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realNumberToilets}
          onChange={(value: number) =>
            handleChange({ realNumberToilets: value })
          }
          error={errors.realNumberToilets}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Nội thất căn hộ",
      hspl: (
        <FormItem
          type={TEXT_AREA}
          value={data.legalFurniture}
          onChange={(e: any) =>
            handleChange({ legalFurniture: e.target.value })
          }
          error={errors.legalFurniture}
          touched={touched.legalFurniture}
          placeholder="Nhập"
          maxLength={1500}
        />
      ),
      real: (
        <FormItem
          type={TEXT_AREA}
          value={data.realFurniture}
          onChange={(e: any) => handleChange({ realFurniture: e.target.value })}
          error={errors.realFurniture}
          touched={touched.realFurniture}
          placeholder="Nhập"
          maxLength={1500}
        />
      ),
    },
    {
      type: "Số mặt thoáng",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalFacades}
          onChange={(value: number) => handleChange({ legalFacades: value })}
          error={errors.legalFacades}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realFacades}
          onChange={(value: number) => handleChange({ realFacades: value })}
          error={errors.realFacades}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Hướng ban công chính",
      hspl: (
        <FormItem
          type={INPUT}
          value={data.legalMainBalconyDirection}
          onChange={(e: any) =>
            handleChange({ legalMainBalconyDirection: e.target.value })
          }
          error={errors.legalMainBalconyDirection}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          type={INPUT}
          value={data.realMainBalconyDirection}
          onChange={(e: any) =>
            handleChange({ realMainBalconyDirection: e.target.value })
          }
          error={errors.realMainBalconyDirection}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Diện tích sử dụng riêng (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalPrivateUseArea}
          onChange={(value: number) =>
            handleChange({ legalPrivateUseArea: value })
          }
          error={errors.legalPrivateUseArea}
          touched={touched.legalPrivateUseArea}
          placeholder="Nhập"
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realPrivateUseArea}
          onChange={(value: number) => {
            handleChange({ realPrivateUseArea: value });
            updateListTab();
          }}
          error={errors.realPrivateUseArea}
          touched={touched.realPrivateUseArea}
          placeholder="Nhập"
          currencable
        />
      ),
    },
    {
      type: "Diện tích thông thuỷ (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalClearanceArea}
          onChange={(value: number) =>
            handleChange({ legalClearanceArea: value })
          }
          error={errors.legalClearanceArea}
          placeholder="Nhập"
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realClearanceArea}
          onChange={(value: number) =>
            handleChange({ realClearanceArea: value })
          }
          error={errors.realClearanceArea}
          placeholder="Nhập"
          currencable
        />
      ),
    },
    {
      type: "Diện tích tim tường (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalBuildupArea}
          onChange={(value: number) =>
            handleChange({ legalBuildupArea: value })
          }
          error={errors.legalBuildupArea}
          placeholder="Nhập"
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realBuildupArea}
          onChange={(value: number) => handleChange({ realBuildupArea: value })}
          error={errors.realBuildupArea}
          placeholder="Nhập"
          currencable
        />
      ),
    },
    {
      type: "Diện tích cơi nới (m²)",
      hspl: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.legalExtendArea}
          onChange={(value: number) => handleChange({ legalExtendArea: value })}
          error={errors.legalExtendArea}
          placeholder="Nhập"
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT_NUMBER}
          value={data.realExtendArea}
          onChange={(value: number) => handleChange({ realExtendArea: value })}
          error={errors.realExtendArea}
          placeholder="Nhập"
          currencable
        />
      ),
    },
    {
      type: "Hiện trạng sử dụng riêng",
      hspl: (
        <FormItem
          type={INPUT}
          value={data.legalCurrentPrivateUsing}
          onChange={(e: any) =>
            handleChange({ legalCurrentPrivateUsing: e.target.value })
          }
          error={errors.legalCurrentPrivateUsing}
          placeholder="Nhập"
          currencable
        />
      ),
      real: (
        <FormItem
          type={INPUT}
          value={data.realCurrentPrivateUsing}
          onChange={(e: any) =>
            handleChange({ realCurrentPrivateUsing: e.target.value })
          }
          error={errors.realCurrentPrivateUsing}
          placeholder="Nhập"
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
  FeatureTables,
  (prevProps, nextProps) =>
    isDeepEqual(prevProps.data, nextProps.data) &&
    isDeepEqual(prevProps.errors, nextProps.errors) &&
    isDeepEqual(prevProps.touched, nextProps.touched) &&
    prevProps.handleChange === nextProps.handleChange
);
