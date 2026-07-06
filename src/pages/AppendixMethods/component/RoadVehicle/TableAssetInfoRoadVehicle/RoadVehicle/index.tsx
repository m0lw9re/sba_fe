/* eslint-disable react-hooks/exhaustive-deps */
import { ASSET_LV3 } from "constant/enums";
import { ComparedAssetRoadVehicleCreateType } from "constant/types";
import StoredAssetRoadVehicleForm from "pages/PriceShared/AssetCreate/RoadVehicle/TableAssetInfo";
import { initialValue } from "pages/PriceShared/AssetCreate/RoadVehicle/TableAssetInfo/config";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { isDeepEqual } from "utils";

type Props = {
  assetType: number;
  formType?: "add" | "edit";
  data: ComparedAssetRoadVehicleCreateType;
  assetLevelThreeId: number | undefined;
  initAsset?: any;
};
type RefProps = {
  onCreateAsset: () => void;
};
const CreateRoadVehicleUsingForm = forwardRef<RefProps, Props>(
  (props: Props, ref) => {
    const { data: dataEdit, formType, assetLevelThreeId, initAsset } = props;
    const btnSubmitForm = useRef<{
      onSubmit: () => any;
      setValues: (data: ComparedAssetRoadVehicleCreateType[]) => void;
      values: ComparedAssetRoadVehicleCreateType[];
    }>(null);

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
    const handleSubmit = async () => {
      return await btnSubmitForm.current?.onSubmit();
    };

    return (
      <StoredAssetRoadVehicleForm
        ref={btnSubmitForm}
        formType={formType}
        assetLevelThreeId={assetLevelThreeId || ASSET_LV3.CAR}
      />
    );
  }
);

export default memo(CreateRoadVehicleUsingForm);
