import TableCustom from "components/TableCustom";
import { FC, memo } from "react";
import { useAssignments } from "utils/request";
import { ColumnsType } from "antd/es/table";
import { formatDateWithHour } from "utils/date";
import { AssignmentType } from "constant/types/assignment";
import { Button, Form, Modal, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ButtonCustom from "components/ButtonCustom";
import { CloseOutlined } from "@ant-design/icons";
import "./style.scss";
import ComponentsError from "pages/ComponentsError";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  appraisalFileId: string;
};

const AssignmentTable: FC<Props> = ({
  isOpenModal,
  closeModal,
  appraisalFileId,
}) => {
  const { data, isLoading, error } = useAssignments(appraisalFileId);

  const columns: ColumnsType<AssignmentType> = [
    {
      key: 1,
      title: "Bước thực hiện",
      align: "center",
      render: (_, record) => record.jobType?.jobTypeName,
    },
    {
      key: 2,
      title: "Chi nhánh SBA",
      dataIndex: "branch",
      align: "center",
      render: (_, record) => record.companyBranch?.companyBranchName,
    },
    {
      key: 3,
      title: "Người được phân công",
      dataIndex: "staffs",
      render: (staffs, record) => {
        return staffs?.map((el: string, index: number) => (
          <div key={index}>{el}</div>
        ));
      },
      align: "center",
    },
    {
      key: 4,
      title: "Ngày phân công",
      dataIndex: "timeAssigned",
      align: "center",
      render: (timeAssigned) => {
        if (timeAssigned) {
          return <>{formatDateWithHour(timeAssigned)}</>;
        }
      },
    },
    {
      key: 5,
      title: "Người phân công",
      dataIndex: "jobAssigner",
      align: "center",
    },
    {
      key: 6,
      title: "Độ ưu tiên",
      dataIndex: "priorityLevel",
      align: "center",
      render: (priorityLevel) => (priorityLevel === 1 ? "Cao" : "Thấp"),
    },
  ];

  if (error) return <ComponentsError />;

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalViewAssignmentModal"
      style={{ display: "flex", justifyContent: "center", width: "100%" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalViewAssignmentModal-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Lịch sử phân giao hồ sơ" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]}>
            <TableCustom
              bordered={true}
              columns={columns}
              dataSource={data ? data : []}
              isLoading={!data && isLoading}
              limit={data?.limit}
              page={data?.page}
              total={data?.total}
              onLimitChange={(limit) => {}}
              onPageChange={(page) => {}}
            />
          </Row>
          <Row
            justify={"end"}
            style={{ padding: "0", paddingBottom: "4px" }}
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
        </Form>
      </Space>
    </Modal>
  );
};

export default memo(AssignmentTable);
