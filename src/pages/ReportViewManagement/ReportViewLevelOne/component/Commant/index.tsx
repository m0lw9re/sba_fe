import { useEffect, useState } from "react";
import { Card, Col, Input, Row, Space, Typography } from "antd";
import {
  ApprovalHistoryType,
  ApprovalStaffType,
} from "constant/types/appraisalFile";

import ApprovalHistoryModal from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal";
import { UpdateInfoProps } from "pages/ReportViewManagement/ReportViewLevelOne";
import { ResultByApartment } from "pages/ReportViewManagement/ReportViewLevelOne/component/ResultTablesByAssetType/ResultApartment";
import ResultByLand from "../ResultTablesByAssetType/ResultLand";
import { ResultByMachineDevice } from "pages/ReportViewManagement/ReportViewLevelOne/component/ResultTablesByAssetType/ResultMachineDevice";
import { ResultByRoadVehicle } from "pages/ReportViewManagement/ReportViewLevelOne/component/ResultTablesByAssetType/ResultRoadVehicle";
import { ResultByWaterVehicle } from "pages/ReportViewManagement/ReportViewLevelOne/component/ResultTablesByAssetType/ResultWaterVehicle";

import "./style.scss";
import { ASSET_LV2 } from "constant/enums";
import { ResultByProject } from "../ResultTablesByAssetType/ResultProject";
import { RequireLabel } from "components/Requiredlabel";

type Props = {
  commentInput: string;
  setCommentInput: (value: string) => void;
  staffs: ApprovalStaffType[];
  historyApproval: ApprovalHistoryType[];

  updateFormValue: UpdateInfoProps;
  setUpdateFormValue: (value: UpdateInfoProps) => void;
  showUpdateForm: boolean;
  viewOnly: boolean;
  assetLevelTwoId: number;
  constructionFutureValue: number | null;
  setConstructionFutureValue: (value: number) => void;
  signatureDate: string | null;
};
const Comment = (props: Props) => {
  const {
    commentInput,
    setCommentInput,
    staffs,
    historyApproval,
    updateFormValue,
    setUpdateFormValue,
    showUpdateForm,
    viewOnly,
    assetLevelTwoId,
    constructionFutureValue,
    setConstructionFutureValue,
    signatureDate,
  } = props;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [totalValue, setTotalValue] = useState<number>(0);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const renderResultTables = () => {
    // còn thiếu 5 và 7
    if (
      assetLevelTwoId === ASSET_LV2.LAND ||
      assetLevelTwoId === ASSET_LV2.ESTIMATE
    ) {
      return (
        <ResultByLand
          updateFormValue={updateFormValue}
          totalValue={totalValue}
          setUpdateFormValue={setUpdateFormValue}
          constructionFutureValue={constructionFutureValue}
          assetLevelTwoId={assetLevelTwoId}
          setConstructionFutureValue={setConstructionFutureValue}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.PROJECT) {
      return (
        <ResultByProject
          updateFormValue={updateFormValue}
          totalValue={totalValue}
          setUpdateFormValue={setUpdateFormValue}
          assetLevelTwoId={assetLevelTwoId}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.APARTMENT) {
      return (
        <ResultByApartment
          updateFormValue={updateFormValue}
          setUpdateFormValue={setUpdateFormValue}
          totalValue={totalValue}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.VEHICLE) {
      return (
        <ResultByRoadVehicle
          updateFormValue={updateFormValue}
          totalValue={totalValue}
          setUpdateFormValue={setUpdateFormValue}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.WATER_VEHICLE) {
      return (
        <ResultByWaterVehicle
          updateFormValue={updateFormValue}
          totalValue={totalValue}
          setUpdateFormValue={setUpdateFormValue}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.MACHINE) {
      return (
        <ResultByMachineDevice
          updateFormValue={updateFormValue}
          totalValue={totalValue}
          setUpdateFormValue={setUpdateFormValue}
        />
      );
    } else {
      return <></>;
    }
  };
  useEffect(() => {
    if (updateFormValue || constructionFutureValue) {
      const totalHistoryValues = updateFormValue.approvalHistoryValues.reduce(
        (arr, curr) => {
          return arr + (curr.totalValue || 0);
        },
        0
      );
      const totalConstructionValues =
        updateFormValue.approvalHistoryConstructionDtos.reduce((arr, curr) => {
          return arr + (curr.totalValue || 0);
        }, 0);
      setTotalValue(
        totalHistoryValues +
          totalConstructionValues +
          (constructionFutureValue || 0)
      );
    }
  }, [updateFormValue, constructionFutureValue]);
  return (
    <Card size="small" className="commant-wrapper">
      <Space
        size={"small"}
        direction="vertical"
        className="commant-wrapper-content"
      >
        {!viewOnly && (
          <>
            <Typography.Title level={5} className="commant-header">
              <RequireLabel label="Ý kiến" />
            </Typography.Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Input.TextArea
                  showCount
                  size={"small"}
                  maxLength={10000}
                  style={{ height: 120, marginBottom: 24 }}
                  onChange={(e) => setCommentInput(e.target.value)}
                  value={commentInput}
                  placeholder="Nhập"
                  allowClear
                />
              </Col>
            </Row>
          </>
        )}
        {showUpdateForm &&
          !viewOnly && {
            ...renderResultTables(),
          }}
        <Typography.Link
          className="commant-footer"
          underline
          onClick={handleOpenModal}
        >
          Lịch sử phê duyệt tờ trình
        </Typography.Link>
      </Space>
      <ApprovalHistoryModal
        assetLevelTwoId={assetLevelTwoId}
        isOpen={isOpenModal}
        closeModal={handleCloseModal}
        staffs={staffs}
        historyApproval={historyApproval}
        signatureDate={signatureDate}
      />
    </Card>
  );
};
export default Comment;
