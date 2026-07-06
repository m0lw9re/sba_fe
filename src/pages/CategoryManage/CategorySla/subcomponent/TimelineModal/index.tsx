import { Button, Modal, Row, Space, Spin, StepProps, Steps } from "antd";
import Icons from "assets/icons";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import "./style.scss";
import React from "react";
import {
  SolutionOutlined,
  InboxOutlined,
  ApartmentOutlined,
  FileProtectOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useCategorySlaDetail } from "utils/request";
import ComponentsError from "pages/ComponentsError";
import { SlaTimelineDetail, SlaTimelineDetailItem } from "constant/types/sla";
import { SLA_STATUS, SLA_TIMELINE_TYPE } from "constant/common";
import dayjs from "dayjs";
import useScreenSize from "hooks/useScreenSize";
import { calculateExecutionTime, second2hourString } from "utils/date";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  reportCode: string;
  appraisalFileId: string;
  maxCommitmentDate: number;
};

const checkFileStatus = (
  maxCommitmentDate: number,
  totalWorkTimeInSeconds: number,
  percentageRate: number = 100
) => {
  const resultObj = {
    label: "",
    color: "black",
  };
  if (!maxCommitmentDate) return resultObj;

  // Tính giới hạn thời gian (chuyển đổi ngày thành giây)
  // 1 ngày = 8 giờ làm việc = 8 * 60 * 60 giây = 28800 giây
  const commitmentTimeLimitInSeconds =
    maxCommitmentDate * 8 * 3600 * (percentageRate / 100);
  const regulationTimeLimitInSeconds = commitmentTimeLimitInSeconds * 2;

  // Xác định trạng thái hồ sơ
  if (totalWorkTimeInSeconds <= commitmentTimeLimitInSeconds) {
    return { ...resultObj, label: SLA_STATUS.ON_TIME };
  } else if (totalWorkTimeInSeconds <= regulationTimeLimitInSeconds) {
    return {
      ...resultObj,
      label: SLA_STATUS.COMMITMENT_LATE,
      color: "#ffc107",
    };
  } else {
    return {
      ...resultObj,
      label: SLA_STATUS.REGULATION_LATE,
      color: "#dc3545",
    };
  }
};

const TimelineModal: React.FC<Props> = ({
  closeModal,
  isOpen,
  reportCode,
  appraisalFileId,
  maxCommitmentDate,
}) => {
  const {
    data: slaDetail,
    isLoading,
    error,
  }: {
    data: SlaTimelineDetail;
    isLoading: boolean;
    error: any;
  } = useCategorySlaDetail(appraisalFileId);

  const size = useScreenSize();

  const renderStepItem = (
    slaDetail: SlaTimelineDetail,
    type: number,
    percentageRate: number = 100
  ) => {
    const selectedDetail = slaDetail?.filter((item) => {
      if (type < SLA_TIMELINE_TYPE.PHE_DUYET_1) {
        return item.type === type;
      } else {
        return item.type >= SLA_TIMELINE_TYPE.PHE_DUYET_1;
      }
    });
    if (!selectedDetail || selectedDetail.length === 0) return { title: null };

    const generateDescription = (items: SlaTimelineDetail) => {
      // Nếu không có dữ liệu hoặc dữ liệu không hợp lệ
      if (!items || items.length === 0) {
        return [
          {
            contents: [<span>Không có dữ liệu</span>],
          },
        ];
      }

      // Format thời gian
      const formatTime = (dateString: string | null): string => {
        if (!dateString) return "--/--";
        return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss");
      };

      // Map qua từng item để tạo description với bước trước duyệt và ký số
      if (items[0].type < SLA_TIMELINE_TYPE.PHE_DUYET_1)
        return items.map((item) => {
          const executionTime = second2hourString(
            calculateExecutionTime(
              item.startedDate,
              item.finishedDate,
              item.type
            )
          );
          const startTime = formatTime(item.startedDate);
          const endTime = formatTime(item.finishedDate);

          return {
            contents: [
              <span>
                <span style={{ fontWeight: "bold" }}>{item.staffName}</span>{" "}
                thực hiện trong: {executionTime}
              </span>,
              `Thời gian bắt đầu: ${startTime}`,
              `Thời gian kết thúc: ${endTime}`,
            ],
          };
        });

      // For types >= PHE_DUYET_1
      const approvalLevels = new Map();

      // Group items by type
      items.forEach((item) => {
        if (!approvalLevels.has(item.type)) {
          approvalLevels.set(item.type, []);
        }
        approvalLevels.get(item.type).push(item);
      });

      const result: any = [];

      // Process each approval level
      approvalLevels.forEach((levelItems, type) => {
        const levelTotalTime = levelItems.reduce(
          (total: any, item: SlaTimelineDetailItem) => {
            const time = calculateExecutionTime(
              item.startedDate,
              item.finishedDate,
              item.type
            );
            return total + time;
          },
          0
        );

        const levelTitle = (
          <b>
            {type === SLA_TIMELINE_TYPE.KY_SO
              ? "- Ký số"
              : `- Duyệt cấp ${type - SLA_TIMELINE_TYPE.PHE_DUYET_1 + 1}: ${
                  levelTotalTime ? second2hourString(levelTotalTime) : "--/--"
                }`}
          </b>
        );

        result.push({
          contents: [levelTitle],
        });

        levelItems.forEach((item: any) => {
          const executionTime = calculateExecutionTime(
            item.startedDate,
            item.finishedDate
          );

          const executionTimeStr = executionTime
            ? second2hourString(executionTime)
            : "--/--";
          const startTime = formatTime(item.startedDate);
          const endTime = formatTime(item.finishedDate);

          const styleItem = { paddingLeft: "0.5rem" };

          result.push({
            contents: [
              <span style={styleItem}>
                <span style={{ fontWeight: "bold" }}>{item.staffName}</span>{" "}
                thực hiện trong: {executionTimeStr}
              </span>,
              <span style={styleItem}>Thời gian bắt đầu: {startTime}</span>,
              <span style={styleItem}>Thời gian kết thúc: {endTime}</span>,
            ],
          });
        });
      });

      return result;
    };

    // tính tổng thời gian
    const executionTime = selectedDetail
      .map((item) =>
        calculateExecutionTime(item.startedDate, item.finishedDate, item.type)
      )
      .filter((time): time is number => time !== null)
      .reduce((sum, time) => sum + time, 0);
    const executionTimeStr = executionTime
      ? second2hourString(executionTime)
      : "--/--";

    const slaStatus = checkFileStatus(
      maxCommitmentDate,
      executionTime,
      percentageRate
    );

    const renderObj = (type: number) => {
      switch (type) {
        case SLA_TIMELINE_TYPE.TIEP_NHAN:
          return {
            title: `Tiếp nhận hồ sơ: ${executionTimeStr}`,
            icon: <InboxOutlined />,
          };
        case SLA_TIMELINE_TYPE.PHAN_GIAO:
          return {
            title: `Phân giao hồ sơ: ${executionTimeStr}`,
            icon: <ApartmentOutlined />,
          };
        case SLA_TIMELINE_TYPE.KHAO_SAT_LTT:
          return {
            title: `Khảo sát và Lập tờ trình: ${executionTimeStr}`,

            icon: <SolutionOutlined />,
          };
        case SLA_TIMELINE_TYPE.PHE_DUYET_1:
          return {
            title: `Phê duyệt và Ký số: ${executionTimeStr}`,

            icon: <FileProtectOutlined style={{ color: slaStatus.color }} />,
          };
        case SLA_TIMELINE_TYPE.PHE_DUYET_2:
          return {
            title: `Phê duyệt và Ký số: ${executionTimeStr}`,
            icon: <FileProtectOutlined />,
          };
        case SLA_TIMELINE_TYPE.PHE_DUYET_3:
          return {
            title: `Phê duyệt và Ký số: ${executionTimeStr}`,
            icon: <FileProtectOutlined />,
          };
        case SLA_TIMELINE_TYPE.KY_SO:
          return {
            title: `Phê duyệt và Ký số: ${executionTimeStr}`,
            icon: <FileProtectOutlined />,
          };
        default:
          return {
            title: "",
            icon: <CheckCircleOutlined />,
          };
      }
    };

    const obj = renderObj(type);

    const des: any = generateDescription(selectedDetail);

    const stepItem: StepProps = {
      title: (
        <span style={{ color: slaStatus.color, fontWeight: "bold" }}>
          {obj.title}
        </span>
      ),
      icon: obj?.icon || null,
      description: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            color: "black",
          }}
        >
          {des?.map((el: any) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  color: "black",
                  marginBottom: "0.5rem",
                }}
              >
                {el?.contents?.map((item: any) => (
                  <div>{item}</div>
                ))}
              </div>
            );
          })}
        </div>
      ),
      status: "finish",
    };
    return stepItem;
  };

  const step1Item = renderStepItem(slaDetail, SLA_TIMELINE_TYPE.TIEP_NHAN);
  const step2Item = renderStepItem(slaDetail, SLA_TIMELINE_TYPE.PHAN_GIAO);
  const step3Item = renderStepItem(
    slaDetail,
    SLA_TIMELINE_TYPE.KHAO_SAT_LTT,
    60
  );
  const step4Item = renderStepItem(
    slaDetail,
    SLA_TIMELINE_TYPE.PHE_DUYET_1,
    40
  );

  const items: StepProps[] = [
    step1Item,
    step2Item,
    step3Item,
    step4Item,
  ].filter((el) => el.title);

  if (isLoading) return <Spin />;
  if (error) return <ComponentsError />;

  return (
    <Modal
      open={isOpen}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalTimeline"
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        top: "calc(5vh)",
      }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalTimeline-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate
            title={`Chi tiết thời gian hồ sơ ${reportCode}`}
          />
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={closeModal}
          />
        </Row>
      </Space>

      <div
        style={{
          display: size.width >= 1366 ? "block" : "flex",
          flexDirection: "row",
          justifyContent: "center",
          margin: "auto",
          paddingTop: "1rem",
          maxHeight: "calc(95vh)",
          overflowY: "auto",
        }}
      >
        <Steps
          style={{
            margin: "auto",
            padding: "0 1rem",
            width: size.width >= 1366 ? "auto" : "400px",
          }}
          direction={size.width >= 1366 ? "horizontal" : "vertical"}
          // size="small"
          items={items}
        />
      </div>
      {/* <div className="table-addition" style={{ padding: "0.5rem 0.5rem" }}>
        <Row
          justify={"end"}
          style={{ padding: "0", paddingTop: "0.5rem" }}
          className="button-row"
        >
          <Space>
            <ButtonCustom
              label="Đóng"
              onClick={() => {
                closeModal();
              }}
            />
          </Space>
        </Row>
      </div> */}
    </Modal>
  );
};

export default TimelineModal;
