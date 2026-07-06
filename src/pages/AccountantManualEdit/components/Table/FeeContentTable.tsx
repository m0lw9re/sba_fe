import { Space, Table, TableColumnsType } from "antd";
import { DATE_TIME_FORMAT } from "constant/enums";
import { FeeContentType } from "constant/types/appraisalFilesDetail";
import dayjs from "dayjs";
import { numberUtils } from "utils";

type Props = {
  feeContent: FeeContentType[];
};
const FeeContentTable = ({ feeContent }: Props) => {
  const columns: TableColumnsType<FeeContentType> = [
    { title: "Mã TB/HĐ", dataIndex: "code", key: "code" },
    { title: "Nội dung", dataIndex: "content", key: "content" },
    {
      title: "Ngày xác nhận",
      dataIndex: "dateConfirm",
      key: "dateConfirm",
      render: (value: string) => {
        return value
          ? dayjs(value).format(`${DATE_TIME_FORMAT.day} - HH:mm:ss`)
          : // (
          //   <span style={{ color: "red" }}>Không có ngày xác nhận!</span>
          // );
          null;
      },
    },
    {
      title: "Số tiền",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (value: number) => {
        // return value ? (
        //   numberUtils.formatNumber(value)
        // ) : (
        //   <span style={{ color: "red" }}>Không có số tiền!</span>
        // );

        return numberUtils.formatNumber(value);
      },
    },
    {
      title: "Công nợ",
      dataIndex: "congNo",
      key: "congNo",
      align: "right",
      render: (value: number) => {
        // return value ? (
        //   numberUtils.formatNumber(value)
        // ) : (
        //   <span style={{ color: "red" }}>Không có công nợ!</span>
        // );
        return numberUtils.formatNumber(value);
      },
      // render: (value: any, record: any, index: number) => {
      //   return record.received > 0 || record.statusEms === 3 ? value : 0;
      // },
    },
    {
      title: "Đã thu",
      dataIndex: "daThu",
      key: "daThu",
      align: "right",
      render: (value: number) => {
        // return value ? (
        //   numberUtils.formatNumber(value)
        // ) : (
        //   <span style={{ color: "red" }}>Không có số tiền đã thu!</span>
        // );
        return numberUtils.formatNumber(value);
      },
    },
    {
      title: "Ngày thu tiền",
      dataIndex: "ngayThuTien",
      key: "ngayThuTien",
      render: (value: string) => {
        return value
          ? dayjs(value).format(`${DATE_TIME_FORMAT.day} - HH:mm:ss`)
          : //  (
          //   <span style={{ color: "red" }}>Không có ngày thu tiền!</span>
          // );
          null;
      },
    },
    // { title: 'Người tạo', dataIndex: 'whoCreate', key: 'whoCreate' },
    // {title: 'Ngày xuất hóa đơn',dataIndex: 'dateConfirm',key: 'dateConfirm'},
    // {
    //   title: 'Giảm phí',
    //   dataIndex: 'reducedFee',
    //   key: 'reducedFee',
    //   render: (value: number) => {
    //     return numberUtils.formatNumber(value);
    //   },
    // },
    // {
    //   title: 'Tổng tiền',
    //   dataIndex: 'totalPrice',
    //   key: 'totalPrice',
    //   render: (value: number) => {
    //     return numberUtils.formatNumber(value);
    //   },
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: number) => {
        let statusText = "";
        switch (value) {
          case 0:
            statusText = "Chờ báo phí";
            break;
          case 1:
            statusText = "Đã báo phí";
            break;
          case 2:
            statusText = "Từ chối";
            break;
          case 3:
            statusText = "Chưa thu tiền";
            break;
          case 4:
            statusText = "Đã thu tiền";
            break;
          default:
            break;
        }
        return statusText;
      },
    },
  ];
  return (
    <Space
      direction="vertical"
      style={{
        marginTop: "8px",
        marginBottom: "16px",
        width: "100%",
        backgroundColor: "#fbfbfb",
      }}
    >
      <Table
        columns={columns}
        bordered={true}
        size="small"
        dataSource={feeContent}
        pagination={false}
      />
    </Space>
  );
};

export default FeeContentTable;
