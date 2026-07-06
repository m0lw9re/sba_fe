import { CollapseCustom } from "components/CollapseCustom";
import { TableKQType, TablePPType } from "constant/types/appraisalFile";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Result } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermissionUseMachineDevice/Result";
import { ExpertiseMachineDeviceMethod } from "pages/AppraisalFileDetail/component/PropertyValue/component/PermissionUseMachineDevice/ExpertiseMachineDeviceMethod";

type Props = {
  tablePP: Array<TablePPType>;
  tableKQ: Array<TableKQType>;
  assetLevelThreeId: number;
};

type RefProps = {
  onUpdate: () => void;
};

export const PermissionUseMachineDevice = forwardRef<RefProps, Props>(
  ({ tablePP, tableKQ, assetLevelThreeId }, ref) => {
    const btnRefExpertiseMachineDeviceMethod = useRef<{
      updateExpertiseMachineDeviceMethod: () => void;
    }>(null);

    useImperativeHandle(ref, () => ({
      onUpdate: handleUpdatePermissionUseMachineDevice,
    }));

    const handleUpdatePermissionUseMachineDevice = async () => {
      const tablePPResult =
        await btnRefExpertiseMachineDeviceMethod.current?.updateExpertiseMachineDeviceMethod();

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
              <ExpertiseMachineDeviceMethod
                ref={btnRefExpertiseMachineDeviceMethod}
                tablePP={tablePP}
                assetLevelThreeId={assetLevelThreeId}
              />
            ),
          },
          {
            label: "Kết quả chi tiết",
            key: "2",
            children: (
              <Result tableKQ={tableKQ} assetLevelThreeId={assetLevelThreeId} />
            ),
          },
        ]}
      />
    );
  }
);
