import { Checkbox, Col, Form, Input, Row, Space, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ColumnsType } from "antd/es/table";
import { addressApi } from "apis/adress";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import { DynamicTable } from "components/DynamicTable";
import FormItem from "components/InputFields/FormItem";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { AssetLandInfoType } from "constant/types/appraisalFile";
import { debounce, isNumber } from "lodash";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { renderRequire } from "pages/PriceShared/ApprovePriceShared/subcomponents/TableApprovalAsset/config";

const { INPUT_NUMBER, INPUT, SELECT, POPUP_INPUT } = TYPE_FIELD;

type Props = {
  data: AssetLandInfoType[];
  onChangeActiveTab: (value: string) => void;
  onAddTab: () => void;
  onDeleteTab: (itemId: number) => void;
  onUpdateData: (data: AssetLandInfoType[]) => void;
  onCopyMultiRow: (index: number) => void;
};
type RefProps = {
  updateSummaryTable: () => void;
};
type IOptions = {
  value: string | number;
  label: string;
};
const FeatureLandSummaryTable = forwardRef<RefProps, Props>((props, ref) => {
  const {
    data,
    onChangeActiveTab,
    onAddTab,
    onDeleteTab,
    onUpdateData,
    onCopyMultiRow,
  } = props;

  const { provinceOptions } = useSelector(
    (state: RootState) => state.globalSlice
  );
  const [dataSource, setDataSource] = useState<AssetLandInfoType[]>([]);
  const debounceValue = useCallback(
    debounce((nextValue: AssetLandInfoType[]) => {
      onUpdateData(nextValue);
    }, 1000),
    []
  );

  useImperativeHandle(ref, () => ({
    updateSummaryTable: async () => {
      try {
        // check data realAreaWidth and note
        const isRealAreaWidthValid = dataSource.every(
          (item) =>
            isNumber(item.realAreaWidth) &&
            item.realAreaWidth > 0 &&
            item.note &&
            item.realAddressProvince
        );
        // const isNoteValid = dataSource.every(
        //   (item) => item.note && item.note.length > 0
        // );
        return [dataSource, isRealAreaWidthValid];
      } catch (error: any) {
        return [dataSource, false];
      }
    },
  }));

  const handleRowChange = (value: any, index: number) => {
    // update table data
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };
    setDataSource(tmpDataSource);
    debounceValue(tmpDataSource);
  };
  const handleProvinceChange = async (value: any, index: number) => {
    // get districts
    const districts = await addressApi.getDistricts({
      code: value,
    });
    const districtsOptions: IOptions[] = districts.data?.map((item: any) => ({
      value: item.code,
      label: item.fullName,
    }));
    handleRowChange(
      {
        realAddressProvince: value,
        realAddressDistrict: null,
        realAddressWard: null,
        districts: districtsOptions,
        wards: [],
      },
      index
    );
  };

  const handleDistrictChange = async (value: any, index: number) => {
    // get wards
    const wards = await addressApi.getWards({
      code: value,
    });
    const wardsOptions: IOptions[] = wards.data?.map((item: any) => ({
      value: item.code,
      label: item.fullName,
    }));
    handleRowChange(
      {
        realAddressDistrict: value,
        realAddressWard: null,
        wards: wardsOptions,
      },
      index
    );
  };
  const handleSelectRow = (value: boolean, index: number) => {
    setDataSource((prev) => {
      const tmp = [...prev];
      tmp[index].isSelected = value;
      return tmp;
    });
  };

  const columns: ColumnsType<AssetLandInfoType> = useMemo(() => {
    return [
      {
        key: 1,
        title: "",
        width: "3%",
        align: "center",
        dataIndex: "isSelected",
        render: (isSelected: boolean, _, index: number) => {
          return (
            <Checkbox
              checked={isSelected}
              onChange={(e: CheckboxChangeEvent) => {
                handleSelectRow(e.target.checked, index);
                handleRowChange({ isSelected: e.target.checked }, index);
              }}
            />
          );
        },
      },
      {
        key: 2,
        title: "Thửa đất",
        width: "7.15%",
        align: "center",
        render: (value: any, _, index: number) => {
          return `Thửa đất ${index + 1}`;
        },
      },
      {
        key: 3,
        title: renderRequire("Tỉnh/Thành phố"),
        dataIndex: "realAddressProvince",
        width: "13.15%",
        render: (value: any, _, index: number) => {
          return (
            <FormItem
              type={SELECT}
              showSearch
              options={provinceOptions}
              value={value}
              onChange={(value: any) => {
                handleProvinceChange(value, index);
              }}
            />
          );
        },
      },
      {
        key: 4,
        title: "Quận/Huyện/Thị xã",
        dataIndex: "realAddressDistrict",
        width: "11.15%",
        render: (value: any, record: AssetLandInfoType, index: number) => {
          return (
            <FormItem
              type={SELECT}
              showSearch
              options={record?.districts || []}
              value={value}
              onChange={(value: any) => handleDistrictChange(value, index)}
            />
          );
        },
      },
      {
        key: 5,
        title: "Xã/Phường/Thị trấn",
        dataIndex: "realAddressWard",
        width: "11.15%",
        render(value: any, record: AssetLandInfoType, index: number) {
          return (
            <FormItem
              type={SELECT}
              showSearch
              options={record?.wards || []}
              value={value}
              onChange={(value: any) =>
                handleRowChange({ realAddressWard: value }, index)
              }
            />
          );
        },
      },
      {
        key: 6,
        title: "Đường phố",
        dataIndex: "realAddressStreet",
        width: "11.15%",
        render: (value: any, _, index: number) => {
          return (
            <FormItem
              type={INPUT}
              value={value}
              onChange={(e: any) =>
                handleRowChange({ realAddressStreet: e.target.value }, index)
              }
            />
          );
        },
      },
      {
        key: 8,
        title: "Chi tiết số nhà",
        dataIndex: "realAddressDetail",
        width: "10.15%",
        render: (value: any, _, index: number) => {
          return (
            <FormItem
              type={INPUT}
              value={value}
              onChange={(e: any) =>
                handleRowChange({ realAddressDetail: e.target.value }, index)
              }
            />
          );
        },
      },
      {
        key: 7,
        title: renderRequire("Diện tích khuôn viên (m²)"),
        dataIndex: "realAreaWidth",
        width: "10.15%",
        render: (value: any, _, index: number) => {
          return (
            <FormItem
              type={INPUT_NUMBER}
              value={value}
              onChange={(value: number) => {
                handleRowChange({ realAreaWidth: value }, index);
              }}
              placeholder="Nhập"
              currencable
            />
          );
        },
      },
      {
        key: 9,
        title: renderRequire("Mô tả chi tiết vị trí"),
        dataIndex: "note",
        width: "10.15%",
        render: (value: any, _, index: number) => {
          return (
            <FormItem
              type={POPUP_INPUT}
              value={value}
              onChange={(e: any) => {
                handleRowChange({ note: e.target.value }, index);
              }}
              maxLength={4000}
            />
          );
        },
      },

      {
        key: 10,
        title: "Xem chi tiết",
        align: "center",
        width: "10.15%",
        render: (value: any, _, index: number) => {
          return (
            <Typography.Link
              onClick={() => {
                onChangeActiveTab(index.toString());
              }}
              style={{
                textDecoration: "underline !important",
              }}
            >
              Xem chi tiết
            </Typography.Link>
          );
        },
      },
    ];
  }, [JSON.stringify(dataSource), JSON.stringify(provinceOptions)]);

  useEffect(() => {
    if (data) setDataSource(data);
  }, [JSON.stringify(data)]);

  return (
    <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
      <DynamicTable
        columns={columns}
        dataSource={dataSource}
        otherButton={(_, index: number) => (
          <ButtonCustom
            bgColor="#00b335"
            size="small"
            icon={<Icons.copy style={{ color: "#FFFFFF" }} />}
            onClick={() => onCopyMultiRow(index)}
          />
        )}
        onAddRow={() => {
          onAddTab();
        }}
        onRemoveRow={(data, index) => {
          onDeleteTab(index);
        }}
      />
    </Space>
  );
});
export default memo(FeatureLandSummaryTable);
