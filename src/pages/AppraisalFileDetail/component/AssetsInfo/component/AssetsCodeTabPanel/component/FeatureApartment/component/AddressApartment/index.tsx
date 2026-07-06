import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { addressApi } from "apis/adress";
import FormItem from "components/InputFields/FormItem";
import SelectCustom from "components/SelectCustom";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { OptionType } from "constant/types/common";
import { FC, memo } from "react";
import { useSelector } from "react-redux";
import { isDeepEqual } from "utils/validate";
import { renderRequire } from "pages/PriceShared/ApprovePriceShared/subcomponents/TableApprovalAsset/config";

const { INPUT, POPUP_INPUT, SELECT } = TYPE_FIELD;

type Props = {
  data: {
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
    legalDistricts?: OptionType[];
    districts?: OptionType[];
    legalWards?: OptionType[];
    wards?: OptionType[];
  };
  handleChange: (data: any) => void;
  errors: any;
  touched: any;
};

const AddressApartment: FC<Props> = ({
  data,
  handleChange,
  errors,
  touched,
}) => {
  const { provinceOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const handleChangeProvince = async (
    provinceCode: string,
    type: "real" | "legal"
  ) => {
    if (provinceCode) {
      try {
        const res = await addressApi.getDistricts({
          code: provinceCode,
        });
        const districts = res.data?.map((item: any) => ({
          value: item.code,
          label: item.fullName,
        }));

        if (type === "real") {
          handleChange({
            realAddressProvince: provinceCode,
            realAddressDistrict: null,
            realAddressWard: null,
            districts,
            wards: [],
          });
        } else {
          handleChange({
            legalAddressProvince: provinceCode,
            legalAddressDistrict: null,
            legalAddressWard: null,
            legalDistricts: districts,
            legalWards: [],
          });
        }
      } catch (error) {}
    } else {
      if (type === "real") {
        handleChange({
          realAddressProvince: null,
          realAddressDistrict: null,
          realAddressWard: null,
        });
      } else {
        handleChange({
          legalAddressProvince: null,
          legalAddressDistrict: null,
          legalAddressWard: null,
        });
      }
    }
  };
  const handleChangeDistrict = async (
    districtCode: string,
    type: "real" | "legal"
  ) => {
    try {
      const res = await addressApi.getWards({
        code: districtCode || "",
      });
      const wards = res.data?.map((item: any) => ({
        value: item.code,
        label: item.fullName,
      }));
      if (type === "real") {
        handleChange({
          realAddressDistrict: districtCode,
          realAddressWard: null,
          wards,
        });
      } else {
        handleChange({
          legalAddressDistrict: districtCode,
          legalAddressWard: null,
          legalWards: wards,
        });
      }
    } catch (error) {}
  };

  const dataSource = [
    {
      type: "Hồ sơ pháp lý",
      province: (
        <SelectCustom
          showSearch
          placeholder="Nhập"
          options={provinceOptions}
          value={data.legalAddressProvince}
          onChange={(value) => handleChangeProvince(value, "legal")}
        />
      ),
      district: (
        <SelectCustom
          showSearch
          placeholder="Nhập"
          options={data.legalDistricts || []}
          value={data.legalAddressDistrict}
          onChange={(value) => handleChangeDistrict(value, "legal")}
        />
      ),
      ward: (
        <SelectCustom
          showSearch
          placeholder="Nhập"
          options={data.legalWards || []}
          value={data.legalAddressWard}
          onChange={(value) => handleChange({ legalAddressWard: value })}
        />
      ),
      street: (
        <FormItem
          type={INPUT}
          value={data.legalAddressStreet}
          onChange={(e: any) =>
            handleChange({ legalAddressStreet: e.target.value })
          }
          error={errors.legalAddressStreet}
        />
        // <InputCustom
        //   placeholder="Nhập"
        //   //options={[]}
        //   value={data.legalAddressStreet || ""}
        //   onChange={(e: any) => {
        //     console.log(e.target.value);
        //     handleChange({ legalAddressStreet: e.target.value });
        //   }}
        // />
      ),
      detail: (
        <FormItem
          type={POPUP_INPUT}
          value={data.legalAddressDetail}
          onChange={(e: any) =>
            handleChange({ legalAddressDetail: e.target.value })
          }
          error={errors.legalAddressDetail}
        />
      ),
    },
    {
      type: renderRequire("Thực tế"),
      province: (
        <FormItem
          showSearch
          onChange={(value: string) => handleChangeProvince(value, "real")}
          type={SELECT}
          value={data.realAddressProvince}
          options={provinceOptions}
          error={errors.realAddressProvince}
          touched={touched.realAddressProvince}
        />
      ),
      district: (
        <FormItem
          showSearch
          onChange={(value: string) => handleChangeDistrict(value, "real")}
          type={SELECT}
          value={data.realAddressDistrict}
          options={data.districts || []}
          error={errors.realAddressDistrict}
          touched={touched.realAddressDistrict}
        />
      ),
      ward: (
        <FormItem
          showSearch
          onChange={(value: string) => handleChange({ realAddressWard: value })}
          type={SELECT}
          value={data.realAddressWard}
          options={data.wards || []}
          error={errors.realAddressWard}
          touched={touched.realAddressWard}
        />
      ),
      street: (
        <FormItem
          type={INPUT}
          value={data.realAddressStreet}
          disable={false}
          onChange={(e: any) =>
            handleChange({ realAddressStreet: e.target.value })
          }
          error={errors.realAddressStreet}
          touched={touched.realAddressStreet}
        />
      ),
      detail: (
        <FormItem
          type={POPUP_INPUT}
          value={data.realAddressDetail}
          disable={false}
          onChange={(e: any) =>
            handleChange({ realAddressDetail: e.target.value })
          }
          error={errors.realAddressDetail}
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
      title: renderRequire("Tỉnh/Thành phố"),
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
      title: "Chi tiết địa chỉ",
      dataIndex: "detail",
      align: "center",
      width: "15%",
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
  AddressApartment,
  (prevProps, nextProps) =>
    isDeepEqual(prevProps.data, nextProps.data) &&
    isDeepEqual(prevProps.errors, nextProps.errors) &&
    isDeepEqual(prevProps.touched, nextProps.touched) &&
    prevProps.handleChange === nextProps.handleChange
);
