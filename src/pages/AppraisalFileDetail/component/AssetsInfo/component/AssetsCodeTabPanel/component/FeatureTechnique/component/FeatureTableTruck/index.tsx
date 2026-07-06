import Table, { ColumnsType } from "antd/es/table";
import { ArrowRightSVG } from "assets";
import FormItem from "components/InputFields/FormItem";
import renderRequire from "components/RenderRequire";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { AssetObjectRoadVehicleType } from "constant/types/appraisalFile";
import { useFormik } from "formik";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { isDeepEqual } from "utils";
import {
  useFuels,
  useGearBox,
  useManufactoringCountry,
  useWheelFormulas,
} from "utils/request";
import { validateLengthAndWhiteSpace } from "utils/validate";
import * as Yup from "yup";
import { commonVehicleFormSchema } from "../FeatureTechniqueTab/config";
import renderRequired from "components/RenderRequire";

const { INPUT, SELECT, INPUT_NUMBER, TEXT_AREA } = TYPE_FIELD;

type Props = {
  data: AssetObjectRoadVehicleType;
};

type RefProps = {
  onValidate: () => any;
};

const formSchema = Yup.object().shape({
  ...commonVehicleFormSchema.fields,

  // legalVehicleTrunkSize: validateLengthAndWhiteSpace(
  //   // 'Vui lòng nhập kích thước lòng thùng xe',
  //   25
  // ),
  // realVehicleTrunkSize: validateLengthAndWhiteSpace(
  //   // 'Vui lòng nhập kích thước lòng thùng xe',
  //   25
  // ),

  // legalVolumeOfGoodsTransported: validateLengthAndWhiteSpace(
  //   // 'Vui lòng nhập hàng chuyên chở theo TK/CP TGGT',
  //   25
  // ),
  // realVolumeOfGoodsTransported: validateLengthAndWhiteSpace(
  //   // 'Vui lòng nhập hàng chuyên chở theo TK/CP TGGT',
  //   25
  // ),
});

const FeatureTableTruck = forwardRef<RefProps, Props>(({ data }, ref) => {
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
  const { data: wheelFormulas } = useWheelFormulas();
  const { data: gearBoxs } = useGearBox();
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
      realGearBoxId: form.values.legalGearBoxId,
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
      realNumberOfTires: form.values.legalNumberOfTires,
      realVehicleTrunkSize: form.values.legalVehicleTrunkSize,
      realVolumeOfGoodsTransported: form.values.legalVolumeOfGoodsTransported,
      realVolumeOfTowedGoods: form.values.legalVolumeOfTowedGoods,
      realAdditionalContent: form.values.legalAdditionalContent,
    });
  };

  const { typeCreated } = useSelector(
    (state: RootState) => state.appraisalFileDetailSlice
  );

  const dataSource = [
    {
      type: renderRequire("Nhãn hiệu"),
      hspl: (
        <FormItem
          tabIndex={1}
          type={SELECT}
          value={form.values.legalVehicleBrand}
          error={form.errors.legalVehicleBrand}
          touched={form.touched.legalVehicleBrand}
          onChange={(value: number) => {
            handleChange({ legalVehicleBrand: value });
          }}
          disable={typeCreated === 1 ? true : false}
          placeholder="Chọn"
          options={roadVehicleBrandOptions}
        />
      ),
      real: (
        <FormItem
          tabIndex={25}
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
      type: renderRequire("Số loại/ Model"),
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
          disable={typeCreated === 1 ? true : false}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          tabIndex={26}
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
      type: renderRequire("Màu sơn"),
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
          tabIndex={27}
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
      type: renderRequire("Năm sản xuất"),
      hspl: (
        <FormItem
          tabIndex={4}
          type={INPUT_NUMBER}
          value={form.values.legalYearMfg}
          error={form.errors.legalYearMfg}
          touched={form.touched.legalYearMfg}
          onChange={(value: any) => {
            handleChange({ legalYearMfg: value });
          }}
          disable={typeCreated === 1 ? true : false}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          tabIndex={28}
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
      type: renderRequire("Nước sản xuất"),
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
          tabIndex={29}
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
      type: renderRequire("Hộp số"),
      hspl: (
        <FormItem
          tabIndex={6}
          type={SELECT}
          value={form.values.legalGearBoxId}
          error={form.errors.legalGearBoxId}
          touched={form.touched.legalGearBoxId}
          onChange={(value: string | number) => {
            handleChange({ legalGearBoxId: value });
          }}
          disable={typeCreated === 1 ? true : false}
          options={gearBoxs?.map((item: any) => {
            return {
              label: item.gearBoxName,
              value: item.gearBoxId,
            };
          })}
          placeholder="Chọn"
        />
      ),
      real: (
        <FormItem
          tabIndex={30}
          type={SELECT}
          value={form.values.realGearBoxId}
          error={form.errors.realGearBoxId}
          touched={form.touched.realGearBoxId}
          onChange={(value: string | number) =>
            handleChange({ realGearBoxId: value })
          }
          options={gearBoxs?.map((item: any) => {
            return {
              label: item.gearBoxName,
              value: item.gearBoxId,
            };
          })}
          placeholder="Chọn"
        />
      ),
    },
    {
      type: "Công thức bánh xe",
      hspl: (
        <FormItem
          tabIndex={7}
          type={SELECT}
          value={form.values.legalWheelFormulaId}
          onChange={(value: string | number) =>
            handleChange({ legalWheelFormulaId: value })
          }
          disable={typeCreated === 1 ? true : false}
          options={wheelFormulas?.map((item: any) => {
            return {
              value: item.wheelFormulaId,
              label: item.wheelFormulaName,
            };
          })}
          placeholder="Chọn"
        />
      ),
      real: (
        <FormItem
          tabIndex={31}
          type={SELECT}
          value={form.values.realWheelFormulaId}
          onChange={(value: string | number) =>
            handleChange({ realWheelFormulaId: value })
          }
          options={wheelFormulas?.map((item: any) => {
            return {
              value: item.wheelFormulaId,
              label: item.wheelFormulaName,
            };
          })}
          placeholder="Chọn"
        />
      ),
    },
    {
      type: renderRequire("Loại nhiên liệu"),
      hspl: (
        <FormItem
          tabIndex={8}
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
          tabIndex={32}
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
      type: renderRequire("Số khung"),
      hspl: (
        <FormItem
          tabIndex={9}
          type={INPUT}
          value={form.values.legalVehicleIdNumber}
          error={form.errors.legalVehicleIdNumber}
          touched={form.touched.legalVehicleIdNumber}
          onChange={(value: any) =>
            handleChange({ legalVehicleIdNumber: value.target.value })
          }
          disable={typeCreated === 1 ? true : false}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          tabIndex={33}
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
      type: renderRequire("Số máy"),
      hspl: (
        <FormItem
          tabIndex={10}
          type={INPUT}
          value={form.values.legalEngineNumber}
          error={form.errors.legalEngineNumber}
          touched={form.touched.legalEngineNumber}
          onChange={(value: any) =>
            handleChange({ legalEngineNumber: value.target.value })
          }
          disable={typeCreated === 1 ? true : false}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          tabIndex={34}
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
          tabIndex={11}
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
          tabIndex={35}
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
      type: "Kích thước bao (mm)",
      hspl: (
        <FormItem
          tabIndex={12}
          type={INPUT}
          value={form.values.legalOverallDims}
          error={form.errors.legalOverallDims}
          touched={form.touched.legalOverallDims}
          onChange={(value: any) =>
            handleChange({ legalOverallDims: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={36}
          type={INPUT}
          value={form.values.realOverallDims}
          error={form.errors.realOverallDims}
          touched={form.touched.realOverallDims}
          onChange={(value: any) =>
            handleChange({ realOverallDims: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Khối lượng bản thân (kg)",
      hspl: (
        <FormItem
          tabIndex={13}
          type={INPUT_NUMBER}
          value={form.values.legalWeightBase}
          error={form.errors.legalWeightBase}
          touched={form.touched.legalWeightBase}
          onChange={(value: number) => handleChange({ legalWeightBase: value })}
          placeholder="Nhập"
          currencable={true}
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={37}
          type={INPUT_NUMBER}
          value={form.values.realWeightBase}
          error={form.errors.realWeightBase}
          touched={form.touched.realWeightBase}
          onChange={(value: number) => handleChange({ realWeightBase: value })}
          placeholder="Nhập"
          currencable={true}
        />
      ),
    },
    {
      type: "Khối lượng toàn bộ theo TK /CP TGGT (kg)",
      hspl: (
        <FormItem
          tabIndex={14}
          type={INPUT}
          value={form.values.legalWeightAll}
          error={form.errors.legalWeightAll}
          touched={form.touched.legalWeightAll}
          onChange={(value: any) =>
            handleChange({ legalWeightAll: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={38}
          type={INPUT}
          value={form.values.realWeightAll}
          error={form.errors.realWeightAll}
          touched={form.touched.realWeightAll}
          onChange={(value: any) =>
            handleChange({ realWeightAll: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Chiều dài cơ sở (mm)",
      hspl: (
        <FormItem
          tabIndex={15}
          type={INPUT}
          value={form.values.legalWheelBase}
          error={form.errors.legalWheelBase}
          touched={form.touched.legalWheelBase}
          onChange={(e: any) =>
            handleChange({ legalWheelBase: e.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={39}
          type={INPUT}
          value={form.values.realWheelBase}
          error={form.errors.realWheelBase}
          touched={form.touched.realWheelBase}
          onChange={(e: any) => handleChange({ realWheelBase: e.target.value })}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Số người cho phép chở",
      hspl: (
        <FormItem
          tabIndex={16}
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
          tabIndex={40}
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
      type: "Thể tích làm việc của động cơ (cc)",
      hspl: (
        <FormItem
          tabIndex={17}
          type={INPUT_NUMBER}
          value={form.values.legalEngineDisp}
          error={form.errors.legalEngineDisp}
          touched={form.touched.legalEngineDisp}
          currencable={true}
          onChange={(value: number) => handleChange({ legalEngineDisp: value })}
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={41}
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
      type: "Công suất lớn nhất / tốc độ quay (kW/vph)",
      hspl: (
        <FormItem
          tabIndex={18}
          type={INPUT}
          value={form.values.legalMaxOutputRpm}
          error={form.errors.legalMaxOutputRpm}
          touched={form.touched.legalMaxOutputRpm}
          onChange={(value: any) =>
            handleChange({ legalMaxOutputRpm: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={42}
          type={INPUT}
          value={form.values.realMaxOutputRpm}
          error={form.errors.realMaxOutputRpm}
          touched={form.touched.realMaxOutputRpm}
          onChange={(value: any) =>
            handleChange({ realMaxOutputRpm: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Số lượng lốp/cỡ lốp",
      hspl: (
        <FormItem
          tabIndex={19}
          type={INPUT}
          value={form.values.legalNumberOfTires}
          error={form.errors.legalNumberOfTires}
          touched={form.touched.legalNumberOfTires}
          onChange={(value: any) =>
            handleChange({ legalNumberOfTires: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={43}
          type={INPUT}
          value={form.values.realNumberOfTires}
          error={form.errors.realNumberOfTires}
          touched={form.touched.realNumberOfTires}
          onChange={(value: any) =>
            handleChange({ realNumberOfTires: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Kích thước lòng thùng xe (mm)",
      hspl: (
        <FormItem
          tabIndex={20}
          type={INPUT}
          value={form.values.legalVehicleTrunkSize}
          onChange={(value: any) =>
            handleChange({ legalVehicleTrunkSize: value.target.value })
          }
          disable={typeCreated === 1 ? true : false}
          // error={form.errors.legalVehicleTrunkSize}
          // touched={form.touched.legalVehicleTrunkSize}
          placeholder="Nhập"
        />
      ),
      real: (
        <FormItem
          tabIndex={44}
          type={INPUT}
          value={form.values.realVehicleTrunkSize}
          onChange={(value: any) =>
            handleChange({ realVehicleTrunkSize: value.target.value })
          }
          // error={form.errors.realVehicleTrunkSize}
          // touched={form.touched.realVehicleTrunkSize}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Khối lượng hàng chuyên chở theo TK/CP TGGT (kg)",
      hspl: (
        <FormItem
          tabIndex={21}
          type={INPUT}
          value={form.values.legalVolumeOfGoodsTransported}
          onChange={(value: any) =>
            handleChange({ legalVolumeOfGoodsTransported: value.target.value })
          }
          placeholder="Nhập"
          // error={form.errors.legalVolumeOfGoodsTransported}
          // touched={form.touched.legalVolumeOfGoodsTransported}
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={45}
          type={INPUT}
          value={form.values.realVolumeOfGoodsTransported}
          onChange={(value: any) =>
            handleChange({ realVolumeOfGoodsTransported: value.target.value })
          }
          // error={form.errors.realVolumeOfGoodsTransported}
          // touched={form.touched.realVolumeOfGoodsTransported}
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Khối lượng hàng chuyên kéo theo TK/CP TGGT (kg)",
      hspl: (
        <FormItem
          tabIndex={22}
          type={INPUT}
          value={form.values.legalVolumeOfTowedGoods}
          // error={form.errors.legalVolumeOfTowedGoods}
          // touched={form.touched.legalVolumeOfTowedGoods}
          onChange={(value: any) =>
            handleChange({ legalVolumeOfTowedGoods: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={46}
          type={INPUT}
          value={form.values.realVolumeOfTowedGoods}
          // error={form.errors.realVolumeOfTowedGoods}
          // touched={form.touched.realVolumeOfTowedGoods}
          onChange={(value: any) =>
            handleChange({ realVolumeOfTowedGoods: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Dung tích bồn (gallons/lit)",
      hspl: (
        <FormItem
          tabIndex={23}
          type={INPUT}
          value={form.values.legalTankCapacity}
          error={form.errors.legalTankCapacity}
          touched={form.touched.legalTankCapacity}
          onChange={(value: any) =>
            handleChange({ legalTankCapacity: value.target.value })
          }
          placeholder="Nhập"
          disable={typeCreated === 1 ? true : false}
        />
      ),
      real: (
        <FormItem
          tabIndex={47}
          type={INPUT}
          value={form.values.realTankCapacity}
          error={form.errors.realTankCapacity}
          touched={form.touched.realTankCapacity}
          onChange={(value: any) =>
            handleChange({ realTankCapacity: value.target.value })
          }
          placeholder="Nhập"
        />
      ),
    },
    {
      type: "Nội dung khác",
      hspl: (
        <FormItem
          tabIndex={24}
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
          tabIndex={48}
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
export default memo(FeatureTableTruck, (prevProps, nextProps) =>
  isDeepEqual(prevProps.data, nextProps.data)
);
