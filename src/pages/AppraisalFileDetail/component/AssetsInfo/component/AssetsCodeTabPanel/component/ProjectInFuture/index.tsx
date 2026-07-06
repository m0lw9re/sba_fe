import { Card, Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import {
  AssetProjectInFutureType,
  FutureInfoType,
  ProjectInFutureOthersType,
} from "constant/types/appraisalFile";
import { InputFiledParams } from "constants/types/Form_Field_type";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { isDeepEqual } from "utils";
import ConstructionChecklists from "./ConstructionChecklists";
import ConstructionFutureInfors from "./ConstructionFutureInfors";
import FutureInfo from "./FutureInfo";
import ProjectInFutureOthers from "./ProjectInFutureOthers";
import "./style.scss";
const { INPUT, INPUT_NUMBER, TEXT_AREA } = TYPE_FIELD;

type RefProps = {
  getData: () => void;
};
type Props = {
  data: AssetProjectInFutureType;
};
type PartInputsType = {
  numOfUnderFloors: string;
  basementFloor: string;
  depth: string;
  constructionFloor: string;
  constructionArea: string;
};

const othersDataInit: ProjectInFutureOthersType = {
  turnPart: "",
  solePart: "",
  towerPart: "",
  constructionTitle: "",
  architectualSolution: "",
  estimateComment: "",
  interior: "",
  structuralSolution: "",
  systemEngineering: "",
  systemTraffic: "",
};
const partInputsInit: PartInputsType = {
  numOfUnderFloors: "",
  basementFloor: "",
  depth: "",
  constructionFloor: "",
  constructionArea: "",
};

const css = { xs: 24, md: 12, lg: 12 };
const labelCol = { xs: 24, md: 12 };
const wrapperCol = { xs: 24, md: 12 };

const ProjectInFuture = forwardRef<RefProps, Props>(
  ({ data: assetLandInfoData }, ref) => {
    const [othersData, setOthersData] =
      useState<ProjectInFutureOthersType>(othersDataInit);
    const [contructionFutureText, setContructionFutureText] =
      useState<string>("");
    const [partInputsValue, setPartInputsValue] =
      useState<PartInputsType>(partInputsInit);
    const futureInfoRef = useRef<{
      getData: () => any;
    }>(null);
    const constructionFutureInforsRef = useRef<{
      getData: () => any;
    }>(null);
    const constructionCheckListsRef = useRef<{
      getData: () => any;
    }>(null);

    const handleOthersDataChange = useCallback(
      (data: any) => {
        setOthersData((prev) => ({ ...prev, ...data }));
      },
      [setOthersData]
    );
    const handlePartInputsChange = (data: any) => {
      setPartInputsValue((prev) => ({ ...prev, ...data }));
    };

    const inputConstructionFutureName: InputFiledParams[] = useMemo(() => {
      return [
        {
          key: 1,
          label: "Công trình xây dựng hình thành trong tương lai",
          type: INPUT,
          css: { xs: 24 },
          labelCol: { xs: 24, md: 4 },
          wrapperCol: { xs: 24, md: 20 },
          value: contructionFutureText || null,
          onChange: (e: any) => setContructionFutureText(e.target.value),
        },
      ];
    }, [contructionFutureText]);
    // phần ngầm
    const embossedPartInputs: InputFiledParams[] = useMemo(() => {
      return [
        {
          key: 10,
          label: "Số tầng",
          type: INPUT_NUMBER,
          css,
          labelCol,
          wrapperCol,
          value: partInputsValue.numOfUnderFloors || null,
          onChange: (value: number) =>
            handlePartInputsChange({ numOfUnderFloors: value }),
          currencable: true,
        },
        {
          key: 11,
          label: "Cốt sàn tầng hầm 1 (m)",
          type: INPUT_NUMBER,
          css,
          labelCol,
          wrapperCol,
          value: partInputsValue.basementFloor || null,
          onChange: (value: number) =>
            handlePartInputsChange({ basementFloor: value }),
          currencable: true,
        },
        {
          key: 12,
          label: "Chiều sâu công trình (m)",
          type: INPUT_NUMBER,
          css,
          labelCol,
          wrapperCol,
          value: partInputsValue.depth || null,
          onChange: (value: number) => handlePartInputsChange({ depth: value }),
          currencable: true,
        },
        {
          key: 12.1,
        },
      ];
    }, [
      partInputsValue?.numOfUnderFloors,
      partInputsValue?.basementFloor,
      partInputsValue?.depth,
    ]);
    // phần nổi
    const undergroundPartInputs: InputFiledParams[] = useMemo(() => {
      return [
        {
          key: 13,
          label: "Cốt sàn xây dựng tầng 1 (m)",
          type: INPUT_NUMBER,
          css,
          value: partInputsValue.constructionFloor || null,
          onChange: (value: number) =>
            handlePartInputsChange({ constructionFloor: value }),
          currencable: true,
        },
        {
          key: 14,
          label: "Diện tích xây dựng (m²)",
          type: INPUT_NUMBER,
          css,
          value: partInputsValue.constructionArea || null,
          onChange: (value: number) =>
            handlePartInputsChange({ constructionArea: value }),
          currencable: true,
        },
      ];
    }, [partInputsValue?.constructionFloor, partInputsValue?.constructionArea]);

    useImperativeHandle(ref, () => ({
      getData: async () => {
        const constructionFutureInfors =
          await constructionFutureInforsRef.current?.getData();
        const constructionChecklists =
          await constructionCheckListsRef.current?.getData();
        const [futureInfoData, futureInfoErrors] =
          await futureInfoRef.current?.getData();
        if (!futureInfoData) return;
        return [
          {
            ...assetLandInfoData,
            ...othersData,
            ...futureInfoData,
            ...partInputsValue,
            contructionFutureText,
            constructionFutureInfors,
            constructionChecklists,
          },
          futureInfoErrors,
        ];
      },
    }));

    useEffect(() => {
      if (!assetLandInfoData) return;
      setOthersData({
        turnPart: assetLandInfoData.turnPart,
        solePart: assetLandInfoData.solePart,
        towerPart: assetLandInfoData.towerPart,
        constructionTitle: assetLandInfoData.constructionTitle,
        architectualSolution: assetLandInfoData.architectualSolution,
        estimateComment: assetLandInfoData.estimateComment,
        interior: assetLandInfoData.interior,
        structuralSolution: assetLandInfoData.structuralSolution,
        systemEngineering: assetLandInfoData.systemEngineering,
        systemTraffic: assetLandInfoData.systemTraffic,
      });
      setContructionFutureText(assetLandInfoData.contructionFutureText || "");
      setPartInputsValue({
        numOfUnderFloors: assetLandInfoData.numOfUnderFloors,
        basementFloor: assetLandInfoData.basementFloor,
        depth: assetLandInfoData.depth,
        constructionFloor: assetLandInfoData.constructionFloor,
        constructionArea: assetLandInfoData.constructionArea,
      });
    }, [assetLandInfoData]);

    return (
      <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
        <Row gutter={[8, 8]} style={{ width: "100%" }}>
          <InputFields data={inputConstructionFutureName} />
        </Row>
        <ConstructionFutureInfors
          data={assetLandInfoData?.constructionFutureInfors || []}
          ref={constructionFutureInforsRef}
        />
        <Form labelAlign="left" labelWrap size="small" layout="inline">
          <FutureInfo
            data={{
              totalArea: assetLandInfoData.totalArea,
              buildingDensity: assetLandInfoData.buildingDensity,
              coeffcientsUsed: assetLandInfoData.coeffcientsUsed,
              height: assetLandInfoData.height,
              totalFloorArea: assetLandInfoData.totalFloorArea,
              numOfFloors: assetLandInfoData.numOfFloors,
              totalApartments: assetLandInfoData.totalApartments,
              underTankArea: assetLandInfoData.underTankArea,
              wasteTankArea: assetLandInfoData.wasteTankArea,
            }}
            ref={futureInfoRef}
          />
          <Space
            direction="vertical"
            size={"small"}
            style={{ width: "100%", margin: "10px 0" }}
          >
            <Card size="small" className="future-form-wrapper">
              <Space
                size={"small"}
                direction="vertical"
                className="future-form-wrapper-content"
              >
                <h4 className="future-form-header">Phần ngầm</h4>
                <Row gutter={[8, 8]}>
                  <InputFields data={embossedPartInputs} />
                </Row>
              </Space>
            </Card>
            <Card size="small" className="future-form-wrapper">
              <Space
                size={"small"}
                direction="vertical"
                className="future-form-wrapper-content"
              >
                <h4 className="future-form-header">Phần nổi</h4>
                <Row gutter={[8, 8]}>
                  <InputFields data={undergroundPartInputs} />
                </Row>
              </Space>
            </Card>
          </Space>
          <ProjectInFutureOthers
            data={othersData}
            onChange={handleOthersDataChange}
          />
        </Form>
        <ConstructionChecklists
          data={assetLandInfoData?.constructionChecklists || []}
          ref={constructionCheckListsRef}
        />
      </Space>
    );
  }
);
export default memo(ProjectInFuture, (prevProps, nextProps) =>
  isDeepEqual(prevProps.data, nextProps.data)
);
