import { Space } from "antd";
import { CollapseCustom } from "components/CollapseCustom";
import { AppraisalFileAssetCommonType } from "constant/types/appraisalFile";
import { AppraisalInfoType } from "constant/types/appraisalFilesDetail";
import AssetsCodeTab from "pages/AppraisalFileDetail/component/AssetsInfo/component/AssetsCodeTab";
import { Fragment, forwardRef, memo, useImperativeHandle, useRef } from "react";
import "./style.scss";
type Props = {
  dataAssetsInfo: {
    appraisalInfo: AppraisalInfoType;
    assetCommons: Array<AppraisalFileAssetCommonType>;
    assetLevelTwoId: number;
  };
};

type RefProps = {
  getAssetInfo: () => void;
  updateAssetInfo: () => void;
};

const AssetsInfo = forwardRef<RefProps, Props>(({ dataAssetsInfo }, ref) => {
  const btnRefAssetCodeTab = useRef<{
    getAssetCodeTab: () => void;
    updateAssetCodeTab: () => void;
  }>(null);

  useImperativeHandle(ref, () => ({
    getAssetInfo: handleGetAssetInfo,
    updateAssetInfo: handleUpdateAssetInfo,
  }));

  const handleGetAssetInfo = async () => {
    const assetArray = btnRefAssetCodeTab.current?.getAssetCodeTab();
    return assetArray;
    // 'lấy thêm thông tin các tab sau thì thả vào đây
    // const appraisalUpdateInfo: any =
    //   await btnRefAppraisalInfo.current?.updateAppraisalInfo();

    // return { ...appraisalUpdateInfo };
  };
  const handleUpdateAssetInfo = async () => {
    const assetArray = btnRefAssetCodeTab.current?.updateAssetCodeTab();
    return assetArray;
    // 'lấy thêm thông tin các tab sau thì thả vào đây
    // const appraisalUpdateInfo: any =
    //   await btnRefAppraisalInfo.current?.updateAppraisalInfo();

    // return { ...appraisalUpdateInfo };
  };

  return (
    <Fragment>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <CollapseCustom
          itemList={[
            {
              label: "Mã tài sản",
              children: (
                <AssetsCodeTab
                  ref={btnRefAssetCodeTab}
                  assetCommons={dataAssetsInfo?.assetCommons?.map((item) => ({
                    assetCode: item.assetCode,
                    assetLevelThreeId: item.assetLevelThreeId,
                    parentAssetCode: item.parentAssetCode,
                  }))}
                  assetLevelTwoId={dataAssetsInfo.assetLevelTwoId}
                />
              ),
            },
          ]}
        />
      </Space>
    </Fragment>
  );
});

export default memo(AssetsInfo);
