import { CollapseCustom } from "components/CollapseCustom";
import {
  TableKQDatType,
  TablePPType,
} from "constant/types/appraisalFile";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ExpertiseRoadVehicleMethod } from "./ExpertiseRoadVehicleMethod";
import { Result } from "./Result";

type Props = {
  tablePP: Array<TablePPType>;
  tableKQDat: Array<TableKQDatType>;
};

type RefProps = {
  onUpdate: () => void;
};

export const PermissionUseRoadVehicle = forwardRef<RefProps, Props>(
  ({ tablePP, tableKQDat }, ref) => {
    const btnRefExpertiseRoadVehicleMethod = useRef<{
      updateExpertiseRoadVehicleMethod: () => void;
    }>(null);

    useImperativeHandle(ref, () => ({
      onUpdate: handleUpdatePermissionUseRoadVehicle,
    }));

    const handleUpdatePermissionUseRoadVehicle = async () => {
      const tablePPResult =
        await btnRefExpertiseRoadVehicleMethod.current?.updateExpertiseRoadVehicleMethod();

      return tablePPResult;
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
              <ExpertiseRoadVehicleMethod
                ref={btnRefExpertiseRoadVehicleMethod}
                tablePP={tablePP}
              />
            ),
          },
          {
            label: "Kết quả chi tiết",
            key: "2",
            children: (
              <Result tableKQDat={tableKQDat}/>
            ),
          },
        ]}
      />
    );
  }
);
