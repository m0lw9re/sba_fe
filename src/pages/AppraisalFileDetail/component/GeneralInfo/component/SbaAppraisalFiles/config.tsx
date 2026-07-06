import { Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { AppraisalFileSbaTableType } from "constant/types";
import { Link } from "react-router-dom";
import { formatDateWithHour } from "utils/date";

const defaultColumns: ColumnsType<AppraisalFileSbaTableType> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "3%",
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 'legalDocumentTypeName',
    title: "Loại tài liệu",
    dataIndex: "legalDocumentTypeName",
    width: "25%",
    align: "left",
    render: (documentType) => (
      <>
        <Typography.Link underline>{documentType}</Typography.Link>
      </>
    ),
  },
  {
    key: 2,
    title: "Nội dung",
    dataIndex: "documentContent",
    align: "left",
    width: "12%",
    render: (documentContent) => {
      // Kiểm tra nếu trường là một URL
      if (/^(ftp|http|https):\/\/[^ "]+$/.test(documentContent)) {
        return (
          <Link to={documentContent} target="_blank" className="link-underline">
            {documentContent}
          </Link>
        );
      } else {
        return <Typography.Text>{documentContent}</Typography.Text>;
      }
    },
  },
  {
    key: 3,
    title: "Tên file",
    dataIndex: "filename",
    align: "left",
    width: "20%",
  },
  {
    key: 4,
    title: "Ngày đưa lên",
    dataIndex: "dateUpload",
    align: "center",
    width: "10%",
    render: (dateUpload: string) => (
      <>{dateUpload ? formatDateWithHour(dateUpload) : null}</>
    ),
  },
  {
    key: 5,
    title: "Người đưa lên",
    dataIndex: "whoUpload",
    align: "left",
    width: "12%",
  },
  // {
  //   key: 6,
  //   title: "Mức độ tài liệu",
  //   dataIndex: "isRequired",
  //   align: "left",
  //   width: "12%",
  //   render: (isRequired: number) => (
  //     <>{isRequired ? "Bắt buộc" : "Không bắt buộc"}</>
  //   ),
  // },
  {
    key: "action",
    width: "5%",
    align: "center",
  },
];

export { defaultColumns };
