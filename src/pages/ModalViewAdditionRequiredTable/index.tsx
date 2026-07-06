import TableCustom from "components/TableCustom";
import { FC, memo } from "react";
import { useAdditionRequired } from "utils/request";
import { ColumnsType } from "antd/es/table";
import { formatDateWithHour } from "utils/date";
import { Button, Form, Modal, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ButtonCustom from "components/ButtonCustom";
import { CloseOutlined } from "@ant-design/icons";
import "./style.scss"
import ComponentsError from "pages/ComponentsError";
import { AdditionRequiredType } from "constant/types/additionRequired";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  appraisalFileId: string;
};

const AdditionRequiredTable: FC<Props> = ({
  isOpenModal,
  closeModal,
  appraisalFileId,
}) => {
  const { data, isLoading, error } = useAdditionRequired(appraisalFileId);

  const columns: ColumnsType<AdditionRequiredType> = [
    {
      key: 1,
      title: 'STT',
      align: 'center',
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      key: 2,
      title: 'Loại hồ sơ',
      dataIndex: 'name',
    },
    {
      key: 3,
      title: 'Nội dung yêu cầu',
      dataIndex: 'requestContent',
      align: 'center',
    },
    {
      key: 4,
      title: 'Người yêu cầu',
      dataIndex: 'petitioner',
      align: 'center',
    },
    {
      key: 5,
      title: 'Ngày yêu cầu bổ sung hồ sơ',
      dataIndex: 'createdDate',
      align: 'left',
      render: (createdDate: string) => (
        <>{createdDate ? formatDateWithHour(createdDate) : null}</>
      ),
    },
  ];

  if (error) return <ComponentsError />;

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalViewAdditionRequired"
      style={{ display: "flex", justifyContent: "center", width: "100%" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalViewAdditionRequired-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Lịch sử yêu cầu bổ sung hồ sơ" />
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
          <Row justify={"end"} style={{ padding: "0", paddingBottom: "4px" }} className="button-row">
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

export default memo(AdditionRequiredTable);
