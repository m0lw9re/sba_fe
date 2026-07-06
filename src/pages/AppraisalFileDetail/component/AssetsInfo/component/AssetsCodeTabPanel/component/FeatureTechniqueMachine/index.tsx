import { Button, Space, Tabs, message } from "antd";
import FeatureTechniqueMachineTab from "./component/FeatureTechniqueMachineTab";
import "./style.scss";
import {
  createRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Icons from "assets/icons";
import { AssetMachineDeviceInforType } from "constant/types/appraisalFile";
import { isDeepEqual, randomId } from "utils";
import InputFields from "components/InputFields";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { ASSET_LV3, TYPE_FIELD } from "constant/enums";
import { CollapseCustom } from "components/CollapseCustom";
import OtherInfoMachine from "../OrtherInforMachine";
import RepairWarrantyInfo from "../RepairWarrantyInfo";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validLengthInput } from "utils/validate";
import renderRequired from "components/RenderRequire";

const { INPUT } = TYPE_FIELD;

type RefProps = {
  updateFeatureMachineDeviceinfor: () => void;
};
type FormType = {
  productLineName: string;
}
type Props = {
  assetMachineInfos: Array<AssetMachineDeviceInforType>;
  productLineName: string | null;
  assetId: string | null;
  assetLevelThreeId: number;
  assetCode: string;
  index: number;
};

const assetMachineInfoInit: AssetMachineDeviceInforType = {
  assetMachineInforId: null,
  assetId: null,
  legalName: null,
  legalBrand: null,
  legalModel: null,
  legalColor: null,
  legalYearMfg: null,
  legalCountryMfgId: null,
  legalMfr: null,
  legalPower: null,
  legalControlType: null,
  legalSize: null,
  legalSpecs: null,
  legalEngine: null,
  legalElectricEngine: null,
  legalMainEngine: null,
  legalEngineSystem: null,
  legalCommonMachine: null,
  legalOtherContent: null,
  legalEngineNo: null,
  realName: null,
  realBrand: null,
  realModel: null,
  realColor: null,
  realYearMfg: null,
  realCountryMfgId: null,
  realMfr: null,
  realPower: null,
  realControlType: null,
  realSize: null,
  realSpecs: null,
  realEngine: null,
  realElectricEngine: null,
  realMainEngine: null,
  realEngineSystem: null,
  realCommonMachine: null,
  realOtherContent: null,
  realEngineNo: null,
  currentUseSituation: null,
  dayUse: null,
  disputeInfor: null,
  liquidity: null,
  note: null,
  remainQuality: null,
  usingOrigin: "",
  repairHistories: [],
};

const FeatureTechniqueMachine = forwardRef<RefProps, Props>(
  (
    {
      assetMachineInfos,
      productLineName,
      assetId,
      assetLevelThreeId,
      assetCode,
      index,
    },
    ref
  ) => {
    const [listTab, setListTab] = useState<Array<AssetMachineDeviceInforType>>(
      []
    );
    const [activeTab, setActiveTab] = useState<string>("0");

    const btnRefUpdateFeatureMachineDevicetemList = useRef<any>([]);
    // Thông tin sửa chữa và bảo hành
    const btnRepairHistoryInfors = useRef<any>([]);
    const btnRefOtherDeviceMachineInfor = useRef<any>([]);
    const form = useFormik<FormType>({
      initialValues: {
        productLineName: productLineName || "",
      } as FormType,
      validationSchema: Yup.object().shape({
        productLineName: Yup.string()
          .required("Vui lòng nhập tên DCSX")
          .test("productLineName", "Chỉ được nhập 500 ký tự", (val) =>
            validLengthInput(val, 500)
          )}),
      validateOnChange: true,
      onSubmit: async (data: FormType) => {
        return data;
      },
    });
    useImperativeHandle(ref, () => ({
      updateFeatureMachineDeviceinfor: async () => {
        let resArray: any = [];
        let resError: boolean = false;
        const formData = await form.submitForm();
        if (!formData && assetLevelThreeId === ASSET_LV3.PRODUCTION_LINE) {
          resError = true;
          message.error(`Vui lòng kiểm tra thông tin tên DCXS tại tài sản số ${index + 1} (${assetCode}).`);
          return;
        }
        for (
          let i = 0;
          i < btnRefUpdateFeatureMachineDevicetemList.current?.length;
          i++
        ) {
          const errorMessageShowAssetLocate = `MMTB số ${
            i + 1
          } tại tài sản số ${index + 1} (${assetCode}).`;
          const [res, validErrors] =
            await btnRefUpdateFeatureMachineDevicetemList.current[
              i
            ].current?.btnRefUpdateFeatureMachineDeviceItem();
          if (validErrors) {
            resError = true;
            message.error(
              `Vui lòng kiểm tra thông tin ${errorMessageShowAssetLocate}`
            );
            setActiveTab(i.toString());
            break;
          }
          const otherInfoData: any =
            await btnRefOtherDeviceMachineInfor?.current[
              i
            ].current?.updateOtherInfoMachineDevice();
          if (!otherInfoData) {
            resError = true;
            message.error(
              `Vui lòng kiểm tra thông tin khác ${errorMessageShowAssetLocate}`
            );
            setActiveTab(i.toString());
          }

          const repairHistoryData: any = await btnRepairHistoryInfors.current[
            i
          ].current?.updateRepairHistory();

          resArray.push({
            ...res,
            ...otherInfoData,
            ...(repairHistoryData ? { ...repairHistoryData } : {}),
          });
        }

        // stop update logic
        if (resError) {
          return undefined;
        }

        return {
          assetMachineInfors: resArray,
          productLineName: formData?.productLineName || "",
        };
      },
    }));

    useEffect(() => {
      if (assetMachineInfos?.length > 0) {
        setListTab(
          assetMachineInfos.map((item) => ({
            ...item,
            id: randomId(),
            assetId: assetId,
          }))
        );
      } else if (assetMachineInfos?.length === 0) {
        setListTab([
          {
            ...assetMachineInfoInit,
            id: randomId(),
            assetId: assetId,
          },
        ]);
      }
    }, [assetMachineInfos]);

    if (
      btnRefUpdateFeatureMachineDevicetemList.current.length !== listTab.length
    ) {
      // add or remove refs
      btnRefUpdateFeatureMachineDevicetemList.current = Array(listTab.length)
        .fill(null)
        .map(
          (_, i) =>
            btnRefUpdateFeatureMachineDevicetemList.current[i] ||
            createRef<{ btnRefUpdateFeatureMachineDeviceItem: () => void }>()
        );
    }
    if (btnRefOtherDeviceMachineInfor.current.length !== listTab.length) {
      // add or remove refs
      btnRefOtherDeviceMachineInfor.current = Array(listTab.length)
        .fill(null)
        .map(
          (_, i) =>
            btnRefOtherDeviceMachineInfor.current[i] ||
            createRef<{ updateOtherInfoMachineDevice: () => void }>()
        );
    }
    if (btnRepairHistoryInfors.current.length !== listTab.length) {
      // add or remove refs
      btnRepairHistoryInfors.current = Array(listTab.length)
        .fill(null)
        .map(
          (_, i) =>
            btnRepairHistoryInfors.current[i] ||
            createRef<{ updateRepairHistory: () => void }>()
        );
    }

    const input: InputFiledParams[] = [
      {
        key: 1,
        label: renderRequired("Tên dây chuyền"),
        type: INPUT,
        allowClear: false,
        placeholder: "Nhập",
        css: { xs: 24 },
        labelCol: { xs: 24, md: 4 },
        wrapperCol: { xs: 24, md: 20 },
        value: form.values.productLineName,
        error: form.errors.productLineName,
        touched: form.touched.productLineName,
        onChange: (e: any) => {
          form.setValues({ ...form.values, productLineName: e.target.value });
        },
      },
    ];

    return (
      <div className="feature-techMachine-tab-wrapper">
        {assetLevelThreeId === ASSET_LV3.PRODUCTION_LINE && (
          <InputFields data={input} />
        )}
        <Tabs
          className="feature-techniMachine-tab-custom"
          items={listTab.map((item, index) => {
            let btn = (
              <Button
                type="primary"
                style={{ borderRadius: "50%" }}
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  setListTab((prev) => {
                    const temp = [...prev];
                    temp.splice(index, 1);
                    return temp;
                  });
                  setActiveTab(
                    [...listTab].length - 1 === index
                      ? ([...listTab].length - 2).toString()
                      : index.toString()
                  );
                }}
                icon={<Icons.sub />}
                size="small"
              />
            );
            if (index === 0)
              btn = (
                <Button
                  type="primary"
                  style={{ borderRadius: "50%", background: "#2862af" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setListTab((prev) => [
                      ...prev,
                      { ...assetMachineInfoInit, assetId: assetId },
                    ]);
                  }}
                  icon={<Icons.add />}
                  size="small"
                />
              );
            return {
              key: index.toString(),
              forceRender: true,
              label: (
                <Space>
                  <span>MMTB {index + 1}</span>
                  {btn}
                </Space>
              ),
              children: (
                <Space size={"small"} direction="vertical">
                  <FeatureTechniqueMachineTab
                    ref={btnRefUpdateFeatureMachineDevicetemList.current[index]}
                    data={item}
                  />
                  <CollapseCustom
                    isInner
                    itemList={[
                      {
                        label: "Thông tin khác",
                        forceRender: true,
                        children: (
                          <OtherInfoMachine
                            ref={btnRefOtherDeviceMachineInfor.current[index]}
                            otherInfor={{
                              currentUseSituation: item.currentUseSituation,
                              disputeInfor: item.disputeInfor,
                              liquidity: item.liquidity,
                              note: item.note,
                              remainQuality: item.remainQuality,
                              usingOrigin: item.usingOrigin,
                              dayUse: item.dayUse,
                            }}
                          />
                        ),
                      },
                      {
                        label: "Thông tin sửa chữa và bảo hành",
                        children: (
                          <RepairWarrantyInfo
                            ref={btnRepairHistoryInfors.current[index]}
                            assetId={assetId}
                            repairHistories={item.repairHistories}
                          />
                        ),
                      },
                    ]}
                  />
                </Space>
              ),
            };
          })}
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
        />
      </div>
    );
  }
);

export default memo(FeatureTechniqueMachine, (prevProps, nextProps) => {
  return (
    isDeepEqual(prevProps.assetMachineInfos, nextProps.assetMachineInfos) &&
    prevProps.assetLevelThreeId === nextProps.assetLevelThreeId
  );
});
