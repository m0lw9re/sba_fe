import { CollapseCustom } from "components/CollapseCustom";
import { ExpertiseLandMethod } from "./component/ExpertiseLandMethod";
import { Result } from "./component/Result";
import {
  TableKQCTXDType,
  TableKQDatType,
  TablePPType,
  TableTongType,
} from "constant/types/appraisalFile";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ResultEstimate } from "./component/ResultByAsset/Estimate";
import { ResultLand } from "./component/ResultByAsset/Land";

type Props = {
  tablePP: Array<TablePPType>;
  tableKQDat: Array<TableKQDatType>;
  tableKQCTXD: Array<TableKQCTXDType>;
  tableTong?: TableTongType;
  assetLevelTwoId?: number;
  fileStatus?: number;
};

type RefProps = {
  updatePermissionUseLand: () => void;
};

export const PermissionUseLand = forwardRef<RefProps, Props>(
  (
    {
      tablePP,
      tableKQDat,
      tableKQCTXD,
      tableTong,
      assetLevelTwoId,
      fileStatus,
    },
    ref
  ) => {
    const btnRefExpertiseLandMethod = useRef<{
      updateExpertiseLandMethod: () => void;
    }>(null);

    useImperativeHandle(ref, () => ({
      updatePermissionUseLand: handleUpdatePermissionUseLand,
    }));

    const handleUpdatePermissionUseLand = async () => {
      const tablePPResult =
        await btnRefExpertiseLandMethod.current?.updateExpertiseLandMethod();

      return tablePPResult;
    };

    const renderResultByAssetType = () => {
      switch (assetLevelTwoId) {
        // BDS
        case 1:
          return (
            <ResultLand tableKQDat={tableKQDat} tableKQCTXD={tableKQCTXD} />
          );
        // du toan
        case 9:
          return (
            <ResultEstimate
              tableKQDat={tableKQDat}
              tableKQCTXD={tableKQCTXD}
              tableTong={tableTong}
            />
          );
        default:
          return (
            <Result
              tableKQDat={tableKQDat}
              tableKQCTXD={tableKQCTXD}
              tableTong={tableTong}
              assetLevelTwoId={assetLevelTwoId}
            />
          );
      }
    };

    return (
      <CollapseCustom
        isInner
        defaultActiveKey={["1", "2"]}
        itemList={[
          {
            label: "Phương pháp",
            key: "1",
            children: (
              <ExpertiseLandMethod
                ref={btnRefExpertiseLandMethod}
                tablePP={tablePP}
                fileStatus={fileStatus}
              />
            ),
          },
          {
            label: "Kết quả chi tiết",
            key: "2",
            children: renderResultByAssetType(),
          },
        ]}
      />
    );
  }
);
