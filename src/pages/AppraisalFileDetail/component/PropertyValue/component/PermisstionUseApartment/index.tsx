import { CollapseCustom } from "components/CollapseCustom";
import { ExpertiseLandMethod } from "./component/ExpertiseLandMethod";
import { Result } from "./component/Result";
import { TableKQType, TablePPType } from "constant/types/appraisalFile";
import { forwardRef, useImperativeHandle, useRef } from "react";

type Props = {
  tablePP: Array<TablePPType>;
  tableKQ: Array<TableKQType>;
};

type RefProps = {
  updatePermissionUseLand: () => void;
};

export const PermissionUseApartment = forwardRef<RefProps, Props>(
  ({ tablePP, tableKQ }, ref) => {
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
              />
            ),
          },
          {
            label: "Kết quả chi tiết",
            key: "2",
            children: <Result tableKQ={tableKQ} />,
          },
        ]}
      />
    );
  }
);
