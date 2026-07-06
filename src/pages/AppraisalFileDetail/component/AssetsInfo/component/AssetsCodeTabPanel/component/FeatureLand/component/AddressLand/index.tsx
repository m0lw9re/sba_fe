import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { addressApi } from "apis/adress";
import FormItem from "components/InputFields/FormItem";
import SelectCustom from "components/SelectCustom";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { OptionType } from "constant/types/common";
import { useFormik } from "formik";
import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { isDeepEqual, reTypeEmptyString2NullObj } from "utils/validate";
import * as Yup from "yup";

const { INPUT } = TYPE_FIELD;

type RefProps = {
  getData: () => void;
};
type Props = {
  data: AddressLandType;
};
type AddressLandType = {
  legalAddressDetail: string | null;
  legalAddressStreet: string | null;
  legalAddressWard: string | null;
  legalAddressDistrict: string | null;
  legalAddressProvince: string | null;
  realAddressDetail: string | null;
  realAddressStreet: string | null;
  realAddressWard: string | null;
  realAddressDistrict: string | null;
  realAddressProvince: string | null;
  legalDistricts?: OptionType[],
  districts?: OptionType[],
  legalWards?: OptionType[],
  wards?: OptionType[],
};
const formSchema = Yup.object().shape({})

const AddressLand = forwardRef<RefProps, Props>(({ data }, ref) => {
  const { typeCreated } = useSelector(
    (state: RootState) => state.appraisalFileDetailSlice
  );
  const { provinceOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const form = useFormik({
    initialValues: {} as AddressLandType,
    validationSchema: formSchema,
    onSubmit: (data: AddressLandType): any => {
      return data
    },
  });
  const handleChangeData = (data: any) => {
    const _data = reTypeEmptyString2NullObj(data);
    form.setValues({ ...form.values, ..._data });
  };
  const handleChangeProvince = async (provinceCode: string) => {
    try {
      const res = await addressApi.getDistricts({
        code: provinceCode || "",
      });
      const districts = res.data?.map((item: any) => ({
        value: item.code,
        label: item.fullName,
      }));
      handleChangeData({
        legalAddressProvince: provinceCode,
        legalAddressDistrict: null,
        legalAddressWard: null,
        legalDistricts: districts,
        legalWards: [],
      })
    } catch (error) {}
  };
  const handleChangeDistrict = async (districtCode: string) => {
    try {
      const res = await addressApi.getWards({
        code: districtCode || "",
      });
      const wards = res.data?.map((item: any) => ({
        value: item.code,
        label: item.fullName,
      }));
      handleChangeData({
        legalAddressDistrict: districtCode,
        legalAddressWard: null,
        legalWards: wards,
      })
    } catch (error) {}
  }

  const dataSource = [
    {
      type: "Hồ sơ pháp lý",
      province: (
        <SelectCustom
          disabled={typeCreated === 1 ? true : false}
          showSearch
          placeholder="Nhập"
          options={provinceOptions}
          value={form.values.legalAddressProvince}
          onChange={(value) => handleChangeProvince(value)}
        />
      ),
      district: (
        <SelectCustom
          disabled={typeCreated === 1 ? true : false}
          showSearch
          placeholder="Nhập"
          options={form.values?.legalDistricts || []}
          value={form.values.legalAddressDistrict}
          onChange={(value) => handleChangeDistrict(value)}
        />
      ),
      ward: (
        <SelectCustom
          disabled={typeCreated === 1 ? true : false}
          showSearch
          placeholder="Nhập"
          options={form.values?.legalWards || []}
          value={form.values.legalAddressWard}
          onChange={(value) => handleChangeData({ legalAddressWard: value })}
        />
      ),
      street: (
        <FormItem
          disable={typeCreated === 1 ? true : false}
          type={INPUT}
          value={form.values.legalAddressStreet}
          onChange={(e: any) =>
            handleChangeData({ legalAddressStreet: e.target.value })
          }
          error={form.errors.legalAddressStreet}
        />
        // <InputCustom
        //   placeholder="Nhập"
        //   //options={[]}
        //   value={form.values.legalAddressStreet || ""}
        //   onChange={(e: any) => {
        //     console.log(e.target.value);
        //     handleChange({ legalAddressStreet: e.target.value });
        //   }}
        // />
      ),
      detail: (
        <FormItem
          disable={typeCreated === 1 ? true : false}
          type={INPUT}
          value={form.values.legalAddressDetail}
          onChange={(e: any) =>
            handleChangeData({ legalAddressDetail: e.target.value })
          }
          error={form.errors.legalAddressDetail}
        />
      ),
    },
    {
      type: "Thực tế",
      province: (
        <SelectCustom
          showSearch
          placeholder="Nhập"
          disabled={true}
          options={provinceOptions}
          value={form.values.realAddressProvince}
          onChange={(value) =>
            handleChangeData({
              realAddressProvince: value,
              realAddressDistrict: null,
              realAddressWard: null,
            })
          }
        />
      ),
      district: (
        <SelectCustom
          showSearch
          placeholder="Nhập"
          disabled={true}
          options={form.values?.districts || []}
          value={form.values.realAddressDistrict}
          onChange={(value) =>
            handleChangeData({ realAddressDistrict: value, realAddressWard: null })
          }
        />
      ),
      ward: (
        <SelectCustom
          showSearch
          placeholder="Nhập"
          disabled={true}
          options={form.values?.wards || []}
          value={form.values.realAddressWard}
          onChange={(value) => handleChangeData({ realAddressWard: value })}
        />
      ),
      street: (
        <FormItem
          type={INPUT}
          value={form.values.realAddressStreet}
          disable={true}
          onChange={(e: any) =>
            handleChangeData({ realAddressStreet: e.target.value })
          }
          error={form.errors.realAddressStreet}
        />
      ),
      detail: (
        <FormItem
          type={INPUT}
          value={form.values.realAddressDetail}
          disable={true}
          onChange={(e: any) =>
            handleChangeData({ realAddressDetail: e.target.value })
          }
          error={form.errors.realAddressDetail}
        />
      ),
    },
  ];

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "Địa chỉ tài sản",
      dataIndex: "type",
      width: "15%",
    },
    {
      key: 2,
      title: "Tỉnh/Thành phố",
      dataIndex: "province",
      width: "15%",
    },
    {
      key: 3,
      title: "Quận/Huyện/Thị xã",
      dataIndex: "district",
      width: "15%",
    },
    {
      key: 4,
      title: "Xã/Phường/Thị trấn",
      dataIndex: "ward",
      width: "15%",
    },
    {
      key: 5,
      title: "Đường phố",
      dataIndex: "street",
      align: "center",
      width: "15%",
    },
    {
      key: 6,
      title: "Chi tiết số nhà",
      dataIndex: "detail",
      align: "center",
      width: "15%",
    },
  ];
  useImperativeHandle(ref, () => ({
    getData: form.submitForm,
  }));

  useEffect(() => {
    if(data) handleChangeData(data)
  }, [data])

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
});

export default memo(
  AddressLand,
  (prevProps, nextProps) =>isDeepEqual(prevProps.data, nextProps.data)
);
