import { useFormik } from "formik";
import { useEffect, useImperativeHandle, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { forwardRef } from "react";
import { RootState } from "configs/configureStore";
import * as Yup from "yup";
import { ArrowRightSVG } from "assets";
import { TYPE_FIELD } from "constant/enums";
import FormItem from "components/InputFields/FormItem";
import { Table } from "antd";
import "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTabPanel/component/FeatureWaterVehicle/style.scss";
import { useAddressProvince, useManufactoringCountry } from "utils/request";
import { AssetObjectWaterVehicleType } from "constant/types";
import { useSelector } from "react-redux";
import { RequireLabel } from "components/Requiredlabel";
import { validLengthInput } from "utils/validate";
import { getSchemaValidate } from "./config";

const { INPUT, SELECT, INPUT_NUMBER, TEXT_AREA } = TYPE_FIELD;

type Props = {
  assetWaterVehicleInfor: AssetObjectWaterVehicleType;
};

type RefProps = {
  updateFeatureWaterVehicle: () => void;
};

const FeatureWaterVehicle = forwardRef<RefProps, Props>(
  ({ assetWaterVehicleInfor }, ref) => {
    // Kiểm tra thực tế, có được sản xuất ở VN hay không
    const [isProduceInVietNam, setIsProduceInVietNam] =
      useState<boolean>(false);

    const form = useFormik({
      initialValues: {} as any,
      validateOnChange: true,
      validationSchema: getSchemaValidate(isProduceInVietNam),
      onSubmit: (data) => {
        return data;
      },
    });

    useEffect(() => {
      if (form.values.realCountryMfg === vietNamId) {
        setIsProduceInVietNam(true);
      } else {
        form.setFieldError("realManufacturingLocation", "");
        form.setFieldTouched("realManufacturingLocation", false);
        setIsProduceInVietNam(false);
      }
    }, [form.values.realCountryMfg]);

    const { typeCreated } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice
    );

    const vietNamId = 232;

    const disableLegalValue = typeCreated === 1 ? true : false;

    const { data: manufactoringCountries, isLoading } =
      useManufactoringCountry();

    const { data: provinces, isLoading: isLoadingGetProvinces } =
      useAddressProvince();

    const { waterVehicleBrandOptions } = useSelector(
      (state: RootState) => state.globalSlice
    );

    const handleChange = (data: any) => {
      form.setValues({ ...form.values, ...data });
    };

    const handleChangeVietNam = (newValues: any) => {
      // Copy the current form values
      const updatedValues = { ...form.values, ...newValues };
    
      // Clear legalManufacturingLocation if legalCountryMfg changes and it's not Vietnam
      if (newValues.legalCountryMfg !== undefined && newValues.legalCountryMfg !== vietNamId) {
        updatedValues.legalManufacturingLocation = null;
      }
    
      // Clear realManufacturingLocation if realCountryMfg changes and it's not Vietnam
      if (newValues.realCountryMfg !== undefined && newValues.realCountryMfg !== vietNamId) {
        updatedValues.realManufacturingLocation = null;
      }
    
      // Call the original handleChange function with the updated values
      form.setValues(updatedValues);
    };

    const handleCopyLegalToReal = () => {
      form.setValues({
        ...form.values,
        realBoardHeight: form.values.legalBoardHeight,
        realBrand: form.values.legalBrand,
        realCountryMfg: form.values.legalCountryMfg,
        realDeadWeight: form.values.legalDeadWeight,
        realDesignLength: form.values.legalDesignLength,
        realFreeBoard: form.values.legalFreeBoard,
        realGrossTonnage: form.values.legalGrossTonnage,
        realDesignWidth: form.values.legalDesignWidth,
        realImoNumber: form.values.legalImoNumber,
        realMachineNum: form.values.legalMachineNum,
        realMaxLength: form.values.legalMaxLength,
        realMachinePower: form.values.legalMachinePower,
        realModel: form.values.legalModel,
        realUseTonnage: form.values.legalUseTonnage,
        realName: form.values.legalName,
        realPersonCarry: form.values.legalPersonCarry,
        realRegisterCountry: form.values.legalRegisterCountry,
        realRegisterNumber: form.values.legalRegisterNumber,
        realShipbuildingBrand: form.values.legalShipbuildingBrand,
        realShipUtilities: form.values.legalShipUtilities,
        realShipType: form.values.legalShipType,
        realSink: form.values.legalSink,
        realSkinMaterial: form.values.legalSkinMaterial,
        realSpeed: form.values.legalSpeed,
        realYearMfg: form.values.legalYearMfg,
        realYearReconstructed: form.values.legalYearReconstructed,
        realManufacturingLocation: form.values.legalManufacturingLocation,
        realAdditionalContent: form.values.legalAdditionalContent,
      });
    };

    useImperativeHandle(ref, () => ({
      updateFeatureWaterVehicle: async () => {
        return form.submitForm();
      },
    }));

    useEffect(() => {
      if (assetWaterVehicleInfor) {
        form.setValues({
          ...form.values,
          ...assetWaterVehicleInfor,
        });
      }
    }, []);

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
        align: "center",
        width: "5%",
      },
      {
        key: 4,
        title: "Thực tế",
        dataIndex: "real",
        width: "30%",
      },
    ];
    const dataSource = [
      {
        type: RequireLabel({ label: "Tên phương tiện" }),
        hspl: (
          <FormItem
            tabIndex={1}
            disable={disableLegalValue}
            type={INPUT}
            value={form.values.legalName}
            error={form.errors.legalName}
            touched={form.touched.legalName}
            onChange={(e: any) => {
              handleChange({ legalName: e.target.value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={27}
            type={INPUT}
            value={form.values.realName}
            error={form.errors.realName}
            touched={form.touched.realName}
            onChange={(e: any) => {
              handleChange({ realName: e.target.value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Số đăng ký" }),
        hspl: (
          <FormItem
            tabIndex={2}
            disable={disableLegalValue}
            type={INPUT}
            value={form.values.legalRegisterNumber}
            error={form.errors.legalRegisterNumber}
            touched={form.touched.legalRegisterNumber}
            onChange={(e: any) => {
              handleChange({ legalRegisterNumber: e.target.value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={28}
            type={INPUT}
            value={form.values.realRegisterNumber}
            error={form.errors.realRegisterNumber}
            touched={form.touched.realRegisterNumber}
            onChange={(e: any) => {
              handleChange({ realRegisterNumber: e.target.value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Số loại/ Model" }),
        hspl: (
          <FormItem
            tabIndex={3}
            disable={disableLegalValue}
            type={INPUT}
            value={form.values.legalModel}
            error={form.errors.legalModel}
            touched={form.touched.legalModel}
            onChange={(e: any) => {
              handleChange({ legalModel: e.target.value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={29}
            type={INPUT}
            value={form.values.realModel}
            error={form.errors.realModel}
            touched={form.touched.realModel}
            onChange={(e: any) => {
              handleChange({ realModel: e.target.value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({
          label: "Số nhận dạng tàu/Số IMO",
        }),
        hspl: (
          <FormItem
            tabIndex={4}
            disable={disableLegalValue}
            type={INPUT}
            value={form.values.legalImoNumber}
            error={form.errors.legalImoNumber}
            touched={form.touched.legalImoNumber}
            onChange={(e: any) => {
              handleChange({ legalImoNumber: e.target.value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={30}
            type={INPUT}
            value={form.values.realImoNumber}
            error={form.errors.realImoNumber}
            touched={form.touched.realImoNumber}
            onChange={(e: any) => {
              handleChange({ realImoNumber: e.target.value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Nhãn hiệu", required: false }),
        hspl: (
          <FormItem
            tabIndex={5}
            disable={disableLegalValue}
            type={SELECT}
            value={form.values.legalBrand}
            onChange={(value: string | number) => {
              handleChange({ legalBrand: value });
            }}
            options={waterVehicleBrandOptions}
          />
        ),
        real: (
          <FormItem
            tabIndex={31}
            type={SELECT}
            value={form.values.realBrand}
            onChange={(value: string | number) => {
              handleChange({ realBrand: value });
            }}
            options={waterVehicleBrandOptions}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Năm sản xuất" }),
        hspl: (
          <FormItem
            tabIndex={6}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            min={1000}
            max={9999}
            value={form.values.legalYearMfg}
            error={form.errors.legalYearMfg}
            touched={form.touched.legalYearMfg}
            onChange={(value: number | string) => {
              handleChange({ legalYearMfg: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={32}
            type={INPUT_NUMBER}
            min={1000}
            max={9999}
            value={form.values.realYearMfg}
            error={form.errors.realYearMfg}
            touched={form.touched.realYearMfg}
            onChange={(value: number | string) => {
              handleChange({ realYearMfg: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Năm hoán cải", required: false }),
        hspl: (
          <FormItem
            tabIndex={7}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            min={1000}
            max={9999}
            value={form.values.legalYearReconstructed}
            error={form.errors.legalYearReconstructed}
            touched={form.touched.legalYearReconstructed}
            onChange={(value: number | string) => {
              handleChange({ legalYearReconstructed: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={33}
            type={INPUT_NUMBER}
            min={1000}
            max={9999}
            value={form.values.realYearReconstructed}
            error={form.errors.realYearReconstructed}
            touched={form.touched.realYearReconstructed}
            onChange={(value: number | string) => {
              handleChange({ realYearReconstructed: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Nước sản xuất" }),
        hspl: (
          <FormItem
            tabIndex={8}
            disable={disableLegalValue}
            type={SELECT}
            value={form.values.legalCountryMfg}
            error={form.errors.legalCountryMfg}
            touched={form.touched.legalCountryMfg}
            options={
              manufactoringCountries
                ?.slice()
                .sort((a: any, b: any) => {
                  return a.name.localeCompare(b.name);
                })
                .map((item: any) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                }) || []
            }
            onChange={(value: string | number) => {
              handleChangeVietNam({ legalCountryMfg: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={34}
            type={SELECT}
            value={form.values.realCountryMfg}
            error={form.errors.realCountryMfg}
            touched={form.touched.realCountryMfg}
            options={
              manufactoringCountries
                ?.slice()
                .sort((a: any, b: any) => {
                  return a.name.localeCompare(b.name);
                })
                .map((item: any) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                }) || []
            }
            onChange={(value: string | number) => {
              handleChangeVietNam({ realCountryMfg: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Nơi đóng tàu" }),
        hspl: (
          <FormItem
            tabIndex={9}
            disable={
              disableLegalValue || !(form.values.legalCountryMfg === vietNamId)
            }
            type={SELECT}
            value={form.values.legalManufacturingLocation}
            error={form.errors.legalManufacturingLocation}
            touched={form.touched.legalManufacturingLocation}
            options={
              provinces
                ? provinces.map((item: any) => ({
                    label: item.name,
                    value: item.code,
                  }))
                : []
            }
            onChange={(value: string | number) => {
              handleChangeVietNam({ legalManufacturingLocation: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={35}
            type={SELECT}
            value={form.values.realManufacturingLocation}
            touched={form.touched.realManufacturingLocation}
            error={form.errors.realManufacturingLocation}
            disable={!(form.values.realCountryMfg === vietNamId)}
            options={
              provinces
                ? provinces.map((item: any) => ({
                    label: item.name,
                    value: item.code,
                  }))
                : []
            }
            onChange={(value: string | number) => {
              handleChangeVietNam({ realManufacturingLocation: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Hãng đóng tàu", required: true }),
        hspl: (
          <FormItem
            tabIndex={10}
            disable={disableLegalValue}
            type={INPUT}
            value={form.values.legalShipbuildingBrand}
            onChange={(e: any) => {
              handleChange({ legalShipbuildingBrand: e.target.value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={36}
            type={INPUT}
            value={form.values.realShipbuildingBrand}
            onChange={(e: any) => {
              handleChange({ realShipbuildingBrand: e.target.value });
            }}
            error={form.errors.realShipbuildingBrand}
            touched={form.touched.realShipbuildingBrand}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Quốc gia đăng ký" }),
        hspl: (
          <FormItem
            tabIndex={11}
            disable={disableLegalValue}
            type={SELECT}
            value={form.values.legalRegisterCountry}
            error={form.errors.legalRegisterCountry}
            touched={form.touched.legalRegisterCountry}
            options={
              manufactoringCountries
                ?.slice()
                .sort((a: any, b: any) => {
                  return a.name.localeCompare(b.name);
                })
                .map((item: any) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                }) || []
            }
            onChange={(value: string | number) => {
              handleChange({ legalRegisterCountry: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={37}
            type={SELECT}
            value={form.values.realRegisterCountry}
            error={form.errors.realRegisterCountry}
            touched={form.touched.realRegisterCountry}
            options={
              manufactoringCountries
                ?.slice()
                .sort((a: any, b: any) => {
                  return a.name.localeCompare(b.name);
                })
                .map((item: any) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                }) || []
            }
            onChange={(value: string | number) => {
              handleChange({ realRegisterCountry: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Công năng sử dụng" }),
        hspl: (
          <FormItem
            tabIndex={12}
            disable={disableLegalValue}
            type={INPUT}
            value={form.values.legalShipUtilities}
            error={form.errors.legalShipUtilities}
            touched={form.touched.legalShipUtilities}
            onChange={(e: any) => {
              handleChange({ legalShipUtilities: e.target.value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={38}
            type={INPUT}
            value={form.values.realShipUtilities}
            error={form.errors.realShipUtilities}
            touched={form.touched.realShipUtilities}
            onChange={(e: any) => {
              handleChange({ realShipUtilities: e.target.value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({
          label: "Số lượng người được phép chở",
          required: false,
        }),
        hspl: (
          <FormItem
            tabIndex={13}
            disable={disableLegalValue}
            currencable={true}
            type={INPUT}
            value={form.values.legalPersonCarry}
            error={form.errors.legalPersonCarry}
            touched={form.touched.legalPersonCarry}
            onChange={(e: any) => {
              handleChange({ legalPersonCarry: e.target.value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={39}
            type={INPUT}
            currencable={true}
            value={form.values.realPersonCarry}
            error={form.errors.realPersonCarry}
            touched={form.touched.realPersonCarry}
            onChange={(e: any) => {
              handleChange({ realPersonCarry: e.target.value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({
          label: "Chiều dài thiết kế (m)",
          required: false,
        }),
        hspl: (
          <FormItem
            tabIndex={14}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            currencable={true}
            error={form.errors.legalDesignLength}
            touched={form.touched.legalDesignLength}
            value={form.values.legalDesignLength}
            onChange={(value: string | number) => {
              handleChange({ legalDesignLength: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={40}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realDesignLength}
            error={form.errors.realDesignLength}
            touched={form.touched.realDesignLength}
            onChange={(value: string | number) => {
              handleChange({ realDesignLength: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({
          label: "Chiều rộng thiết kế (m)",
          required: false,
        }),
        hspl: (
          <FormItem
            tabIndex={15}
            disable={disableLegalValue}
            currencable={true}
            type={INPUT_NUMBER}
            value={form.values.legalDesignWidth}
            error={form.errors.legalDesignWidth}
            touched={form.touched.legalDesignWidth}
            onChange={(value: string | number) => {
              handleChange({ legalDesignWidth: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={41}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realDesignWidth}
            error={form.errors.realDesignWidth}
            touched={form.touched.realDesignWidth}
            onChange={(value: string | number) => {
              handleChange({ realDesignWidth: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({
          label: "Chiều dài lớn nhất (m)",
          required: false,
        }),
        hspl: (
          <FormItem
            tabIndex={16}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.legalMaxLength}
            error={form.errors.legalMaxLength}
            touched={form.touched.legalMaxLength}
            onChange={(value: string | number) => {
              handleChange({ legalMaxLength: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={42}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realMaxLength}
            error={form.errors.realMaxLength}
            touched={form.touched.realMaxLength}
            onChange={(value: string | number) => {
              handleChange({ realMaxLength: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Chiều cao mạn (m)", required: false }),
        hspl: (
          <FormItem
            tabIndex={17}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.legalBoardHeight}
            error={form.errors.legalBoardHeight}
            touched={form.touched.legalBoardHeight}
            onChange={(value: string | number) => {
              handleChange({ legalBoardHeight: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={43}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realBoardHeight}
            error={form.errors.realBoardHeight}
            touched={form.touched.realBoardHeight}
            onChange={(value: string | number) => {
              handleChange({ realBoardHeight: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Chiều chìm (m)", required: false }),
        hspl: (
          <FormItem
            tabIndex={18}
            disable={disableLegalValue}
            currencable={true}
            type={INPUT_NUMBER}
            value={form.values.legalSink}
            error={form.errors.legalSink}
            touched={form.touched.legalSink}
            onChange={(value: string | number) => {
              handleChange({ legalSink: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={44}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realSink}
            error={form.errors.realSink}
            touched={form.touched.realSink}
            onChange={(value: string | number) => {
              handleChange({ realSink: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Mạn khô (m)", required: false }),
        hspl: (
          <FormItem
            tabIndex={19}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.legalFreeBoard}
            error={form.errors.legalFreeBoard}
            touched={form.touched.legalFreeBoard}
            onChange={(value: string | number) => {
              handleChange({ legalFreeBoard: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={45}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realFreeBoard}
            error={form.errors.realFreeBoard}
            touched={form.touched.realFreeBoard}
            onChange={(value: string | number) => {
              handleChange({ realFreeBoard: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Số lượng máy chính", required: false }),
        hspl: (
          <FormItem
            tabIndex={20}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.legalMachineNum}
            error={form.errors.legalMachineNum}
            touched={form.touched.legalMachineNum}
            onChange={(value: string | number) => {
              handleChange({ legalMachineNum: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={46}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realMachineNum}
            error={form.errors.realMachineNum}
            touched={form.touched.realMachineNum}
            onChange={(value: string | number) => {
              handleChange({ realMachineNum: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({
          label: "Công suất máy chính (kW)",
          required: false,
        }),
        hspl: (
          <FormItem
            tabIndex={21}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.legalMachinePower}
            error={form.errors.legalMachinePower}
            touched={form.touched.legalMachinePower}
            onChange={(value: string | number) => {
              handleChange({ legalMachinePower: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={47}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realMachinePower}
            error={form.errors.realMachinePower}
            touched={form.touched.realMachinePower}
            onChange={(value: string | number) => {
              handleChange({ realMachinePower: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({
          label: "Trọng tải toàn phần (MT)",
          required: false,
        }),
        hspl: (
          <FormItem
            tabIndex={22}
            disable={disableLegalValue}
            currencable={true}
            type={INPUT_NUMBER}
            value={form.values.legalDeadWeight}
            error={form.errors.legalDeadWeight}
            touched={form.touched.legalDeadWeight}
            onChange={(value: string | number) => {
              handleChange({ legalDeadWeight: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={48}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realDeadWeight}
            error={form.errors.realDeadWeight}
            touched={form.touched.realDeadWeight}
            onChange={(value: string | number) => {
              handleChange({ realDeadWeight: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Tổng dung tích (GT)", required: false }),
        hspl: (
          <FormItem
            tabIndex={23}
            disable={disableLegalValue}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.legalGrossTonnage}
            error={form.errors.legalGrossTonnage}
            touched={form.touched.legalGrossTonnage}
            onChange={(value: string | number) => {
              handleChange({ legalGrossTonnage: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={49}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realGrossTonnage}
            error={form.errors.realGrossTonnage}
            touched={form.touched.realGrossTonnage}
            onChange={(value: string | number) => {
              handleChange({ realGrossTonnage: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({
          label: "Dung tích thực dụng (NT)",
          required: false,
        }),
        hspl: (
          <FormItem
            tabIndex={24}
            disable={disableLegalValue}
            currencable={true}
            type={INPUT_NUMBER}
            value={form.values.legalUseTonnage}
            error={form.errors.legalUseTonnage}
            touched={form.touched.legalUseTonnage}
            onChange={(value: string | number) => {
              handleChange({ legalUseTonnage: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={50}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realUseTonnage}
            error={form.errors.realUseTonnage}
            touched={form.touched.realUseTonnage}
            onChange={(value: string | number) => {
              handleChange({ realUseTonnage: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Tốc độ tàu (HL)", required: false }),
        hspl: (
          <FormItem
            tabIndex={25}
            disable={disableLegalValue}
            currencable={true}
            type={INPUT_NUMBER}
            value={form.values.legalSpeed}
            error={form.errors.legalSpeed}
            touched={form.touched.legalSpeed}
            onChange={(value: string | number) => {
              handleChange({ legalSpeed: value });
            }}
          />
        ),
        real: (
          <FormItem
            tabIndex={51}
            type={INPUT_NUMBER}
            currencable={true}
            value={form.values.realSpeed}
            error={form.errors.realSpeed}
            touched={form.touched.realSpeed}
            onChange={(value: string | number) => {
              handleChange({ realSpeed: value });
            }}
          />
        ),
      },
      {
        type: RequireLabel({ label: "Nội dung khác", required: false }),
        hspl: (
          <FormItem
            tabIndex={26}
            maxLength={2000}
            disable={disableLegalValue}
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
            tabIndex={52}
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

    if (isLoading || isLoadingGetProvinces) return <>...isLoading</>;

    return (
      <Table
        size="small"
        className="feature-water-vehicle-table-container"
        bordered
        scroll={{ x: true }}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
    );
  }
);

export default FeatureWaterVehicle;
