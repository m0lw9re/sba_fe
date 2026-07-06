import { Space, message } from "antd";
import { CollapseCustom } from "components/CollapseCustom";
import { RootState } from "configs/configureStore";
import { APPRAISAL_FILE_STATUS, ROLES } from "constant/common";
import { APPRAISAL_LEGAL_DOCUMENT_TYPE } from "constant/enums";
import {
  AppraisalFileAssetCommonType,
  AppraisalFileBranchType,
  AppraisalFileLegalDocumentType,
  AppraisalFileSurveyScheduleType,
  AppraisalFileTransOfficeType,
  CustomerType,
} from "constant/types";
import { isEqual } from "lodash";
import AssetInfo from "pages/AppraisalFileDetail/component/GeneralInfo/component/AssetInfo";
import BranchInfo from "pages/AppraisalFileDetail/component/GeneralInfo/component/BranchInfo";
import CustomerInfo from "pages/AppraisalFileDetail/component/GeneralInfo/component/CustomerInfo";
import FixedInfo from "pages/AppraisalFileDetail/component/GeneralInfo/component/FixedInfor";
import SacombankApraisalFile from "pages/AppraisalFileDetail/component/GeneralInfo/component/SacombankAppraisalFiles";
import SbaAppraisalFiles from "pages/AppraisalFileDetail/component/GeneralInfo/component/SbaAppraisalFiles";
import SBARequireAddAppraisal from "pages/AppraisalFileDetail/component/GeneralInfo/component/SBARequireAddAppraisal";
import SurveyInfor from "pages/AppraisalFileDetail/component/GeneralInfo/component/SurveyInfor";
import { setAssetLevelTwoId } from "pages/AppraisalFileDetail/store/appraisalFileDetailSlice";
import {
  Fragment,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { isContainRole } from "utils/common";
import { convertISODate } from "utils/date";
import { removeFields } from "utils/validate";
import CustomerInfoFromLOS from "./component/CustomerInfoFromLOS";
import "./style.scss";

type Props = {
  dataGeneralInfo: {
    proposalCode: string | null;
    fileStatus: number | null;
    assetLevelTwoId: number | null;
    assetLevelOneId: number | null;
    appraisalPurposeId: number | null;
    branchData: {
      rmName: string | null;
      rmPhone: string | null;
      resultEmail: string | null;
      invoiceEmail: string | null;
      branch: AppraisalFileBranchType;
      transOffice: AppraisalFileTransOfficeType;
    };
    customerData: CustomerType;
    assetCommons: Array<AppraisalFileAssetCommonType>;
    legalDocuments: Array<AppraisalFileLegalDocumentType>;
    surveyData: {
      surveyGuide: string | null;
      surveyGuidePhone: string | null;
      surveyTime: string | null;
      surveySchedules: Array<AppraisalFileSurveyScheduleType>;
      appraisalDate: string | null;
      surveyGuidePosition: string | null;
    };
    customerNameByLos: string | null;
    addressCustomerByLos: string | null;
    typeCustomerByLos: string | null;
    cccdCustomerByLos: string | null;
    checkClimsLos: boolean | null;
    addressCustomDetail: string | null;
    rePricingNumber: number | null;
  };
  isReceivedFromLos: () => boolean;
};

type RefProps = {
  updateGeneralInfo: () => void;
  completeFileFromLOS: () => void;
  isSaved: () => void;
};

const GeneralInfo = forwardRef<RefProps, Props>(
  ({ dataGeneralInfo, isReceivedFromLos }, ref) => {
    const receivedFromLos = isReceivedFromLos();
    // Cho phép edit thông tin hay không
    const [disableEdit, setDisableEdit] = useState<boolean>(true);
    // Cho phép edit thông tin hay không đối với role CBTH và CVTD ở 1 số trường
    const [disableEditRoleCBTH, setDisableEditCBTH] = useState<boolean>(true);
    const [disableEditRoleCVTD, setDisableEditCVTD] = useState<boolean>(true);

    const { typeCreated } = useSelector(
      (state: RootState) => state.appraisalFileDetailSlice,
    );

    useEffect(() => {
      // Kiểm tra trạng thái hồ sơ
      const fileStatus = dataGeneralInfo?.fileStatus;
      const proposalCode = dataGeneralInfo?.proposalCode;
      if (fileStatus || fileStatus === 0) {
        if (
          // Nếu mã đề nghị bằng null và trạng thái hồ sơ nhỏ hơn chờ phân công thì cho edit
          !proposalCode &&
          fileStatus <= APPRAISAL_FILE_STATUS.SIX
        ) {
          setDisableEdit(false);
        }
        // Nếu 3 chữ đầu mã đề nghị bằng STB và trạng thái hồ sơ nhỏ hơn chờ phân công thì cho edit
        else if (proposalCode && fileStatus <= APPRAISAL_FILE_STATUS.SIX) {
          // const firstTreeCharacter = dataGeneralInfo.proposalCode.slice(0, 3);
          // if (firstTreeCharacter !== 'STB') {
          // hồ sơ từ LOS sang có fileStatus = 1
          if (fileStatus !== 1) {
            setDisableEdit(false);
          }
          // Nếu là CBTH và HS từ LOS
          if (isContainRole(ROLES.CBTH) && fileStatus === 1) {
            setDisableEditCBTH(false);
          }
          if (isContainRole(ROLES.CVTD) && fileStatus === 1) {
            setDisableEditCVTD(false);
          }
        } else if (
          proposalCode &&
          isContainRole(ROLES.CVTD) &&
          (fileStatus <= APPRAISAL_FILE_STATUS.TWELVE ||
            fileStatus <= APPRAISAL_FILE_STATUS.SEVENTEEN)
        ) {
          setDisableEditCVTD(false);
          // disable các edit còn lại
          setDisableEditCBTH(true);
          setDisableEdit(true);
        }
      }
    }, [dataGeneralInfo?.fileStatus, dataGeneralInfo.proposalCode]);

    const dispatch = useDispatch();
    const btnRefCommonInfo = useRef<{
      updateCommonInfor: () => void;
    }>(null);
    const btnRefBranchInfo = useRef<{
      updateBranchInfo: () => void;
    }>(null);
    const btnRefCustomerInfo = useRef<{
      updateCustomerInfor: () => void;
    }>(null);
    const btnRefSacombankInfor = useRef<{
      updateSacombankAppraisalFileInfor: () => void;
    }>(null);
    const btnRefSbaAppraisalFileInfor = useRef<{
      updateSbaAppraisalFileInfor: () => void;
    }>(null);
    const btnRefSbaRequireAddInfor = useRef<{
      updateSbaAppraisalFileRequireInfor: () => void;
    }>(null);
    const btnRefSurveyInfo = useRef<{
      updateSurveyInfo: () => void;
    }>(null);
    const btnRefAssetInfor = useRef<{
      updateAssetInfor: () => void;
      completeFileFromLOS: () => void;
    }>(null);

    useImperativeHandle(ref, () => ({
      updateGeneralInfo: handleUpdateDateGeneralInfo,
      completeFileFromLOS: handleCompleteFileFromLOS,
      isSaved: handleCheckIsSaved,
    }));

    useEffect(() => {
      // Thay đổi loại tài sản cấp 2
      if (dataGeneralInfo?.assetLevelTwoId) {
        dispatch(setAssetLevelTwoId(dataGeneralInfo.assetLevelTwoId));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataGeneralInfo?.assetLevelTwoId]);

    const handleGetLegalDocuments = async () => {
      const sacombankAppraisalFileUpdateData: any =
        await btnRefSacombankInfor.current?.updateSacombankAppraisalFileInfor();
      const sbaAppraisalFileUpdateData: any =
        await btnRefSbaAppraisalFileInfor.current?.updateSbaAppraisalFileInfor();
      const sbaRequiredAppraisalFileUpdateData: any =
        await btnRefSbaRequireAddInfor.current?.updateSbaAppraisalFileRequireInfor();

      // Lấy danh sách hồ sơ Sacombank
      const sacombankAppraisalFileUpdateData2 =
        sacombankAppraisalFileUpdateData?.legalDocuments
          ? [...sacombankAppraisalFileUpdateData?.legalDocuments]
          : dataGeneralInfo?.legalDocuments?.filter(
              (item) => item.type === APPRAISAL_LEGAL_DOCUMENT_TYPE.SACOMBANK,
            );
      // Lấy danh sách hồ sơ SBA
      const sbaAppraisalFileUpdateData2 =
        sbaAppraisalFileUpdateData?.legalDocuments
          ? [...sbaAppraisalFileUpdateData?.legalDocuments]
          : dataGeneralInfo?.legalDocuments?.filter(
              (item) => item.type === APPRAISAL_LEGAL_DOCUMENT_TYPE.SBA,
            );
      // Lấy danh sách hồ sơ SBA yêu cầu bổ sung
      const sbaRequiredAppraisalFileUpdateData2 =
        sbaRequiredAppraisalFileUpdateData?.legalDocuments
          ? [...sbaRequiredAppraisalFileUpdateData?.legalDocuments]
          : dataGeneralInfo?.legalDocuments?.filter(
              (item) =>
                item.type === APPRAISAL_LEGAL_DOCUMENT_TYPE.SBA_REQUIRED,
            );

      return [
        ...sbaAppraisalFileUpdateData2,
        ...sbaRequiredAppraisalFileUpdateData2,
        ...sacombankAppraisalFileUpdateData2,
      ];
    };
    const handleUpdateDateGeneralInfo = async () => {
      const commonUpdateData: any =
        await btnRefCommonInfo.current?.updateCommonInfor();
      const customerUpdateData: any =
        await btnRefCustomerInfo.current?.updateCustomerInfor();
      const branchUpdateData: any =
        await btnRefBranchInfo.current?.updateBranchInfo();
      const surveyUpdateData: any =
        await btnRefSurveyInfo.current?.updateSurveyInfo();
      const assetUpdateData: any =
        await btnRefAssetInfor.current?.updateAssetInfor();
      const sbaAppraisalFileUpdateData: any =
        await btnRefSbaAppraisalFileInfor.current?.updateSbaAppraisalFileInfor();

      if (!customerUpdateData) {
        message.error("Vui lòng nhập đầy đủ thông tin khách hàng");
        return;
      }
      if (!assetUpdateData) {
        message.error("Vui lòng nhập đầy đủ thông tin tài sản");
        return;
      }
      if (!surveyUpdateData) {
        message.error("Vui lòng nhập đầy đủ thông tin lịch khảo sát");
        return;
      }

      const legalDocuments = await handleGetLegalDocuments();

      return {
        ...customerUpdateData,
        ...branchUpdateData,
        ...surveyUpdateData,
        ...assetUpdateData,
        ...sbaAppraisalFileUpdateData,
        ...commonUpdateData,
        legalDocuments,
      };
    };
    const handleCheckIsSaved = async () => {
      try {
        const dataGeneralInfoTemp: any = {
          ...dataGeneralInfo,
          assetCommons: removeFields(dataGeneralInfo?.assetCommons, [
            "appraisalType",
            "legalStatus",
            "assetLevelThree",
            "districts",
            "provinces",
            "wards",
          ]),
          legalDocuments: removeFields(dataGeneralInfo?.legalDocuments).sort(
            (a: any, b: any) => a?.legalDocumentId - b?.legalDocumentId,
          ),
          branchData: {
            invoiceEmail: dataGeneralInfo.branchData.invoiceEmail,
            resultEmail: dataGeneralInfo.branchData.resultEmail,
            rmName: dataGeneralInfo.branchData.rmName,
            rmPhone: dataGeneralInfo.branchData.rmPhone,
            transOfficeCode:
              dataGeneralInfo.branchData.transOffice?.transOfficeCode || null,
          },
        };
        delete dataGeneralInfoTemp.proposalCode;
        delete dataGeneralInfoTemp.fileStatus;
        dataGeneralInfoTemp.customer = dataGeneralInfoTemp.customerData;
        delete dataGeneralInfoTemp.customerData;
        if (typeCreated === 0) {
          delete dataGeneralInfoTemp.addressCustomerByLos;
          delete dataGeneralInfoTemp.cccdCustomerByLos;
          delete dataGeneralInfoTemp.typeCustomerByLos;
          delete dataGeneralInfoTemp.customerNameByLos;
        }

        const newGeneralInfo = await handleUpdateDateGeneralInfo();
        if (!newGeneralInfo) return true;

        const surveyUpdateData: any = {
          surveyGuide: newGeneralInfo?.surveyGuide,
          surveyGuidePhone: newGeneralInfo?.surveyGuidePhone,
          surveySchedules: removeFields(newGeneralInfo?.surveySchedules).map(
            (item) => {
              return {
                ...item,
                timeStart: convertISODate(item?.timeStart),
                timeEnd: convertISODate(item?.timeEnd),
              };
            },
          ),
          surveyTime: convertISODate(newGeneralInfo?.surveyTime),
        };
        const newBranchData = {
          invoiceEmail: newGeneralInfo.invoiceEmail,
          resultEmail: newGeneralInfo.resultEmail,
          rmName: newGeneralInfo.rmName,
          rmPhone: newGeneralInfo.rmPhone,
          transOfficeCode: newGeneralInfo.transOfficeCode || null,
        };
        const newGeneralInfoTemp: any = {
          ...newGeneralInfo,
          surveyData: surveyUpdateData,
          branchData: newBranchData,
          legalDocuments: removeFields(newGeneralInfo?.legalDocuments).sort(
            (a: any, b: any) => a?.legalDocumentId - b?.legalDocumentId,
          ),
        };

        delete newGeneralInfoTemp.surveyGuide;
        delete newGeneralInfoTemp.surveyGuidePhone;
        delete newGeneralInfoTemp.surveySchedules;
        delete newGeneralInfoTemp.surveyTime;

        newGeneralInfoTemp.assetCommons = removeFields(
          newGeneralInfoTemp?.assetCommons,
          [
            "assetLevelThreeName",
            "legalStatusName",
            "appraisalTypeName",
            "appraisalType",
            "legalStatus",
            "assetLevelThree",
            "districts",
            "provinces",
            "wards",
            "key",
          ],
        );

        delete newGeneralInfoTemp.customerId;
        delete newGeneralInfoTemp.invoiceEmail;
        delete newGeneralInfoTemp.resultEmail;
        delete newGeneralInfoTemp.rmName;
        delete newGeneralInfoTemp.rmPhone;
        delete newGeneralInfoTemp.transOfficeCode;
        return isEqual(dataGeneralInfoTemp, newGeneralInfoTemp);
      } catch (error) {
        console.log("error:", error);
        return true;
      }
    };
    const handleCompleteFileFromLOS = async () => {
      const commonUpdateData: any =
        await btnRefCommonInfo.current?.updateCommonInfor();
      const assetUpdateData: any =
        await btnRefAssetInfor.current?.completeFileFromLOS();

      let checkAssetLevelThree = true;
      assetUpdateData?.assetCommons?.forEach((item: any) => {
        if (typeof item.assetLevelThreeId !== "number") {
          checkAssetLevelThree = false;
        }
      });
      if (!checkAssetLevelThree) {
        message.error("Vui lòng chọn phân loại tài sản");
        return;
      }

      const sbaAppraisalFileUpdateData: any =
        await btnRefSbaAppraisalFileInfor.current?.updateSbaAppraisalFileInfor();

      const sacombankAppraisalFileUpdateData: any =
        await btnRefSacombankInfor.current?.updateSacombankAppraisalFileInfor();
      const legalDocuments = await handleGetLegalDocuments();

      return {
        ...assetUpdateData,
        ...sbaAppraisalFileUpdateData,
        ...commonUpdateData,
        ...sacombankAppraisalFileUpdateData,
        legalDocuments,
      };
    };

    return (
      <Fragment>
        <Space direction="vertical" size="small" style={{ display: "flex" }}>
          <FixedInfo
            commonInforData={{
              appraisalPurposeId: dataGeneralInfo.appraisalPurposeId,
              assetLevelOneId: dataGeneralInfo.assetLevelOneId,
              assetLevelTwoId: dataGeneralInfo.assetLevelTwoId,
              checkClimsLos: dataGeneralInfo.checkClimsLos,
              rePricingNumber: dataGeneralInfo.rePricingNumber,
            }}
            receivedFromLos={receivedFromLos}
            disableEdit={disableEdit}
            disableEditRoleCBTH={disableEditRoleCBTH}
            ref={btnRefCommonInfo}
          />
          <CollapseCustom
            defaultActiveKey={["1", "2", "3", "4", "5", "6", "7"]}
            itemList={[
              {
                label: "Thông tin chi nhánh Sacombank",
                forceRender: true,
                children: (
                  <BranchInfo
                    ref={btnRefBranchInfo}
                    allowEdit={disableEdit}
                    disableEditRoleCBTH={disableEditRoleCBTH}
                    branchData={{
                      invoiceEmail: dataGeneralInfo.branchData.invoiceEmail,
                      resultEmail: dataGeneralInfo.branchData.resultEmail,
                      rmName: dataGeneralInfo.branchData.rmName,
                      rmPhone: dataGeneralInfo.branchData.rmPhone,
                      transOfficeCode:
                        dataGeneralInfo.branchData.transOffice
                          ?.transOfficeCode || null,
                    }}
                  />
                ),
              },
              {
                label: "Thông tin khách hàng",
                forceRender: true,
                children: (
                  <>
                    {typeCreated ? (
                      // hồ sơ từ LOS
                      <CustomerInfoFromLOS
                        ref={btnRefCustomerInfo}
                        customerData={{
                          customerNameByLos: dataGeneralInfo.customerNameByLos,
                          addressCustomerByLos:
                            dataGeneralInfo.addressCustomerByLos,
                          typeCustomerByLos: dataGeneralInfo.typeCustomerByLos,
                          cccdCustomerByLos: dataGeneralInfo.cccdCustomerByLos,
                        }}
                        disableEdit={disableEdit && disableEditRoleCBTH}
                      />
                    ) : (
                      <CustomerInfo
                        ref={btnRefCustomerInfo}
                        customerData={dataGeneralInfo.customerData}
                        disableEdit={disableEdit && disableEditRoleCBTH}
                      />
                    )}
                  </>
                ),
              },
              {
                label: "Thông tin tài sản",
                forceRender: true,
                children: (
                  <AssetInfo
                    ref={btnRefAssetInfor}
                    disableEdit={disableEdit}
                    fileStatus={dataGeneralInfo?.fileStatus || 0}
                    assetInfor={{
                      addressCustomDetail: dataGeneralInfo.addressCustomDetail,
                      assetCommons: dataGeneralInfo.assetCommons?.sort(
                        (a, b) => {
                          const _a = a.orderBy || 0;
                          const _b = b.orderBy || 0;
                          return _a - _b;
                        },
                      ),
                      assetLevelTwoId: dataGeneralInfo.assetLevelTwoId,
                      assetLevelOneId: dataGeneralInfo.assetLevelOneId,
                    }}
                    disableEditRoleCBTH={
                      disableEditRoleCBTH && disableEditRoleCVTD
                    }
                  />
                ),
              },
              {
                label: "Hồ sơ Sacombank",
                forceRender: true,
                children: (
                  <SacombankApraisalFile
                    ref={btnRefSacombankInfor}
                    legalDocuments={dataGeneralInfo.legalDocuments?.filter(
                      (item) =>
                        item.type === APPRAISAL_LEGAL_DOCUMENT_TYPE.SACOMBANK,
                    )}
                    assetLevelTwoId={dataGeneralInfo.assetLevelTwoId}
                  />
                ),
              },
              {
                label: "Hồ sơ SBA",
                forceRender: true,
                children: (
                  <SbaAppraisalFiles
                    ref={btnRefSbaAppraisalFileInfor}
                    sbaAppraisalFileInfor={{
                      legalDocuments: dataGeneralInfo.legalDocuments?.filter(
                        (item) =>
                          item.type === APPRAISAL_LEGAL_DOCUMENT_TYPE.SBA,
                      ),
                    }}
                    disableEdit={
                      disableEdit && disableEditRoleCBTH && disableEditRoleCVTD
                    }
                    assetLevelTwoId={dataGeneralInfo.assetLevelTwoId}
                  />
                ),
              },
              {
                label: "Hồ sơ SBA yêu cầu bổ sung",
                forceRender: true,
                children: (
                  <SBARequireAddAppraisal
                    ref={btnRefSbaRequireAddInfor}
                    sbaAppraisalFileInfor={{
                      legalDocuments: dataGeneralInfo.legalDocuments?.filter(
                        (item) =>
                          item.type ===
                          APPRAISAL_LEGAL_DOCUMENT_TYPE.SBA_REQUIRED,
                      ),
                    }}
                    disableEdit={
                      disableEdit && disableEditRoleCBTH && disableEditRoleCVTD
                    }
                    assetLevelTwoId={dataGeneralInfo.assetLevelTwoId}
                  />
                ),
              },
              {
                label: "Thông tin lịch khảo sát",
                forceRender: true,
                children: (
                  <SurveyInfor
                    ref={btnRefSurveyInfo}
                    surveyInfo={dataGeneralInfo.surveyData}
                    disableEdit={
                      disableEdit && disableEditRoleCBTH && disableEditRoleCVTD
                    }
                  />
                ),
              },
            ]}
          />
        </Space>
      </Fragment>
    );
  },
);

export default memo(GeneralInfo);
