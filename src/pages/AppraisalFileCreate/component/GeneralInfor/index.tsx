import { Space, message, Modal } from "antd";
import React, {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import CommonInfor from "pages/AppraisalFileCreate/component/GeneralInfor/component/CommonInfor";
import { CollapseCustom } from "components/CollapseCustom";
import BranchInfor from "pages/AppraisalFileCreate/component/GeneralInfor/component/BranchInfor";
import CustomerInfor from "pages/AppraisalFileCreate/component/GeneralInfor/component/CustomerInfor";
import AssetInfor from "pages/AppraisalFileCreate/component/GeneralInfor/component/AssetInfor";
import SacombankAppraisalFile from "pages/AppraisalFileCreate/component/GeneralInfor/component/SacombankAppraisalFile";
import SbaAppraisalFile from "pages/AppraisalFileCreate/component/GeneralInfor/component/SbaAppraisalFile";
import SbaRequireAddAppraisal from "pages/AppraisalFileCreate/component/GeneralInfor/component/SbaRequireAddAppraisal";
import SurveyInfor from "pages/AppraisalFileCreate/component/GeneralInfor/component/SurveyInfor";
import { initialAppraisalFile } from "./config";

type RefProps = {
  createNewAppraisalFile: () => void;
};

const GeneralInfo = forwardRef<RefProps>(({}, ref) => {
  const btnRefCommonInfor = useRef<{
    addCommonInfor: () => void;
  }>(null);
  const btnRefBranchInfor = useRef<{
    addBranchInfor: () => void;
  }>(null);
  const btnRefCustomerInfor = useRef<{
    addCustomerInfor: () => void;
  }>(null);
  const btnRefAssetInfor = useRef<{
    addAssetInfor: () => void;
  }>(null);
  const btnRefSacombankAppraisalInfor = useRef<{
    addSacombankAppraisalFile: () => void;
  }>(null);
  const btnRefSbaAppraisalInfor = useRef<{
    addSbaAppraisalFileInfor: () => void;
  }>(null);
  const btnRefSbaRequireAddInfor = useRef<{
    addSbaRequireAppraisalInfor: () => void;
  }>(null);
  const btnRefSurveyAddInfor = useRef<{
    addSurveyInfor: () => void;
  }>(null);

  const handleCreateNewAppraisalFile = async () => {
    const commonInforData: any =
      await btnRefCommonInfor.current?.addCommonInfor();
    const branchInforData: any =
      await btnRefBranchInfor.current?.addBranchInfor();
    const customerInforData: any =
      await btnRefCustomerInfor.current?.addCustomerInfor();
    const assetInforData: any = await btnRefAssetInfor.current?.addAssetInfor();
    const sacomBankInforData: any =
      await btnRefSacombankAppraisalInfor.current?.addSacombankAppraisalFile();
    const sbaInforData: any =
      await btnRefSbaAppraisalInfor.current?.addSbaAppraisalFileInfor();
    const sbaRequireInforData: any =
      await btnRefSbaRequireAddInfor.current?.addSbaRequireAppraisalInfor();
    const surveyInforData: any =
      await btnRefSurveyAddInfor.current?.addSurveyInfor();

    if (
      commonInforData &&
      branchInforData &&
      customerInforData &&
      surveyInforData
    ) {
      const sacomBankInforData2 = sacomBankInforData?.legalDocuments
        ? [...sacomBankInforData?.legalDocuments]
        : [];
      const sbaInforData2 = sbaInforData?.legalDocuments
        ? [...sbaInforData?.legalDocuments]
        : [];
      const sbaRequireInforData2 = sbaRequireInforData?.legalDocuments
        ? [...sbaRequireInforData?.legalDocuments]
        : [];

      if (sacomBankInforData2.length === 0) {
        message.error("Thiếu thông tin hồ sơ Sacombank");
        return undefined;
      }
      if (!assetInforData || assetInforData?.assetCommons?.length === 0) {
        message.error("Thiếu thông tin tài sản thẩm định");
        return undefined;
      }

      const dataCreate = {
        ...initialAppraisalFile,
        ...commonInforData,
        ...branchInforData,
        ...customerInforData,
        ...assetInforData,
        ...surveyInforData,
        legalDocuments: [
          ...sacomBankInforData2,
          ...sbaInforData2,
          ...sbaRequireInforData2,
        ],
      };
      return dataCreate;
    }

    return undefined;
  };

  // const {
  //   appraisalFileCreateChange,
  // } = useSelector((state: RootState) => state.globalSlice);

  useEffect(() => {
    const unloadCallback = (event: any) => {
      const e = event || window.event;
      e.preventDefault();
      if (e) {
        e.returnValue = "";
      }
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => {
      window.removeEventListener("beforeunload", unloadCallback);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    createNewAppraisalFile: handleCreateNewAppraisalFile,
  }));
  return (
    <Fragment>
      <Space style={{ display: "flex" }} size={"small"} direction="vertical">
        <CommonInfor ref={btnRefCommonInfor} />
        <CollapseCustom
          defaultActiveKey={["1", "2", "3", "4", "5", "6", "7"]}
          itemList={[
            {
              label: "Thông tin chi nhánh Sacombank",
              children: <BranchInfor ref={btnRefBranchInfor} />,
            },
            {
              label: "Thông tin khách hàng",
              children: <CustomerInfor ref={btnRefCustomerInfor} />,
            },
            {
              label: "Thông tin tài sản",
              children: <AssetInfor ref={btnRefAssetInfor} />,
            },
            {
              label: "Hồ sơ Sacombank",
              children: (
                <SacombankAppraisalFile ref={btnRefSacombankAppraisalInfor} />
              ),
            },
            {
              label: "Hồ sơ SBA1",
              children: <SbaAppraisalFile ref={btnRefSbaAppraisalInfor} />,
            },
            {
              label: "Hồ sơ SBA yêu cầu bổ sung",
              children: (
                <SbaRequireAddAppraisal ref={btnRefSbaRequireAddInfor} />
              ),
            },
            {
              label: "Thông tin lịch khảo sát",
              children: <SurveyInfor ref={btnRefSurveyAddInfor} />,
            },
          ]}
        />
      </Space>
    </Fragment>
  );
});

export default GeneralInfo;
