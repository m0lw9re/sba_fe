/* eslint-disable react-hooks/exhaustive-deps */
import { ASSET_LV3 } from "constant/enums";
import { ComparedAssetDeviceCreateType } from "constant/types";
import StoredAssetDeviceForm from "pages/PriceShared/AssetCreate/Device/TableAssetInfo";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initialValue } from "pages/PriceShared/AssetCreate/Device/TableAssetInfo/config";
import { isDeepEqual } from "utils";

type Props = {
  assetType: number;
  formType?: "add" | "edit";
  data: ComparedAssetDeviceCreateType;
  initAsset?: any;
};
type RefProps = {
  onCreateAsset: () => void;
};
const CreateDeviceForm = forwardRef<RefProps, Props>((props: Props, ref) => {
  const { data: dataEdit, formType, initAsset } = props;
  const location = useLocation();
  const assetLevelThreeId =
    location.state?.assetLevelThreeId || ASSET_LV3.MACHINE;
  const btnSubmitForm = useRef<{
    onSubmit: () => any;
    setValues: (data: ComparedAssetDeviceCreateType[]) => void;
    values: ComparedAssetDeviceCreateType[];
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
    <StoredAssetDeviceForm
      assetLevelThreeId={assetLevelThreeId || ASSET_LV3.MACHINE}
      ref={btnSubmitForm}
      formType={formType}
    />
  );
});

export default CreateDeviceForm;
