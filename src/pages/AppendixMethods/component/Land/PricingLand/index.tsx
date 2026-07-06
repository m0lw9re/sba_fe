import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { isNumber } from "lodash";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useGetDataGrowTable } from "utils/request/useAppraisalFileDetail";

type Props = {
  prices: any;
  adjustTable: any[];
  storedAssets: any[];
  assetLandRentFlowDto: any;
  assetLevelTwoId: number | undefined;
  isHaveRealAreaUnPlan: boolean;
};

type RefProps = {
  updatePricing: () => void;
};

const { INPUT_NUMBER } = TYPE_FIELD;
const css = { xs: 24, lg: 12 };
const labelCol = { xs: 9, lg: 9 };
const wrapperCol = { xs: 15, lg: 15 };

export const PricingLand = forwardRef<RefProps, Props>(
  (
    {
      prices,
      // adjustTable,
      // storedAssets,
      assetLandRentFlowDto,
      assetLevelTwoId,
      isHaveRealAreaUnPlan,
    },
    ref
  ) => {
    const unitPriceStore = useSelector(
      (state: RootState) => state.appendixMethodsSlice.unitPrice
    );
    const [priceForm, setPriceForm] = useState({
      unitPriceInPlan: 0,
      unitPriceUnPlan: 0,
      totalValueContructionFuture: 0,
    });
    const isValidate = assetLevelTwoId === 1;
    const inputsEl = useRef<HTMLDivElement>(null);
    const [count, setCount] = useState(0);

    const { data: dataGrowTable } = useGetDataGrowTable(assetLandRentFlowDto);

    useImperativeHandle(ref, () => ({
      updatePricing: () => {
        if (isValidate) {
          if (
            !isNumber(priceForm.unitPriceInPlan) ||
            (!isNumber(priceForm.unitPriceUnPlan) && isHaveRealAreaUnPlan)
          ) {
            inputsEl.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            inputsEl.current?.focus({ preventScroll: true });
            return null;
          }
        }

        setCount(0);
        return {
          ...priceForm,
          unitPriceInPlan: Math.round(priceForm.unitPriceInPlan),
          unitPriceUnPlan: Math.round(priceForm.unitPriceUnPlan),
        };
      },
    }));

    // const CalTotalRatio = useCallback(
    //   (isAbs = false) => {
    //     let totalRatios: any[] = [];
    //     adjustTable.forEach((el: any) => {
    //       const totalRatio = el.adjustTable?.reduce((sum: number, a: any) => {
    //         const _ratio = a.ratio ? Number(a.ratio) : 0;

    //         return sum + (isAbs ? Math.abs(_ratio) : _ratio);
    //       }, 0);
    //       totalRatios.push(totalRatio.toFixed(3));
    //     });

    //     return totalRatios;
    //   },
    //   [JSON.stringify(adjustTable)]
    // );

    // const CalUnitPrice = useCallback(() => {
    //   const totalRatios = CalTotalRatio(false);
    //   const totalChenhLenh: any[] = [];
    //   const totalDanChieu: any[] = [];
    //   let unitPrice: any = 0;
    //   adjustTable.forEach((el: any, index) => {
    //     const foundStoredAsset = storedAssets.find(
    //       (item: any) => item.assetId === el.storedAssetId
    //     );

    //     const priceInPlan = foundStoredAsset ? foundStoredAsset.priceInPlan : 0;

    //     const PriceChenhLech = Math.round(
    //       (totalRatios[index] * priceInPlan) / 100
    //     );

    //     const PriceDanChieu = Math.round(priceInPlan + PriceChenhLech);

    //     totalChenhLenh.push(Math.abs(PriceChenhLech));
    //     totalDanChieu.push(PriceDanChieu);
    //   });

    //   const _tmpDanChieu = totalDanChieu.slice(1);

    //   unitPrice =
    //     _tmpDanChieu.length > 0
    //       ? Math.round(
    //           _tmpDanChieu.reduce((sum, a) => sum + a, 0) /
    //             (_tmpDanChieu.length * 10000)
    //         ) * 10000
    //       : 0;

    //   return unitPrice;
    // }, [JSON.stringify(adjustTable), storedAssets, CalTotalRatio]);

    useEffect(() => {
      const _priceForm = {
        //unitPriceInPlan: prices?.unitPriceInPlan || 0,
        //unitPriceUnPlan: prices?.unitPriceUnPlan || 0,
        unitPriceInPlan: prices?.unitPriceInPlanApproved || 0,
        unitPriceUnPlan: prices?.unitPriceUnPlanApproved || 0,
        totalValueContructionFuture:
          prices?.totalValueContructionFutureApproved || 0,
      };

      if (assetLandRentFlowDto) {
        // phụ lục phương pháp thu nhập
        const unitPrice = dataGrowTable?.growthTableUnitPrice || 0;

        if (dataGrowTable?.growthTable?.length > 0) {
          if (count < 1) {
            setPriceForm((prev) => ({
              ...prev,
              ..._priceForm,
            }));
            setCount(count + 1);
          } else {
            setPriceForm((prev) => ({
              ...prev,
              ..._priceForm,
              unitPriceInPlan: unitPrice,
            }));
          }
        }
      } else {
        // phụ lục phương pháp so sách
        try {
          const unitPrice = unitPriceStore || 0;

          if (count < 2 && _priceForm.unitPriceInPlan) {
            setPriceForm((prev) => ({ ...prev, ..._priceForm }));
            setCount(count + 1);
          } else {
            setPriceForm((prev) => ({
              ...prev,
              ..._priceForm,
              unitPriceInPlan: unitPrice,
            }));
          }
        } catch (error: any) {
          setPriceForm((prev) => ({ ...prev, ..._priceForm }));
        }
      }
    }, [prices, dataGrowTable, unitPriceStore]);

    const inputFields: InputFiledParams[] = [
      {
        key: 1,
        label: "Đơn giá QSDĐ phù hợp QH (đồng/m²)",
        type: INPUT_NUMBER,
        css,
        labelCol,
        wrapperCol,
        value: Math.round(priceForm.unitPriceInPlan),
        onChange: (value: number) =>
          setPriceForm({ ...priceForm, unitPriceInPlan: value || 0 }),
        require: true,
        error:
          priceForm.unitPriceInPlan === null || priceForm.unitPriceInPlan < 0
            ? "Đơn giá QSDĐ phù hợp QH không được để trống"
            : "",
        touched:
          (priceForm.unitPriceInPlan === null ||
            priceForm.unitPriceInPlan < 0) &&
          isValidate,
        currencable: true,
        isRounded: true,
      },
      {
        key: 2,
        label: "Đơn giá QSDĐ không phù hợp QH (đồng/m²)",
        css,
        labelCol,
        wrapperCol,
        type: INPUT_NUMBER,
        value: priceForm.unitPriceUnPlan,
        onChange: (value: number) =>
          setPriceForm({ ...priceForm, unitPriceUnPlan: value || 0 }),
        error:
          priceForm.unitPriceUnPlan === null || priceForm.unitPriceUnPlan < 0
            ? "Đơn giá QSDĐ không phù hợp QH không được để trống"
            : "",
        touched:
          (priceForm.unitPriceUnPlan === null ||
            priceForm.unitPriceUnPlan < 0) &&
          isHaveRealAreaUnPlan &&
          isValidate,
        require: true,
        currencable: true,
        isRounded: true,
        min: 0,
      },
      // Dự toán - thêm trường Công trình xây dựng hình thành trong tương lai
      {
        ...(assetLevelTwoId === 9 &&
          ({
            key: 3,
            label:
              "Tổng giá trị CTXD hình thành trong tương lai - tham khảo (đồng)",
            css,
            labelCol,
            wrapperCol,
            type: INPUT_NUMBER,
            value: priceForm.totalValueContructionFuture,
            onChange: (value: number) =>
              setPriceForm({
                ...priceForm,
                totalValueContructionFuture: value || 0,
              }),
            require: true,
            currencable: true,
            isRounded: true,
            min: 0,
          } as any)),
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
export default memo(PricingLand);
