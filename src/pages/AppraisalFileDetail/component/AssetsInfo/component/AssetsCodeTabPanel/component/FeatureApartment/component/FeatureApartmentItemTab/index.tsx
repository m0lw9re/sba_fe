import { Form, Row, Space } from "antd";
import "./style.scss";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import InputFields from "components/InputFields";

import { AssetApartmentInfoType } from "constant/types/appraisalFile";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import AddressApartment from "../AddressApartment";
import DetailAddress from "../DetailAddress";
import FeatureTable from "../FeatureTable";
import { reTypeEmptyString2NullObj } from "utils/validate";
import { CollapseCustom } from "components/CollapseCustom";
import UtilitiesAppartment from "../../../UtilitiesAppartment";

const { INPUT } = TYPE_FIELD;

type Props = {
  data: AssetApartmentInfoType;
  updateListTab: any;
  index: number;
};

type RefProps = {
  btnRefUpdateFeatureApartmentItem: () => void;
};

const formSchema = Yup.object().shape({
  realAddressProvince: Yup.string().required("Vui lòng nhập tỉnh").nullable(),
  // realAddressDistrict: Yup.string().required("Vui lòng nhập huyện").nullable(),
  // realAddressWard: Yup.string().required("Vui lòng nhập xã").nullable(),
  // realAddressStreet: Yup.string().required("Vui lòng nhập đường").nullable(),
  // realBuilding: Yup.string().required("Vui lòng nhập").nullable(),
  nameBuilding: Yup.string().required("Vui lòng nhập").nullable(),
  positionId: Yup.string().required("Vui lòng nhập").nullable(),
  description: Yup.string().required("Vui lòng nhập").nullable(),
  realApartmentCode: Yup.string()
    .required("Vui lòng nhập mã căn hộ")
    .nullable(),
  realFloorNo: Yup.string().required("Vui lòng nhập tầng số").nullable(),
  realPrivateUseArea: Yup.string()
    .required("Vui lòng nhập diện tích sử dụng riêng")
    .nullable(),
  realFurniture: Yup.string()
    .required("Vui lòng nhập nội thất căn hộ")
    .nullable(),
});

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const cssLabel = { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 };
const cssInput = { xs: 18, sm: 18, md: 18, lg: 18, xl: 18 };

const FeatureApartmentItemTab = forwardRef<RefProps, Props>(
  ({ data, updateListTab, index }, ref) => {
    // Tiện ích căn hộ chung cư
    const btnRefUtilitiesAppartment = useRef<{
      updateUtilitiesAppartment: () => void;
    }>(null);
    const form = useFormik({
      initialValues: {} as AssetApartmentInfoType | any,
      validationSchema: formSchema,
      onSubmit: async (data: AssetApartmentInfoType): Promise<any> => {
        // Thông tin tiện ích căn hộ chung cư
        const utilitiesData: any =
          await btnRefUtilitiesAppartment.current?.updateUtilitiesAppartment();
        return {
          ...data,
          ...(utilitiesData ? { ...utilitiesData } : {}),
          orderBy: index,
        };
      },
    });

    useEffect(() => {
      if (data) {
        const getData = {
          ...data,
          legalApartmentCode: data.legalApartmentCode,
          legalFloorNo: data.legalFloorNo,
          legalNumberBedroom: data.legalNumberBedroom,
          legalNumberToilets: data.legalNumberToilets,
          legalFurniture: data.legalFurniture,
          legalFacades: data.legalFacades,
          legalMainBalconyDirection: data.legalMainBalconyDirection,
          legalPrivateUseArea: data.legalPrivateUseArea,
          legalClearanceArea: data.legalClearanceArea,
          legalBuildupArea: data.legalBuildupArea,
          legalExtendArea: data.legalExtendArea,
          legalCurrentPrivateUsing: data.legalCurrentPrivateUsing,
          realApartmentCode: data.realApartmentCode,
          realFloorNo: data.realFloorNo,
          realNumberBedroom: data.realNumberBedroom,
          realNumberToilets: data.realNumberToilets,
          realFurniture: data.realFurniture,
          realFacades: data.realFacades,
          realMainBalconyDirection: data.realMainBalconyDirection,
          realPrivateUseArea: data.realPrivateUseArea,
          realClearanceArea: data.realClearanceArea,
          realBuildupArea: data.realBuildupArea,
          realExtendArea: data.realExtendArea,
          realCurrentPrivateUsing: data.realCurrentPrivateUsing,
          utilities: data.utilities,
          realAddressProvince: data.realAddressProvince,
          realAddressDistrict: data.realAddressDistrict,
          realAddressWard: data.realAddressWard,
          realAddressStreet: data.realAddressStreet,
          realBuilding: data.realBuilding,
          nameBuilding: data.nameBuilding,
          positionId: data.positionId,
          description: data.description,
        };
        form.setValues({ ...form.values, ...getData });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useImperativeHandle(ref, () => ({
      btnRefUpdateFeatureApartmentItem: async () => {
        const values = await form.submitForm();
        const errors = form.errors;
        const validate = JSON.stringify(errors) === "{}" ? false : errors;

        return [values, validate];
      },
    }));

    const inputs: InputFiledParams[] = [
      {
        key: 1,
        label: "Số thửa",
        type: INPUT,
        placeholder: "Nhập",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        error: form.errors.landPlotNumber,
        value: form.values.landPlotNumber,
        onChange: (e: any) =>
          form.setValues({ ...form.values, landPlotNumber: e.target.value }),
      },
      {
        key: 2,
        label: "Số tờ bản đồ",
        type: INPUT,
        placeholder: "Nhập",
        css: css,
        labelCol: cssLabel,
        wrapperCol: cssInput,
        error: form.errors.mapSheetNumber,
        value: form.values.mapSheetNumber,
        onChange: (e: any) =>
          form.setValues({ ...form.values, mapSheetNumber: e.target.value }),
      },
    ];

    const handleChangeData = useCallback(
      (data: any) => {
        const _data = reTypeEmptyString2NullObj(data);
        form.setValues({ ...form.values, ..._data });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [form.values]
    );

    return (
      <Space style={{ width: "100%" }} direction="vertical" size={"small"}>
        <Form labelWrap labelAlign="left" size="small">
          <Row gutter={[24, 4]} style={{ marginBottom: "8px" }}>
            <InputFields data={inputs} />
          </Row>

          <AddressApartment
            data={{
              legalAddressDetail: form.values.legalAddressDetail,
              legalAddressStreet: form.values.legalAddressStreet,
              legalAddressWard: form.values.legalAddressWard,
              legalAddressDistrict: form.values.legalAddressDistrict,
              legalAddressProvince: form.values.legalAddressProvince,
              realAddressDetail: form.values.realAddressDetail,
              realAddressStreet: form.values.realAddressStreet,
              realAddressWard: form.values.realAddressWard,
              realAddressDistrict: form.values.realAddressDistrict,
              realAddressProvince: form.values.realAddressProvince,
              legalDistricts: form.values.legalDistricts,
              legalWards: form.values.legalWards,
              districts: form.values.districts,
              wards: form.values.wards,
            }}
            handleChange={handleChangeData}
            errors={form.errors}
            touched={form.touched}
          />
          <DetailAddress
            data={{
              realBuilding: form.values.realBuilding,
              numberFloors: form.values.numberFloors,
              nameBuilding: form.values.nameBuilding,
              numberBasement: form.values.numberBasement,
              positionId: form.values.positionId,
              mainRoadWith: form.values.mainRoadWith,
              description: form.values.description,
              termOfLandUse: form.values.termOfLandUse,
              totalApartmentArea: form.values.totalApartmentArea,
              uses: form.values.uses,
              usingPurposeTypeId: form.values.usingPurposeTypeId,
              // remainQuantity: form.values.remainQuantity
            }}
            handleChange={handleChangeData}
            errors={form.errors}
            touched={form.touched}
          />
          <FeatureTable
            data={{
              legalApartmentCode: form.values.legalApartmentCode,
              legalFloorNo: form.values.legalFloorNo,
              legalNumberBedroom: form.values.legalNumberBedroom,
              legalNumberToilets: form.values.legalNumberToilets,
              legalFurniture: form.values.legalFurniture,
              legalFacades: form.values.legalFacades,
              legalMainBalconyDirection: form.values.legalMainBalconyDirection,
              legalPrivateUseArea: form.values.legalPrivateUseArea,
              legalClearanceArea: form.values.legalClearanceArea,
              legalBuildupArea: form.values.legalBuildupArea,
              legalExtendArea: form.values.legalExtendArea,
              legalCurrentPrivateUsing: form.values.legalCurrentPrivateUsing,
              realApartmentCode: form.values.realApartmentCode,
              realFloorNo: form.values.realFloorNo,
              realNumberBedroom: form.values.realNumberBedroom,
              realNumberToilets: form.values.realNumberToilets,
              realFurniture: form.values.realFurniture,
              realFacades: form.values.realFacades,
              realMainBalconyDirection: form.values.realMainBalconyDirection,
              realPrivateUseArea: form.values.realPrivateUseArea,
              realClearanceArea: form.values.realClearanceArea,
              realBuildupArea: form.values.realBuildupArea,
              realExtendArea: form.values.realExtendArea,
              realCurrentPrivateUsing: form.values.realCurrentPrivateUsing,
            }}
            handleChange={handleChangeData}
            errors={form.errors}
            touched={form.touched}
            updateListTab={updateListTab}
          />
          <CollapseCustom
            isInner
            itemList={[
              {
                label: "Tiện ích",
                forceRender: true,
                children: (
                  <UtilitiesAppartment
                    data={{
                      utilities: form.values?.utilities,
                    }}
                    ref={btnRefUtilitiesAppartment}
                  />
                ),
              },
            ]}
          />
        </Form>
      </Space>
    );
  }
);

export default memo(FeatureApartmentItemTab);
