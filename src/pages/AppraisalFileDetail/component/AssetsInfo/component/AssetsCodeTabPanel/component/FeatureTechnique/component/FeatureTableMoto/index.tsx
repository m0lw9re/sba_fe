import Table, { ColumnsType } from "antd/es/table";
import { ArrowRightSVG } from "assets";
import FormItem from "components/InputFields/FormItem";
import renderRequired from "components/RenderRequire";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { AssetObjectRoadVehicleType } from "constant/types/appraisalFile";
import { useFormik } from "formik";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { isDeepEqual } from "utils";
import { useFuels, useManufactoringCountry } from "utils/request";
import { stringValidate } from "utils/validate";
import * as Yup from "yup";
const { INPUT, SELECT, INPUT_NUMBER, TEXT_AREA } = TYPE_FIELD;

type Props = {
  data: AssetObjectRoadVehicleType;
};

type RefProps = {
  onValidate: () => any;
};

const formSchema = Yup.object().shape({
  // ...commonVehicleFormSchema.fields,
  // máy móc ko required trường này
  // legalGearBoxId: Yup.string().nullable(),
  // realGearBoxId: Yup.string().nullable(),
  realVehicleBrand: Yup.string().required("Vui lòng chọn nhãn hiệu").nullable(),
  legalVehicleModel: stringValidate
    .max(255, "Chỉ nhập được 255 ký tự")
    .nullable(),
  realVehicleModel: stringValidate
    .required("Vui lòng nhập số loại/model")
    .max(255, "Chỉ nhập được 255 ký tự")
    .nullable(),
  legalColor: Yup.string().nullable(),
  realColor: Yup.string()
    .required("Vui lòng nhập màu sơn")
    .nullable(),
  legalYearMfg: Yup.number()
    .max(9999, "Chỉ nhập được 4 ký tự")
    .min(0, "Không được nhập số âm")
    .nullable(),
  realYearMfg: Yup.number()
    .required("Vui lòng nhập năm sản xuất")
    .max(9999, "Chỉ nhập được 4 ký tự")
    .min(0, "Không được nhập số âm")
    .nullable(),
  realCountryMfgId: Yup.string()
    .required("Vui lòng nhập nước sản xuất")
    .nullable(),
  // legalMaxOutputRpm: Yup.number().min(0, "Không được nhập số âm").nullable(),
  realFuelId: Yup.string().required("Vui lòng chọn loại nhiên liệu").nullable(),
  legalVehicleIdNumber: stringValidate
    .max(50, "Chỉ nhập được 50 ký tự")
    .nullable(),
  realVehicleIdNumber: stringValidate
    .required("Vui lòng nhập số khung")
    .max(50, "Chỉ nhập được 50 ký tự")
    .nullable(),
  legalEngineNumber: stringValidate
    .max(50, "Chỉ nhập được 50 ký tự")
    .nullable(),
  realEngineNumber: stringValidate
    .required("Vui lòng nhập số máy")
    .max(50, "Chỉ nhập được 50 ký tự")
    .nullable(),
  // realMaxOutputRpm: Yup.number().min(0, "Không được nhập số âm").nullable(),
  legalTankCapacity: Yup.number().min(0, "Không được nhập số âm").nullable(),
  realTankCapacity: Yup.number().min(0, "Không được nhập số âm").nullable(),
  legalAdditionalContent: Yup.string()
    .max(2000, "Chỉ được nhập 2000 ký tự")
    .nullable(),
  realAdditionalContent: Yup.string()
    .max(2000, "Chỉ được nhập 2000 ký tự")
    .nullable(),
  realPlateNumber: Yup.string().max(20, "Chỉ nhập được 20 ký tự").nullable().required("Vui lòng nhập biển số"),
});

const FeatureTableMoto = forwardRef<RefProps, Props>(({ data }, ref) => {
  const form = useFormik<AssetObjectRoadVehicleType>({
    initialValues: {} as AssetObjectRoadVehicleType,
    validateOnChange: true,
    validationSchema: formSchema,
    onSubmit: (data: any) => {
      return data;
    },
  });
  const handleChange = (data: any) => {
    form.setValues({ ...form.values, ...data });
  };

  const { data: manufactoringCountries } = useManufactoringCountry();
  const { data: fuels } = useFuels();
  const { roadVehicleBrandOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const handleCopyLegalToReal = () => {
    handleChange({
      realVehicleBrand: form.values.legalVehicleBrand,
      realVehicleModel: form.values.legalVehicleModel,
      realColor: form.values.legalColor,
      realYearMfg: form.values.legalYearMfg,
      realCountryMfgId: form.values.legalCountryMfgId,
      // realGearBoxId: form.values.legalGearBoxId,
      realWheelFormulaId: form.values.legalWheelFormulaId,
      realFuelId: form.values.legalFuelId,
      realVehicleIdNumber: form.values.legalVehicleIdNumber,
      realEngineNumber: form.values.legalEngineNumber,
      realPlateNumber: form.values.legalPlateNumber,
      realOverallDims: form.values.legalOverallDims,
      realWeightBase: form.values.legalWeightBase,
      realWeightAll: form.values.legalWeightAll,
      realWheelBase: form.values.legalWheelBase,
      realPersonCarry: form.values.legalPersonCarry,
      realEngineDisp: form.values.legalEngineDisp,
      realMaxOutputRpm: form.values.legalMaxOutputRpm,
      realInsideContainer: form.values.legalInsideContainer,
      realDesignTowedMass: form.values.legalDesignTowedMass,
      realTankCapacity: form.values.legalTankCapacity,
      realAdditionalContent: form.values.legalAdditionalContent,
    });
  };

  const { typeCreated } = useSelector(
    (state: RootState) => state.appraisalFileDetailSlice
  );

  const dataSource = [
    {
      type: renderRequired("Nhãn hiệu"),
      hspl: (
        <FormItem
          tabIndex={1}
          type={SELECT}
          value={form.values.legalVehicleBrand}
          error={form.errors.legalVehicleBrand}
          touched={form.touched.legalVehicleBrand}
          onChange={(value: string | number) => {
            handleChange({ legalVehicleBrand: value });
          }}
          options={roadVehicleBrandOptions}
          placeholder="Chọn"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={14}
          type={SELECT}
          value={form.values.realVehicleBrand}
          error={form.errors.realVehicleBrand}
          touched={form.touched.realVehicleBrand}
          onChange={(value: string | number) => {
            handleChange({ realVehicleBrand: value });
          }}
          options={roadVehicleBrandOptions}
        />
      ),
    },
    {
      type: renderRequired("Số loại/ Model"),
      hspl: (
        <FormItem
          tabIndex={2}
          type={INPUT}
          value={form.values.legalVehicleModel}
          error={form.errors.legalVehicleModel}
          touched={form.touched.legalVehicleModel}
          onChange={(e: any) =>
            handleChange({ legalVehicleModel: e.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={15}
          type={INPUT}
          value={form.values.realVehicleModel}
          error={form.errors.realVehicleModel}
          touched={form.touched.realVehicleModel}
          onChange={(e: any) =>
            handleChange({ realVehicleModel: e.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: renderRequired("Màu sơn"),
      hspl: (
        <FormItem
          tabIndex={3}
          type={INPUT}
          value={form.values.legalColor}
          error={form.errors.legalColor}
          touched={form.touched.legalColor}
          onChange={(e: any) => handleChange({ legalColor: e.target.value })}
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={16}
          type={INPUT}
          value={form.values.realColor}
          error={form.errors.realColor}
          touched={form.touched.realColor}
          onChange={(e: any) => handleChange({ realColor: e.target.value })}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: renderRequired("Năm sản xuất"),
      hspl: (
        <FormItem
          tabIndex={4}
          type={INPUT_NUMBER}
          value={form.values.legalYearMfg}
          error={form.errors.legalYearMfg}
          touched={form.touched.legalYearMfg}
          onChange={(value: number) => handleChange({ legalYearMfg: value })}
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={17}
          type={INPUT_NUMBER}
          value={form.values.realYearMfg}
          error={form.errors.realYearMfg}
          touched={form.touched.realYearMfg}
          onChange={(value: number) => handleChange({ realYearMfg: value })}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: renderRequired("Nước sản xuất"),
      hspl: (
        <FormItem
          tabIndex={5}
          type={SELECT}
          value={form.values.legalCountryMfgId}
          error={form.errors.legalCountryMfgId}
          touched={form.touched.legalCountryMfgId}
          onChange={(value: string | number) =>
            handleChange({ legalCountryMfgId: value })
          }
          disable={typeCreated === 1 ? true : false}
          options={
            manufactoringCountries?.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            }) || []
          }
          placeholder="Chọn"
        />
      ),
      real: (
        <FormItem
          tabIndex={18}
          type={SELECT}
          value={form.values.realCountryMfgId}
          error={form.errors.realCountryMfgId}
          touched={form.touched.realCountryMfgId}
          onChange={(value: string | number) =>
            handleChange({ realCountryMfgId: value })
          }
          options={
            manufactoringCountries?.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
              };
            }) || []
          }
          placeholder="Chọn"
        />
      ),
    },
    {
      type: renderRequired("Loại nhiên liệu"),
      hspl: (
        <FormItem
          tabIndex={6}
          type={SELECT}
          value={form.values.legalFuelId}
          error={form.errors.legalFuelId}
          touched={form.touched.legalFuelId}
          onChange={(value: string | number) =>
            handleChange({ legalFuelId: value })
          }
          options={fuels?.map((item: any) => {
            return {
              label: item.fuelName,
              value: item.fuelId,
            };
          })}
          disable={typeCreated === 1 ? true : false}
          placeholder="Chọn"
        />
      ),
      real: (
        <FormItem
          tabIndex={19}
          type={SELECT}
          value={form.values.realFuelId}
          error={form.errors.realFuelId}
          touched={form.touched.realFuelId}
          onChange={(value: string | number) =>
            handleChange({ realFuelId: value })
          }
          options={fuels?.map((item: any) => {
            return {
              label: item.fuelName,
              value: item.fuelId,
            };
          })}
          placeholder="Chọn"
        />
      ),
    },
    {
      type: renderRequired("Số khung"),
      hspl: (
        <FormItem
          tabIndex={7}
          type={INPUT}
          value={form.values.legalVehicleIdNumber}
          error={form.errors.legalVehicleIdNumber}
          touched={form.touched.legalVehicleIdNumber}
          onChange={(value: any) =>
            handleChange({ legalVehicleIdNumber: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={20}
          type={INPUT}
          value={form.values.realVehicleIdNumber}
          error={form.errors.realVehicleIdNumber}
          touched={form.touched.realVehicleIdNumber}
          onChange={(value: any) =>
            handleChange({ realVehicleIdNumber: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: renderRequired("Số máy"),
      hspl: (
        <FormItem
          tabIndex={8}
          type={INPUT}
          value={form.values.legalEngineNumber}
          error={form.errors.legalEngineNumber}
          touched={form.touched.legalEngineNumber}
          onChange={(value: any) =>
            handleChange({ legalEngineNumber: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={21}
          type={INPUT}
          value={form.values.realEngineNumber}
          error={form.errors.realEngineNumber}
          touched={form.touched.realEngineNumber}
          onChange={(value: any) =>
            handleChange({ realEngineNumber: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: renderRequired("Biển kiểm soát"),
      hspl: (
        <FormItem
          tabIndex={9}
          type={INPUT}
          value={form.values.legalPlateNumber}
          error={form.errors.legalPlateNumber}
          touched={form.touched.legalPlateNumber}
          onChange={(e: any) =>
            handleChange({ legalPlateNumber: e.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={22}
          type={INPUT}
          value={form.values.realPlateNumber}
          error={form.errors.realPlateNumber}
          touched={form.touched.realPlateNumber}
          onChange={(e: any) =>
            handleChange({ realPlateNumber: e.target.value })
          }
          require
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Số người cho phép chở",
      hspl: (
        <FormItem
          tabIndex={10}
          type={INPUT}
          value={form.values.legalPersonCarry}
          error={form.errors.legalPersonCarry}
          touched={form.touched.legalPersonCarry}
          onChange={(value: any) =>
            handleChange({ legalPersonCarry: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={23}
          type={INPUT}
          value={form.values.realPersonCarry}
          error={form.errors.realPersonCarry}
          touched={form.touched.realPersonCarry}
          onChange={(value: any) =>
            handleChange({ realPersonCarry: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Công suất (W)",
      hspl: (
        <FormItem
          tabIndex={11}
          type={INPUT}
          value={form.values.legalMaxOutputRpm}
          error={form.errors.legalMaxOutputRpm}
          touched={form.touched.legalMaxOutputRpm}
          currencable={true}
          onChange={(value: any) =>
            handleChange({ legalMaxOutputRpm: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={24}
          type={INPUT}
          value={form.values.realMaxOutputRpm}
          error={form.errors.realMaxOutputRpm}
          touched={form.touched.realMaxOutputRpm}
          currencable={true}
          onChange={(value: any) =>
            handleChange({ realMaxOutputRpm: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Dung tích (cc)",
      hspl: (
        <FormItem
          tabIndex={12}
          type={INPUT_NUMBER}
          value={form.values.legalEngineDisp}
          error={form.errors.legalEngineDisp}
          touched={form.touched.legalEngineDisp}
          onChange={(value: number) => handleChange({ legalEngineDisp: value })}
          currencable={true}
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={25}
          type={INPUT_NUMBER}
          value={form.values.realEngineDisp}
          error={form.errors.realEngineDisp}
          touched={form.touched.realEngineDisp}
          onChange={(value: number) => handleChange({ realEngineDisp: value })}
          currencable={true}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Nội dung khác",
      hspl: (
        <FormItem
          tabIndex={13}
          maxLength={2000}
          disable={typeCreated === 1 ? true : false}
          type={TEXT_AREA}
          value={form.values.legalAdditionalContent}
          error={form.errors.legalAdditionalContent}
          touched={form.touched.legalAdditionalContent}
          onChange={(e: any) => {
            handleChange({ legalAdditionalContent: e.target.value });
          }}
        />
      ),
      real: (
        <FormItem
          tabIndex={26}
          maxLength={2000}
          type={TEXT_AREA}
          value={form.values.realAdditionalContent}
          error={form.errors.realAdditionalContent}
          touched={form.touched.realAdditionalContent}
          onChange={(e: any) => {
            handleChange({ realAdditionalContent: e.target.value });
          }}
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

  useImperativeHandle(ref, () => ({
    onValidate: async () => {
      return form.submitForm();
    },
  }));

  useEffect(() => {
    if (data) {
      form.setValues({
        ...form.values,
        ...data,
      });
    }
  }, []);

  return (
    <Table
      size="small"
      bordered
      scroll={{ x: true }}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      className="feature-technique-table"
    />
  );
});
export default memo(FeatureTableMoto, (prevProps, nextProps) =>
  isDeepEqual(prevProps.data, nextProps.data)
);
