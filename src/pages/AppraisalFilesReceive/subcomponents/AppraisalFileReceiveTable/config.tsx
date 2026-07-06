import { Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { AppraisalFilesTypeUpdate } from "constant/types";

const defaulColumns: ColumnsType<AppraisalFilesTypeUpdate> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    width: "50px",
    fixed: "left",
    align: "center",
  },
  {
    key: 2,
    title: "Mã đề nghị",
    dataIndex: "code",
    width: "120px",
    fixed: "left",
    render: (code) => (
      <>
        <Typography.Link underline>{code}</Typography.Link>
      </>
    ),
  },
  {
    key: 3,
    title: "Phân loại tài sản",
    dataIndex: "assetType",
    render: (text) => (
      <Tooltip title={text}>
        <div className="inline-text">{text}</div>
      </Tooltip>
    ),
  },
  {
    key: 4,
    title: "Số tờ trình",
    dataIndex: "numberOfLegalDocument",
    width: "120px",
    render: (numberOfLegalDocument) => (
      <>
        <Typography.Link underline>{numberOfLegalDocument}</Typography.Link>
      </>
    ),
  },
  {
    key: 5,
    title: "Địa chỉ/Tên tài sản",
    dataIndex: "addressCustomDetail",
    render: (text) => (
      <Tooltip title={text}>
        <div className="inline-text">{text}</div>
      </Tooltip>
    ),
  },
  {
    key: 6,
    title: "Tên khách hàng",
    dataIndex: "customerName",
  },
  {
    key: 7,
    title: "Luồng",
    dataIndex: "stream",
  },
  {
    key: 8,
    title: "CV khảo sát",
    dataIndex: "surveyName",
  },
  {
    key: 9,
    title: "CV phân tích",
    dataIndex: "alanystName",
  },
  {
    key: 9,
    title: "Người gửi",
    dataIndex: "senderName",
  },
  {
    key: 10,
    title: "Trạng thái",
    dataIndex: "status",
    width: "150px",
    fixed: "right",
  },
  // {
  //   key: 11,
  //   title: "Hành động",
  //   width: "80px",
  //   align: "center",
  //   fixed: "right",
  // },
];

const mockData: Array<AppraisalFilesTypeUpdate> = [];

for (let i = 0; i <= 10; i++) {
  const item: AppraisalFilesTypeUpdate = {
    key: i + 1,
    code: "23.000308.SBA",
    assetType: "QSDĐ và tài sản gắn liền với đất",
    numberOfLegalDocument: "91829182",
    customerName: "Nguyễn Văn A",
    stream: "Thông thường",
    surveyName: "Nguyễn Văn B",
    alanystName: "Nguyễn Văn C",
    senderName: "Nguyễn Văn D",
    status: "Đã phê duyệt tờ trình",
    assetAddress:
      "Xã Đông Hưng A, Huyện An sinh, Xã Hoàng cầu, khu đất bờ sông",
  };
  mockData.push(item);
}

export { defaulColumns, mockData };
