import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useGetDataGrowTable } from "utils/request/useAppraisalFileDetail";

type Props = {
  prices: any;
  adjustTable: any[];
  storedAssets: any[];
  assetLandRentFlowDto: any;
  assetLevelTwoId: number | undefined;
};

type RefProps = {
  updatePricing: () => void;
};

const { INPUT_NUMBER } = TYPE_FIELD;
const css = { xs: 24, lg: 12 };
const labelCol = { xs: 8, lg: 8 };
const wrapperCol = { xs: 16, lg: 16 };

export const PricingApartment = forwardRef<RefProps, Props>(
  (
    {
      prices,
      adjustTable,
      storedAssets,
      assetLandRentFlowDto,
      assetLevelTwoId,
    },
    ref
  ) => {
    const [priceForm, setPriceForm] = useState({
      unitPrice: 0,
    });
    const [count, setCount] = useState(0);

    //const { data: dataGrowTable } = useGetDataGrowTable(assetLandRentFlowDto);

    useImperativeHandle(ref, () => ({
      updatePricing: () => {
        setCount(0);
        return {
          ...priceForm,
          unitPrice: Math.round(priceForm.unitPrice),
        };
      },
    }));

    const CalTotalRatio = useCallback(
      (isAbs = false) => {
        let totalRatios: any[] = [];
        adjustTable.forEach((el: any) => {
          const totalRatio = el.adjustTable?.reduce((sum: number, a: any) => {
            const _ratio = a.ratio ? Number(a.ratio) : 0;

            return sum + (isAbs ? Math.abs(_ratio) : _ratio);
          }, 0);
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
      adjustTable.forEach((el: any, index) => {
        const foundStoredAsset = storedAssets.find(
          (item: any) => item.assetId === el.storedAssetId
        );

        const unitPrice = foundStoredAsset ? foundStoredAsset.unitPrice : 0;

        const PriceChenhLech = Math.round(
          (totalRatios[index] * unitPrice) / 100
        );

        const PriceDanChieu = Math.round(unitPrice + PriceChenhLech);

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
      if (assetLandRentFlowDto) {
        // phụ lục phương pháp thu nhập
        // if (dataGrowTable?.growthTable?.length > 0) {
        //   setPriceForm((prev) => ({
        //     ...prev,
        //     unitPriceInPlan: dataGrowTable?.growthTableUnitPrice,
        //   }));
        // }
      } else {
        // phụ lục phương pháp so sách
        const _priceForm = {
          unitPrice: prices.unitPriceApproved || 0,
        };

        try {
          const unitPrice = CalUnitPrice();

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
      }
    }, [prices, CalUnitPrice]);

    const inputFields: InputFiledParams[] = [
      {
        key: 1,
        label: "Đơn giá QSH căn hộ (đồng/m²)",
        type: INPUT_NUMBER,
        css,
        labelCol,
        wrapperCol,
        value: Math.round(priceForm.unitPrice),
        onChange: (value: number) =>
          setPriceForm({ ...priceForm, unitPrice: value || 0 }),
        require: true,
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
export default PricingApartment;
