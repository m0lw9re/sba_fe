import { CollapseCustom } from "components/CollapseCustom";
import { TableKQDatType, TablePPType } from "constant/types/appraisalFile";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Result } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermissionUseWaterVehicle/Result";
import { ExpertiseWaterVehicleMethod } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermissionUseWaterVehicle/ExpertiseWaterVehicleMethod";

type Props = {
  tablePP: Array<TablePPType>;
  tableKQDat: Array<TableKQDatType>;
};

type RefProps = {
  onUpdate: () => void;
};

export const PermissionUseWaterVehicle = forwardRef<RefProps, Props>(
  ({ tablePP, tableKQDat }, ref) => {
    const btnRefExpertiseWaterVehicleMethod = useRef<{
      updateExpertiseWaterVehicleMethod: () => void;
    }>(null);

    useImperativeHandle(ref, () => ({
      onUpdate: handleUpdatePermissionUseWaterVehicle,
    }));

    const handleUpdatePermissionUseWaterVehicle = async () => {
      const tablePPResult =
        await btnRefExpertiseWaterVehicleMethod.current?.updateExpertiseWaterVehicleMethod();

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
              <ExpertiseWaterVehicleMethod
                ref={btnRefExpertiseWaterVehicleMethod}
                tablePP={tablePP}
              />
            ),
          },
          {
            label: "Kết quả chi tiết",
            key: "2",
            children: <Result tableKQDat={tableKQDat} />,
          },
        ]}
      />
    );
  }
);
