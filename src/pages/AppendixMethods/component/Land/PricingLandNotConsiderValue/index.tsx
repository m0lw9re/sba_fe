import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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

export const PricingLandNotConsiderValue = forwardRef<RefProps, Props>(
  ({ prices }, ref) => {
    const [priceForm, setPriceForm] = useState({
      unitPriceAreaNotConsiderValue: 0,
    });
    const inputsEl = useRef<HTMLDivElement>(null);
    const [count, setCount] = useState(0);

    useImperativeHandle(ref, () => ({
      updatePricing: () => {
        setCount(0);
        return {
          ...priceForm,
          unitPriceAreaNotConsiderValue: Math.round(
            priceForm.unitPriceAreaNotConsiderValue
          ),
        };
      },
    }));

    useEffect(() => {
      const _priceForm = {
        unitPriceAreaNotConsiderValue:
          prices?.unitPriceAreaNotConsiderValue || 0,
      };

      // phụ lục phương pháp so sách
      try {
        // const unitPrice = unitPriceStore || 0;

        if (count < 2 && _priceForm.unitPriceAreaNotConsiderValue) {
          setPriceForm((prev) => ({ ...prev, ..._priceForm }));
          setCount(count + 1);
        } else {
          setPriceForm((prev) => ({
            ...prev,
            ..._priceForm,
            // unitPriceAreaNotConsiderValue: unitPrice,
          }));
        }
      } catch (error: any) {
        setPriceForm((prev) => ({ ...prev, ..._priceForm }));
      }
    }, [prices]);

    const inputFields: InputFiledParams[] = [
      {
        key: 1,
        label: "Đơn giá (đồng/m²)",
        type: INPUT_NUMBER,
        css,
        labelCol,
        wrapperCol,
        value: Math.round(priceForm.unitPriceAreaNotConsiderValue),
        onChange: (value: number) =>
          setPriceForm({
            ...priceForm,
            unitPriceAreaNotConsiderValue: value || 0,
          }),
        require: true,
        // error:
        //   priceForm.unitPriceAreaNotConsiderValue === null ||
        //   priceForm.unitPriceAreaNotConsiderValue < 0
        //     ? "Đơn giá QSDĐ phù hợp QH không được để trống"
        //     : "",
        // touched:
        //   (priceForm.unitPriceAreaNotConsiderValue === null ||
        //     priceForm.unitPriceAreaNotConsiderValue < 0) &&
        //   isValidate,
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
          <Row gutter={[12, 12]} ref={inputsEl}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
      </Space>
    );
  }
);
export default memo(PricingLandNotConsiderValue);
