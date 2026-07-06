import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useSelector } from "react-redux";

type Props = {
  prices: any;
};

type RefProps = {
  updatePricing: () => void;
};

const { INPUT_NUMBER } = TYPE_FIELD;
const css = { xs: 24, lg: 12 };
const labelCol = { xs: 9, lg: 9 };
const wrapperCol = { xs: 15, lg: 15 };

export const PricingWaterVehicle = forwardRef<RefProps, Props>(
  ({ prices }, ref) => {
    const unitPriceStore = useSelector(
      (state: RootState) => state.appendixMethodsSlice.unitPrice
    );
    const [priceForm, setPriceForm] = useState({
      unitPrice: 0,
    });

    const [count, setCount] = useState(0);

    useImperativeHandle(ref, () => ({
      updatePricing: () => {
        setCount(0);
        return {
          ...priceForm,
          unitPrice: Math.round(priceForm.unitPrice),
        };
      },
    }));

    useEffect(() => {
      const _priceForm = {
        unitPrice: prices?.unitPriceApproved || 0,
      };

      // phụ lục phương pháp so sách
      try {
        const unitPrice = unitPriceStore || 0;

        if (count < 2 && _priceForm.unitPrice) {
          setPriceForm((prev) => ({ ...prev, ..._priceForm }));
          setCount(count + 1);
        } else {
          setPriceForm((prev) => ({
            ...prev,
            ..._priceForm,
            unitPrice: unitPrice,
          }));
        }
      } catch (error: any) {
        setPriceForm((prev) => ({ ...prev, ..._priceForm }));
      }
    }, [prices, unitPriceStore]);

    // console.log(count, priceForm);

    const inputFields: InputFiledParams[] = [
      {
        key: 1,
        label: "Đơn giá đề xuất (đồng)",
        type: INPUT_NUMBER,
        css,
        labelCol,
        wrapperCol,
        value: Math.round(priceForm.unitPrice),
        onChange: (value: number) =>
          setPriceForm({ ...priceForm, unitPrice: value || 0 }),
        require: true,
        error:
          priceForm.unitPrice === null || priceForm.unitPrice < 0
            ? "Đơn giá cuối cùng"
            : "",
        touched: priceForm.unitPrice === null || priceForm.unitPrice < 0,
        currencable: true,
        isRounded: true,
      },
    ];

    return (
      <Space
        direction="vertical"
        style={{ width: "100%", marginBottom: "8px" }}
        size={"small"}
      >
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[12, 12]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
      </Space>
    );
  }
);
export default memo(PricingWaterVehicle);
