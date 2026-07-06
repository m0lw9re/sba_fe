/* eslint-disable react-hooks/exhaustive-deps */
import { ComparedAssetWaterVehicleType } from "constant/types";
import StoredAssetWaterVehicleForm from "pages/PriceShared/AssetCreate/WaterWayVehicle/TableAssetInfo";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { initialValue } from "pages/PriceShared/AssetCreate/WaterWayVehicle/TableAssetInfo/config";
import { isDeepEqual } from "utils";
type Props = {
  assetType: number;
  formType?: "add" | "edit";
  data: ComparedAssetWaterVehicleType;
  assetLevelThreeId: number;
  initAsset?: any;
};
type RefProps = {
  onCreateAsset: () => void;
};
const CreateWaterVehicleForm = forwardRef<RefProps, Props>(
  (props: Props, ref) => {
    const { data: dataEdit, formType, assetLevelThreeId, initAsset } = props;
    const btnSubmitForm = useRef<{
      onSubmit: () => any;
      setValues: (data: ComparedAssetWaterVehicleType[]) => void;
      values: ComparedAssetWaterVehicleType[];
    }>(null);

    const handleSubmit = async () => {
      return await btnSubmitForm.current?.onSubmit();
    };

    useEffect(() => {
      if (btnSubmitForm.current?.values && dataEdit && formType === "edit") {
        btnSubmitForm.current?.setValues([dataEdit]);
      }
      if (btnSubmitForm.current?.values && initAsset && formType === "add") {
        if (
          btnSubmitForm.current?.values.length === 1 &&
          isDeepEqual(btnSubmitForm.current?.values[0], initialValue[0])
        ) {
          btnSubmitForm.current?.setValues([{ ...initAsset }]);
        } else {
          const tmp_arr: any[] = [
            ...btnSubmitForm.current?.values,
            { ...initAsset },
          ];
          btnSubmitForm.current?.setValues(tmp_arr);
        }
      }
    }, [JSON.stringify(dataEdit), JSON.stringify(initAsset)]);

    useImperativeHandle(ref, () => ({
      onCreateAsset: handleSubmit,
    }));

    return (
      <StoredAssetWaterVehicleForm
        assetLevelThreeId={assetLevelThreeId}
        ref={btnSubmitForm}
        formType={formType}
      />
    );
  }
);

export default CreateWaterVehicleForm;
