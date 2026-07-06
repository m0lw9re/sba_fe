import { Form, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { useFormik } from "formik";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as Yup from "yup";
import { TableRentalType, mockData1 } from "./config";
const { INPUT, INPUT_NUMBER } = TYPE_FIELD;

const formSchema = Yup.object().shape({
  areaWidth: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .required("Không được để trống"),
  rentRatio: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .max(100, "Phải nhỏ hơn 100")
    .required("Không được để trống"),
  growthSpeed: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .required("Không được để trống"),
  discountRate: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .max(100, "Phải nhỏ hơn 100")
    .required("Không được để trống"),
  remainYears: Yup.number()
    .nullable()
    .min(1, "Phải lớn hơn 0")
    .max(50, "Số năm không quá 50")
    .required("Không được để trống"),
  assumeGrowthSpeed: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .required("Không được để trống"),
  unitPriceMarket: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .required("Không được để trống"),
  unitPriceState: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .required("Không được để trống"),
  rentIncome: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .required("Không được để trống"),
  profitAfterTax: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .required("Không được để trống"),
  landTax: Yup.number()
    .nullable()
    .min(0, "Phải lớn hơn 0")
    .required("Không được để trống"),
});
type Props = {
  data: any;
  adjustTable: any;
  storedAssets: any;
  handleUpdateAssetLandRentFlowDto: (data: any) => void;
};
type RefProps = {
  updateData: () => void;
};
const RentalCashFlow = forwardRef<RefProps, Props>(
  (
    { data, adjustTable, storedAssets, handleUpdateAssetLandRentFlowDto },
    ref
  ) => {
    const [count, setCount] = useState(0);

    const handleChange = (dataInput: any) => {
      form.setValues({ ...form.values, ...dataInput });
      if (form.isValid) {
        const convertedData = convertDataToUpdate();
        handleUpdateAssetLandRentFlowDto(convertedData);
      }
    };

    const form = useFormik({
      validationSchema: formSchema,
      initialValues: mockData1,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: () => {},
    });

    const dataSource = [
      {
        stt: "1",
        type: "Thông số",
      },
      {
        stt: mockData1.stt1,
        type: mockData1.type1,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            required
            require
            value={form.values.areaWidth}
            onChange={(value: number) => {
              handleChange({
                areaWidth: value,
              });
            }}
            error={form.errors.areaWidth}
            currencable
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={form.values.note1}
            onChange={(e: any) => handleChange({ note1: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt2,
        type: mockData1.type2,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.rentRatio}
            onChange={(value: number) => {
              handleChange({
                rentRatio: value,
              });
            }}
            min={0}
            max={100}
            addonAfter="%"
            error={form.errors.rentRatio}
            currencable
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={form.values.note2}
            onChange={(e: any) => handleChange({ note2: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt3,
        type: mockData1.type3,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            disable
            value={Math.round(Number(form.values.areaRent))}
            error={form.errors.areaRent}
            currencable
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={form.values.note3}
            onChange={(e: any) => handleChange({ note3: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt4,
        type: mockData1.type4,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.growthSpeed}
            onChange={(value: number) => handleChange({ growthSpeed: value })}
            error={form.errors.growthSpeed}
            min={0}
            max={100}
            addonAfter="%"
            currencable
          />
        ),
        note: (
          <FormItem
            type={INPUT_NUMBER}
            placeholder="VD: /năm thì nhập số 1"
            value={form.values.note4}
            onChange={(value: number) => handleChange({ note4: value })}
            min={0}
            addonAfter="năm"
          />
        ),
      },
      {
        stt: mockData1.stt5,
        type: mockData1.type5,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.discountRate}
            onChange={(value: number) => handleChange({ discountRate: value })}
            error={form.errors.discountRate}
            addonAfter="%"
            currencable
            min={0}
            max={100}
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={form.values.note5}
            onChange={(e: any) => handleChange({ note5: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt6,
        type: mockData1.type6,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.remainYears}
            onChange={(value: number) => handleChange({ remainYears: value })}
            error={form.errors.remainYears}
            min={0}
            addonAfter="năm"
            currencable
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={form.values.note6}
            onChange={(e: any) => handleChange({ note6: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt7,
        type: mockData1.type7,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.assumeGrowthSpeed}
            onChange={(value: number) =>
              handleChange({ assumeGrowthSpeed: value })
            }
            error={form.errors.assumeGrowthSpeed}
            min={0}
            max={100}
            addonAfter="%"
            currencable
          />
        ),
        note: (
          <FormItem
            type={INPUT_NUMBER}
            placeholder="VD: /5 năm thì nhập số 5"
            value={form.values.note7}
            onChange={(value: number) => handleChange({ note7: value })}
            min={0}
            addonAfter="năm"
          />
        ),
      },
      {
        stt: mockData1.stt8,
        type: mockData1.type8,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.unitPriceMarket}
            onChange={(value: number) =>
              handleChange({ unitPriceMarket: value })
            }
            error={form.errors.unitPriceMarket}
            currencable
            isRounded
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={form.values.note8}
            onChange={(e: any) => handleChange({ note8: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt9,
        type: mockData1.type9,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.unitPriceState}
            onChange={(value: number) =>
              handleChange({ unitPriceState: value })
            }
            error={form.errors.unitPriceState}
            currencable
            isRounded
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={form.values.note9}
            onChange={(e: any) => handleChange({ note9: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt10,
        type: mockData1.type10,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.rentIncome}
            onChange={(value: number) => handleChange({ rentIncome: value })}
            error={form.errors.rentIncome}
            currencable
            isRounded
            disable
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={form.values.note10}
            onChange={(e: any) => handleChange({ note10: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt11,
        type: mockData1.type11,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.profitAfterTax}
            onChange={(value: number) =>
              handleChange({ profitAfterTax: value })
            }
            error={form.errors.profitAfterTax}
            currencable
            isRounded
            disable
          />
        ),
        note: (
          <FormItem
            type={INPUT_NUMBER}
            placeholder="VD: 20% thì nhập 20"
            value={form.values.note11}
            onChange={(value: number) => handleChange({ note11: value })}
            min={0}
            addonAfter="%"
          />
        ),
      },
      {
        stt: mockData1.stt12,
        type: form.values.type12,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.landTax}
            onChange={(value: number) => handleChange({ landTax: value })}
            error={form.errors.landTax}
            currencable
            isRounded
            disable
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={mockData1.note12}
            onChange={(e: any) => handleChange({ note12: e.target.value })}
          />
        ),
      },
      {
        stt: mockData1.stt13,
        type: form.values.type13,
        area: (
          <FormItem
            type={INPUT_NUMBER}
            value={form.values.monthsInFirstYear}
            onChange={(value: number) =>
              handleChange({ monthsInFirstYear: value })
            }
            error={form.errors.monthsInFirstYear}
            min={0}
            max={12}
          />
        ),
        note: (
          <FormItem
            type={INPUT}
            value={mockData1.note13}
            onChange={(e: any) => handleChange({ note13: e.target.value })}
          />
        ),
      },
    ];

    const columns: ColumnsType<any> = [
      {
        key: 1,
        title: "STT",
        dataIndex: "stt",
        width: "4%",
      },
      {
        key: 2,
        title: "Thông số của khung chức năng",
        dataIndex: "type",
        width: "31%",
      },
      {
        key: 2,
        title: "Diện tích m2",
        dataIndex: "area",
        width: "31%",
      },
      {
        key: 4,
        title: "Ghi chú",
        dataIndex: "note",
        width: "31%",
      },
    ];

    useImperativeHandle(ref, () => ({
      updateData: async () => {
        const errors = await form.validateForm();
        if (Object.keys(errors).length === 0) {
          const convertedData = convertDataToUpdate();
          return [convertedData, true];
        } else {
          // show the errors
          message.error("Có lỗi xảy ra ở bảng tính dòng tiền cho thuê nhà");
          return [undefined, false];
        }
      },
    }));

    const CalTotalRatio = useCallback(
      (isAbs = false) => {
        let totalRatios: any[] = [];
        adjustTable.forEach((el: any) => {
          const totalRatio = el.adjustTable?.reduce(
            (sum: number, a: any) =>
              sum + (isAbs ? Math.abs(a.ratio) : a.ratio),
            0
          );
          totalRatios.push(totalRatio.toFixed(3));
        });

        return totalRatios;
      },
      [adjustTable]
    );

    const CalUnitPrice = useCallback(() => {
      const totalRatios = CalTotalRatio(false);
      const totalChenhLenh: any[] = [];
      const totalDanChieu: any[] = [];
      let unitPrice: any = 0;
      adjustTable.forEach((el: any, index: any) => {
        const foundStoredAsset = storedAssets.find(
          (item: any) => item.assetId === el.storedAssetId
        );

        const priceInPlan = foundStoredAsset ? foundStoredAsset.priceInPlan : 0;

        const PriceChenhLech = Math.round(
          (totalRatios[index] * priceInPlan) / 100
        );

        const PriceDanChieu = Math.round(priceInPlan + PriceChenhLech);

        totalChenhLenh.push(Math.abs(PriceChenhLech));
        totalDanChieu.push(PriceDanChieu);
      });

      const _tmpDanChieu = totalDanChieu.slice(1);

      unitPrice =
        _tmpDanChieu.length > 0
          ? Math.round(
              _tmpDanChieu.reduce((sum, a) => sum + a, 0) /
                (_tmpDanChieu.length * 10000)
            ) * 10000
          : 0;

      return unitPrice;
    }, [adjustTable, storedAssets, CalTotalRatio]);

    useEffect(() => {
      if (Object.keys(data).length > 0) {
        const _data = { ...mockData1 };

        for (let index = 0; index < data.note; index++) {
          const item = data.note[index];
          _data[`note${index + 1}`] = item;
        }
        _data.areaWidth = data.areaWidth;
        _data.rentRatio = data.rentRatio;
        _data.areaRent = data.areaRent;
        _data.growthSpeed = data.growthSpeed;
        _data.discountRate = data.discountRate;
        _data.remainYears = data.remainYears;
        _data.assumeGrowthSpeed = data.assumeGrowthSpeed;
        _data.unitPriceMarket = data.unitPriceMarket;
        _data.unitPriceState = data.unitPriceState;
        _data.rentIncome = data.rentIncome;
        _data.profitAfterTax = data.profitAfterTax;
        _data.landTax = data.landTax;
        _data.monthsInFirstYear = data.monthsInFirstYear;

        if (count < 1) {
          form.setValues(_data);
          setCount(count + 1);
        } else
          form.setValues({ ...form.values, unitPriceMarket: CalUnitPrice() });
      }
    }, [data, CalUnitPrice]);

    useEffect(() => {
      const rentIncome =
        Number(form.values.unitPriceMarket) *
        Number(form.values.areaWidth || 0);

      const newData = {
        ...form.values,
        areaWidth: form.values.areaWidth,
        areaRent:
          Number(form.values.areaWidth || 0) *
          (Number(form.values.rentRatio || 0) / 100),
        rentIncome: rentIncome,
        landTax:
          Number(form.values.unitPriceState) *
          Number(form.values.areaWidth || 0),
        profitAfterTax:
          Number(rentIncome) * (1 - Number(form.values.note11) / 100),
      };

      form.setValues(newData);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      form.values.areaWidth,
      form.values.rentRatio,
      form.values.unitPriceMarket,
      form.values.unitPriceState,
      form.values.note11,
    ]);

    const convertDataToUpdate = () => {
      const convertedData: any = {
        areaWidth: form.values.areaWidth,
        rentRatio: form.values.rentRatio,
        areaRent: form.values.areaRent,
        growthSpeed: form.values.growthSpeed,
        discountRate: form.values.discountRate,
        remainYears: form.values.remainYears,
        assumeGrowthSpeed: form.values.assumeGrowthSpeed,
        unitPriceMarket: form.values.unitPriceMarket,
        unitPriceState: form.values.unitPriceState,
        rentIncome: form.values.rentIncome,
        profitAfterTax: form.values.profitAfterTax,
        landTax: form.values.landTax,
        note: [],
      };

      for (const key in form.values) {
        if (key.includes("note")) convertedData.note.push(form.values[key]);
      }

      return { ...data, ...convertedData };
    };

    return (
      <Form labelWrap labelAlign="left" size="small">
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Form>
    );
  }
);
export default RentalCashFlow;
