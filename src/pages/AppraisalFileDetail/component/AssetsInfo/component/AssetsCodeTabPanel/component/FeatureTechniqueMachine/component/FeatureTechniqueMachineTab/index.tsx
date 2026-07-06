import "./style.scss";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { ArrowRightSVG } from "assets";
import { TYPE_FIELD } from "constant/enums";
import FormItem from "components/InputFields/FormItem";
import { AssetMachineDeviceInforType } from "constant/types/appraisalFile";
import { useFormik } from "formik";
import "./style.scss";
import * as Yup from "yup";
import { isDeepEqual } from "utils";
import { reTypeEmptyString2NullObj, validLengthInput } from "utils/validate";
import { RequireLabel } from "components/Requiredlabel";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
const { INPUT, SELECT, INPUT_NUMBER, TEXT_AREA } = TYPE_FIELD;

type Props = {
  data: AssetMachineDeviceInforType;
};
type RefProps = {
  btnRefUpdateFeatureMachineDeviceItem: () => void;
};

const formSchema = Yup.object().shape({
  realName: Yup.string()
    .required("Vui lòng nhập tên MMTB")
    .typeError("Vui lòng nhập tên MMTB")
    .test("readName", "Chỉ được nhập 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  realBrand: Yup.string()
    .nullable()
    .typeError("Vui lòng nhập nhãn hiệu")
    .test("realBrand", "Chỉ được nhập 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  realModel: Yup.string()
    .required("Vui lòng nhập số loại/Model")
    .typeError("Vui lòng nhập số loại/Model")
    .test("realModel", "Chỉ được nhập 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  // realColor: Yup.string()
  //   .required("Vui lòng nhập màu sơn")
  //   .typeError("Vui lòng nhập màu sơn"),
  realYearMfg: Yup.number()
    .required("Vui lòng nhập năm sản xuất")
    .typeError("Vui lòng nhập năm sản xuất")
    .test("realYearMfg", "Chỉ được nhập 4 ký tự", (val) =>
      validLengthInput(val, 4)
    ),
  realCountryMfgId: Yup.number()
    .required("Vui lòng chọn nước sản xuất")
    .typeError("Vui lòng chọn nước sản xuất"),
  realMfr: Yup.string()
    .nullable()
    .typeError("Vui lòng nhập nhà sản xuất")
    .test("realMfr", "Chỉ được nhập 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  realPower: Yup.number()
    .nullable()
    .typeError("Vui lòng nhập công suất chỉ là số")
    .test("realPower", "Số quá lớn", (val) => validLengthInput(val, 16)),
  realControlType: Yup.string()
    .nullable()
    .typeError("Vui lòng nhập chế độ điều khiển")
    .test("realControlType", "Chỉ được nhập 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
  legalCommonMachine: Yup.string()
    .nullable()
    .test("legalCommonMachine", "Chỉ được nhập 25 ký tự", (val) =>
      validLengthInput(val, 25)
    )
    .test(
      "noDecimalNumbers",
      "Không cho phép nhập số thập phân",
      (val) => val == null || !/^\d*[\.,]\d+$/.test(val)
    ),
  realCommonMachine: Yup.string()
    .nullable()
    .test("realCommonMachine", "Chỉ được nhập 25 ký tự", (val) =>
      validLengthInput(val, 25)
    )
    .test(
      "noDecimalNumbers",
      "Không cho phép nhập số thập phân",
      (val) => val == null || !/^\d*[\.,]\d+$/.test(val)
    )
    .required("Vui lòng nhập số lượng máy móc")
    .typeError("Vui lòng nhập số lượng máy móc"),
  // legalEngineNo: Yup.string()
  //   .nullable()
  //   .required("Vui lòng nhập số máy")
  //   .test("legalEngineNo", "Chỉ được nhập 255 ký tự", (val) =>
  //     validLengthInput(val, 255)
  //   ),
  realEngineNo: Yup.string()
    .nullable()
    .required("Vui lòng nhập số máy")
    .test("realEngineNo", "Chỉ được nhập 255 ký tự", (val) =>
      validLengthInput(val, 255)
    ),
});

const FeatureTechniqueMachineTab = forwardRef<RefProps, Props>(
  ({ data }, ref) => {
    const { typeCreated } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );

    const form = useFormik({
      initialValues: {} as AssetMachineDeviceInforType | any,
      validationSchema: formSchema,
      validateOnChange: true,
      onSubmit: async (data: AssetMachineDeviceInforType) => {
        return data;
      },
    });

    const { manufacturingCountryOptions } = useSelector(
      (state: RootState) => state.globalSlice
    );

    const handleChange = (data: any) => {
      const _data = reTypeEmptyString2NullObj(data);
      form.setValues({ ...form.values, ..._data });
    };

    useEffect(() => {
      if (data) {
        form.setValues({
          ...form.values,
          ...data,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleCopyLegalToReal = () => {
      form.setValues({
        ...form.values,
        realName: form.values.legalName,
        realBrand: form.values.legalBrand,
        realModel: form.values.legalModel,
        realColor: form.values.legalColor,
        realYearMfg: form.values.legalYearMfg,
        realCountryMfgId: form.values.legalCountryMfgId,
        realMfr: form.values.legalMfr,
        realPower: form.values.legalPower,
        realControlType: form.values.legalControlType,
        realSize: form.values.legalSize,
        realSpecs: form.values.legalSpecs,
        realEngine: form.values.legalEngine,
        realElectricEngine: form.values.legalElectricEngine,
        realMainEngine: form.values.legalMainEngine,
        realEngineSystem: form.values.legalEngineSystem,
        realCommonMachine: form.values.legalCommonMachine,
        realOtherContent: form.values.legalOtherContent,
        realEngineNo: form.values.legalEngineNo,
      });
    };

    useImperativeHandle(ref, () => ({
      btnRefUpdateFeatureMachineDeviceItem: async () => {
        const featureData: any = await form.submitForm();

        const errors = {
          ...form.errors,
        };
        const validate = JSON.stringify(errors) === "{}" ? false : errors;

        return [{ ...featureData }, validate];
      },
    }));

    const dataSource = [
      {
        type: <RequireLabel label="Tên MMTB" />,
        hspl: (
          <FormItem
            tabIndex={1}
            type={INPUT}
            value={form.values.legalName}
            onChange={(e: any) => {
              handleChange({ legalName: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={17}
            type={INPUT}
            error={form.errors.realName}
            touched={form.touched.realName}
            value={form.values.realName}
            onChange={(e: any) => {
              handleChange({ realName: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Nhãn hiệu" required={false} />,
        hspl: (
          <FormItem
            tabIndex={2}
            type={INPUT}
            value={form.values.legalBrand}
            onChange={(e: any) => {
              handleChange({ legalBrand: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={18}
            type={INPUT}
            value={form.values.realBrand}
            error={form.errors.realBrand}
            touched={form.touched.realBrand}
            onChange={(e: any) => {
              handleChange({ realBrand: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Số loại/ Model" />,
        hspl: (
          <FormItem
            tabIndex={4}
            type={INPUT}
            value={form.values.legalModel}
            onChange={(e: any) => {
              handleChange({ legalModel: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={20}
            type={INPUT}
            value={form.values.realModel}
            error={form.errors.realModel}
            touched={form.touched.realModel}
            onChange={(e: any) => {
              handleChange({ realModel: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Số máy" />,
        hspl: (
          <FormItem
            tabIndex={3}
            type={INPUT}
            value={form.values.legalEngineNo}
            // error={form.errors.legalEngineNo}
            // touched={form.touched.legalEngineNo}
            onChange={(e: any) => {
              handleChange({ legalEngineNo: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={19}
            type={INPUT}
            value={form.values.realEngineNo}
            error={form.errors.realEngineNo}
            touched={form.touched.realEngineNo}
            onChange={(e: any) => {
              handleChange({ realEngineNo: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      // {
      //   type: <RequireLabel label="Màu sơn" />,
      //   hspl: (
      //     <FormItem
      //       type={INPUT}
      //       value={form.values.legalColor}
      //       onChange={(e: any) => {
      //         handleChange({ legalColor: e.target.value });
      //       }}
      //       placeholder="Nhập"
      //     />
      //   ),
      //   real: (
      //     <FormItem
      //       type={INPUT}
      //       value={form.values.realColor}
      //       error={form.errors.realColor}
      //       touched={form.touched.realColor}
      //       onChange={(e: any) => {
      //         handleChange({ realColor: e.target.value });
      //       }}
      //       placeholder="Nhập"
      //     />
      //   ),
      // },
      {
        type: <RequireLabel label="Năm sản xuất" />,
        hspl: (
          <FormItem
            tabIndex={5}
            type={INPUT_NUMBER}
            min={1000}
            max={9999}
            value={form.values.legalYearMfg}
            onChange={(value: number) => {
              handleChange({ legalYearMfg: value || null });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={21}
            type={INPUT_NUMBER}
            min={1000}
            value={form.values.realYearMfg}
            error={form.errors.realYearMfg}
            touched={form.touched.realYearMfg}
            onChange={(value: number) => {
              handleChange({ realYearMfg: value || null });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Nước sản xuất" />,
        hspl: (
          <FormItem
            tabIndex={6}
            type={SELECT}
            value={form.values.legalCountryMfgId}
            onChange={(value: number) => {
              handleChange({ legalCountryMfgId: value });
            }}
            options={manufacturingCountryOptions}
            placeholder="Chọn"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={22}
            type={SELECT}
            value={form.values.realCountryMfgId}
            error={form.errors.realCountryMfgId}
            touched={form.touched.realCountryMfgId}
            onChange={(value: number) => {
              handleChange({ realCountryMfgId: value });
            }}
            options={manufacturingCountryOptions}
            placeholder="Chọn"
          />
        ),
      },
      {
        type: <RequireLabel label="Nhà sản xuất" required={false} />,
        hspl: (
          <FormItem
            tabIndex={7}
            type={INPUT}
            value={form.values.legalMfr}
            onChange={(e: any) => {
              handleChange({ legalMfr: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={23}
            type={INPUT}
            value={form.values.realMfr}
            error={form.errors.realMfr}
            touched={form.touched.realMfr}
            onChange={(e: any) => {
              handleChange({ realMfr: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Công suất (kW)" required={false} />,
        hspl: (
          <FormItem
            tabIndex={8}
            type={INPUT_NUMBER}
            value={form.values.legalPower}
            currencable={true}
            onChange={(val: number) => {
              handleChange({ legalPower: val });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={24}
            type={INPUT_NUMBER}
            value={form.values.realPower}
            error={form.errors.realPower}
            touched={form.touched.realPower}
            currencable={true}
            onChange={(val: number) => {
              handleChange({ realPower: val });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Chế độ điều khiển" required={false} />,
        hspl: (
          <FormItem
            tabIndex={9}
            type={INPUT}
            value={form.values.legalControlType}
            onChange={(e: any) => {
              handleChange({ legalControlType: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={25}
            type={INPUT}
            value={form.values.realControlType}
            error={form.errors.realControlType}
            touched={form.touched.realControlType}
            onChange={(e: any) => {
              handleChange({ realControlType: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Kích thước (mm)" required={false} />,
        hspl: (
          <FormItem
            tabIndex={10}
            type={INPUT}
            value={form.values.legalSize}
            currencable={true}
            onChange={(e: any) => {
              handleChange({ legalSize: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={26}
            type={INPUT}
            value={form.values.realSize}
            currencable={true}
            onChange={(e: any) => {
              handleChange({ realSize: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Thông số kỹ thuật" required={false} />,
        hspl: (
          <FormItem
            tabIndex={11}
            type={INPUT}
            value={form.values.legalSpecs}
            onChange={(e: any) => {
              handleChange({ legalSpecs: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={27}
            type={INPUT}
            value={form.values.realSpecs}
            onChange={(e: any) => {
              handleChange({ realSpecs: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      // {
      //   type: <RequireLabel label="Động cơ (kW)" required={false} />,
      //   hspl: (
      //     <FormItem
      //       tabIndex={11}
      //       type={INPUT_NUMBER}
      //       value={form.values.legalEngine}
      //       currencable={true}
      //       onChange={(value: number) => {
      //         handleChange({ legalEngine: value });
      //       }}
      //       placeholder="Nhập"
      //       disable={typeCreated === 1}
      //     />
      //   ),
      //   real: (
      //     <FormItem
      //       tabIndex={27}
      //       type={INPUT_NUMBER}
      //       value={form.values.realEngine}
      //       currencable={true}
      //       onChange={(value: number) => {
      //         handleChange({ realEngine: value });
      //       }}
      //       placeholder="Nhập"
      //     />
      //   ),
      // },
      {
        type: <RequireLabel label="Động cơ điện (kW)" required={false} />,
        hspl: (
          <FormItem
            tabIndex={12}
            type={INPUT}
            currencable={true}
            value={form.values.legalElectricEngine}
            onChange={(e: any) => {
              handleChange({ legalElectricEngine: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={28}
            type={INPUT}
            currencable={true}
            value={form.values.realElectricEngine}
            onChange={(e: any) => {
              handleChange({ realElectricEngine: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Động cơ chính (kW)" required={false} />,
        hspl: (
          <FormItem
            tabIndex={13}
            type={INPUT}
            currencable={true}
            value={form.values.legalMainEngine}
            onChange={(e: any) => {
              handleChange({ legalMainEngine: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={29}
            type={INPUT}
            currencable={true}
            value={form.values.realMainEngine}
            onChange={(e: any) => {
              handleChange({ realMainEngine: e.target.value });
            }}
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Hệ thống thiết bị điện" required={false} />,
        hspl: (
          <FormItem
            tabIndex={14}
            type={INPUT}
            value={form.values.legalEngineSystem}
            onChange={(e: any) => {
              handleChange({ legalEngineSystem: e.target.value });
            }}
            placeholder="Nhập"
            disable={typeCreated === 1}
            maxLength={500}
          />
        ),
        real: (
          <FormItem
            tabIndex={30}
            type={INPUT}
            value={form.values.realEngineSystem}
            onChange={(e: any) => {
              handleChange({ realEngineSystem: e.target.value });
            }}
            placeholder="Nhập"
            maxLength={500}
          />
        ),
      },
      {
        type: (
          <RequireLabel label="Số lượng máy móc thiết bị" required={true} />
        ),
        hspl: (
          <FormItem
            tabIndex={15}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.legalCommonMachine}
            error={form.errors.legalCommonMachine}
            touched={form.touched.legalCommonMachine}
            onChange={(value: number) =>
              handleChange({ legalCommonMachine: value })
            }
            placeholder="Nhập"
            disable={typeCreated === 1}
          />
        ),
        real: (
          <FormItem
            tabIndex={31}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realCommonMachine}
            error={form.errors.realCommonMachine}
            touched={form.touched.realCommonMachine}
            onChange={(value: number) =>
              handleChange({ realCommonMachine: value })
            }
            placeholder="Nhập"
          />
        ),
      },
      {
        type: <RequireLabel label="Nội dung khác" required={false} />,
        hspl: (
          <FormItem
            tabIndex={16}
            type={TEXT_AREA}
            rows={3}
            value={form.values.legalOtherContent}
            onChange={(e: any) =>
              handleChange({ legalOtherContent: e.target.value })
            }
            placeholder="Nhập"
            disable={typeCreated === 1}
            maxLength={1000}
          />
        ),
        real: (
          <FormItem
            tabIndex={32}
            type={TEXT_AREA}
            rows={3}
            value={form.values.realOtherContent}
            onChange={(e: any) =>
              handleChange({ realOtherContent: e.target.value })
            }
            placeholder="Nhập"
            maxLength={1000}
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
        className="feature-technique-table-container"
        bordered
        scroll={{ x: true }}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        style={{ marginBottom: "8px" }}
      />
    );
  }
);

export default memo(FeatureTechniqueMachineTab, (prevProps, nextProps) =>
  isDeepEqual(prevProps.data, nextProps.data)
);
