import { Card, Form, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { RcFile } from "antd/es/upload";
import { ecmFileApi } from "apis/ecmFile";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { DynamicTable } from "components/DynamicTable";
import FormItem from "components/InputFields/FormItem";
import { ROLES } from "constant/common";
import { TYPE_FIELD } from "constant/enums";
import { AppraisalFileType } from "constant/types";
import { AssetLandInfoType } from "constant/types/appraisalFile";
import { FeeContentType } from "constant/types/appraisalFilesDetail";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { randomId } from "utils";
import { isContainRole } from "utils/common";
import { useAppraisalFileDetail } from "utils/request";
import "./style.scss";
const { INPUT_NUMBER, INPUT, SELECT } = TYPE_FIELD;

type Props = {
  data: FeeContentType[];
  dataAll: any;
  appraisalFileId: string;
  mutateFeeModalTable: any;
};

type RefProps = {
  feeContentsData: () => void;
  uploadFile: () => void;
  checkCheckBox: FeeContentType[];
  clearSelectedRows: () => void;
};

const feeContentInit: FeeContentType = {
  feeContentId: null,
  feeNotificationId: null,
  key: "",
  content: "",
  code: "",
  dateConfirm: "",
  dateCreate: "",
  dateModify: "",
  ngayThuTien: "",
  ngayXuatHd: "",
  receiveDate: "",
  reductFeeDate: "",
  dateNotification: "",
  dateUpload: "",
  fileName: "",
  ecmId: "",
  isChecked: false,
  note: "",
  contentId: null,
  price: null,
  daThu: null,
  soTienXuatHoaDonThucTe: null,
  soTienCanXuatHoaDon: null,
  totalPrice: null,
  status: 0,
  statusEms: null,
  noteByLos: "",
  whoCreate: "",
  received: 0,
  congNo: 0,
  revenue: 0,
  reducedFee: 0,
  reduceFeePercent: 0,
};

/*Màn này không sử dụng nữa*/

const FeeModalTable = forwardRef<RefProps, Props>((props, ref) => {
  const { data = [], dataAll, appraisalFileId, mutateFeeModalTable } = props;
  const [selectedRows, setSelectedRows] = useState<FeeContentType[]>([]);
  const [dataSource, setDataSource] = useState<FeeContentType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const {
    data: dataAppraisalFileDetail,
  }: {
    data: AppraisalFileType;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useAppraisalFileDetail(appraisalFileId);

  const handleAddFeeContent = () => {
    const newFeeContent = { ...feeContentInit, key: randomId() };
    setDataSource([...dataSource, newFeeContent]);
  };

  const sendMail =
    dataAppraisalFileDetail && dataAppraisalFileDetail.typeCreated === 0;

  const handleDeleteFeeContent = (key: string) => {
    const newFeeContentData = dataSource.filter(
      (item) => item.key !== key
    ) as FeeContentType[];
    setDataSource(newFeeContentData);
  };

  const handleRowChange = (value: any, index: number) => {
    const tmpDataSource = [...dataSource];
    tmpDataSource[index] = { ...tmpDataSource[index], ...value };

    setDataSource(tmpDataSource);
  };

  const columns: ColumnsType<AssetLandInfoType> = [
    {
      key: 1,
      title: "STT",
      align: "center",
      fixed: "left",
      width: "35px",
      render: (value: any, _, index: number) => index + 1,
    },
    {
      key: 2,
      title: "Nội dung",
      dataIndex: "content",
      fixed: "left",
      width: "150px",
      render: (value: any, _, index: number) => (
        <FormItem type={INPUT} value={value} disable={true} />
      ),
    },
    {
      key: 3,
      title: "Mã",
      dataIndex: "code",
      fixed: "left",
      width: "150px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "code"]}
            type={INPUT}
            value={value}
            disable={true}
            tooltipInput={value}
          />
        );
      },
    },
    {
      key: 10,
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: "200px",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            type={SELECT}
            allowClear={false}
            value={value}
            options={[
              {
                value: 0,
                label: "Chờ báo phí",
                disabled:
                  data[index]?.status === 1 || data[index]?.status === 3
                    ? true
                    : false,
              },
              {
                value: 1,
                label: "Đã báo phí",
                disabled: data[index]?.status === 3 ? true : false,
              },
              // {
              //   value: 2,
              //   label: "Từ chối",
              //   disabled:
              //     data[index]?.status === 1 || data[index]?.status === 3
              //       ? true
              //       : false,
              // },
              // { value: 2, label: "Từ chối" },
              {
                value: 2,
                label: "Từ chối",
                disabled: data[index]?.status === 3 ? true : false,
              },
              { value: 3, label: "Chưa thu tiền" },
              { value: 4, label: "Đã thu tiền" },
              { value: 5, label: "Đã xuất hoá đơn" },
            ]}
            disable={true}
          />
        );
      },
    },
    {
      key: 12,
      title: "Công nợ",
      dataIndex: "congNo",
      width: "200px",
      render: (value: any, record: any, index: number) => {
        return (
          <FormItem
            type={INPUT_NUMBER}
            currencable
            isRounded
            onChange={(value: any) => {
              handleRowChange(
                { congNo: value, price: value, totalPrice: value },
                index
              );
            }}
            disable={record.status !== 1}
            value={value}
          />
        );
      },
    },
    {
      key: 12,
      title: "Tính phí theo",
      dataIndex: "tinhPhiTheo",
      width: "200px",
      render: (value: any, record: any, index: number) => {
        return (
          <FormItem
            type={INPUT}
            currencable
            disable={record.status !== 1}
            value={value}
            onChange={(e: any) => {
              handleRowChange({ tinhPhiTheo: e.target.value }, index);
            }}
          />
        );
      },
    },
  ];

  const handleUploadFileEcm = async () => {
    const fileUploadedInfo = [];

    const handleUpload = async (item: any) => {
      const formDataFile = new FormData();
      formDataFile.append("file", item.fileList[0] as RcFile);

      let res;
      let success = false;
      let retryCount = 0;
      const maxRetries = 3;

      while (!success && retryCount < maxRetries) {
        try {
          res = await ecmFileApi.uploadECMFile(formDataFile, {
            fileType: "legalDocument",
            isChangeFileName: true,
          });

          if (res.data?.statusCodeValue === 200 && res.data?.body?.ecmId) {
            message.success(`Upload file ${item.fileList[0].name} thành công!`);
            success = true;
          } else {
            throw new Error(`Lỗi server: ${JSON.stringify(res.data)}`);
          }
        } catch (error) {
          retryCount++;

          // if (retryCount > 1) {
          // Chỉ hiển thị thông báo lỗi từ lần thứ hai trở đi
          // message.error(`Lỗi khi upload file ${item.fileList[0].name}!`);
          // }

          // Thêm cơ chế giảm tần suất gọi API ở đây nếu cần (delay, backoff, ...)
        }
      }

      if (!success) {
        // message.error(
        //   `Upload file ${item.fileList[0].name} thất bại sau ${maxRetries} lần thử!`
        // );
        message.error(`Upload file ${item.fileList[0].name} thất bại!`);
        return null;
      }

      return { ...res?.data?.body, key: item.key };
    };

    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i];
      if (item.fileList && item.fileList.length > 0) {
        const result = await handleUpload(item);
        fileUploadedInfo.push(result);
      }
    }

    return fileUploadedInfo;
  };

  const handleFeeContentsData = async () => {
    try {
      const updatedDataSource = dataSource.map((item, index) => {
        let contentId;
        if (item.content === "Phí đợt 1") {
          contentId = 1;
        } else if (item.content === "Phí đợt 2") {
          contentId = 2;
        } else if (item.content === "Công tác phí") {
          contentId = 3;
        }
        return {
          ...item,
          contentId: contentId !== undefined ? contentId : 0,
        };
      });
      setDataSource(updatedDataSource);

      return [updatedDataSource];
    } catch (error: any) {
      return [{}, false];
    }
  };

  const clearSelectedRows = () => {
    onSelectChange([]);
    setSelectedRows([]);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useImperativeHandle(ref, () => ({
    feeContentsData: handleFeeContentsData,
    uploadFile: handleUploadFileEcm,
    // uploadFileResult: handleUploadFileEcmResult,
    checkCheckBox: selectedRows,
    clearSelectedRows: clearSelectedRows,
  }));

  useEffect(() => {
    const updatedData: any = data.map((item) => ({
      ...item,
      reducedFee:
        item.reducedFee === null || item.reducedFee === undefined
          ? 0
          : Number(item.reducedFee.toFixed(2)),
      price:
        item.price === null || item.price === undefined
          ? 0
          : Number(item.price.toFixed(2)),
      totalPrice:
        item.totalPrice === null || item.totalPrice === undefined
          ? 0
          : Number(item.totalPrice.toFixed(2)),
      daThu:
        item.daThu === null || item.daThu === undefined
          ? 0
          : item.daThu && Number(item.daThu.toFixed(2)),
      received:
        item.received === null || item.received === undefined
          ? 0
          : item.received && Number(item.received.toFixed(2)),
      congNo:
        item.congNo === null || item.congNo === undefined
          ? 0
          : item.congNo && Number(item.congNo.toFixed(2)),
      revenue:
        item.revenue === null || item.revenue === undefined
          ? 0
          : item.revenue && Number(item.revenue.toFixed(2)),
      soTienCanXuatHoaDon:
        item.soTienCanXuatHoaDon !== null &&
        item.soTienCanXuatHoaDon !== undefined
          ? Number(item.soTienCanXuatHoaDon.toFixed(2))
          : item.totalPrice !== null && item.totalPrice !== undefined
          ? Number(item.totalPrice.toFixed(2))
          : item.soTienXuatHoaDonThucTe !== null &&
            item.soTienXuatHoaDonThucTe !== undefined
          ? Number(item.soTienXuatHoaDonThucTe.toFixed(2))
          : item.revenue !== null && item.revenue !== undefined
          ? Number(item.revenue.toFixed(2))
          : 0,
      soTienXuatHoaDonThucTe:
        item.soTienXuatHoaDonThucTe === null ||
        item.soTienXuatHoaDonThucTe === undefined
          ? 0
          : item.soTienXuatHoaDonThucTe &&
            Number(item.soTienXuatHoaDonThucTe.toFixed(2)),
    }));
    setDataSource(updatedData);
    onSelectChange([]);
  }, [data]);

  return (
    <Card
      className="card-container-debt-fee-table"
      size="small"
      style={{ padding: "4px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Sửa phí và công nợ thủ công" />
      </div>
      <Form
        labelWrap
        labelAlign="left"
        size="small"
        component={false}
        initialValues={{
          data: dataSource,
        }}
      >
        <DynamicTable
          hiddenRow={true}
          columns={columns}
          dataSource={dataSource || []}
          onAddRow={() => {
            handleAddFeeContent();
          }}
          onRemoveRow={(data, index: number) => {
            data.status !== 1 && handleDeleteFeeContent(data.key);
          }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: (record: any) => {
              let disabled;
              if (!record.code) {
                // Chưa tạo hoặc không có mã thì không cho check box
                disabled = true;
              } else if (!isContainRole(ROLES.CBTH)) {
                // Role khác cbth thì không cho check box
                disabled = true;
              } else if (isContainRole(ROLES.CBTH) || sendMail) {
                // Role cbth hoặc hstc thì cho check box
                disabled = false;
              }
              return {
                onMouseEnter: () => {
                  if (record.statusEms === 2) {
                    message.info("Hồ sơ đã có yêu cầu thu tiền!");
                  } else if (record.statusEms < 2) {
                    message.info("Hồ sơ chưa có yêu cầu thu tiền!");
                  } else if (record.statusEms === 3) {
                    message.info("Hồ sơ đã được đề nghị xuất hóa đơn!");
                  } else if (record.statusEms === 4) {
                    message.info("Hồ sơ đã được thu hồi đề nghị xuất hóa đơn!");
                  } else if (record.statusEms === 5) {
                    message.info("Hồ sơ đã xuất hóa đơn!");
                  }
                },
                onMouseLeave: () => {
                  message.destroy();
                },
                disabled,
              };
            },
            onSelect: (record, selected, selectedRows: any, nativeEvent) => {
              setSelectedRows(selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              setSelectedRows(selectedRows);
            },
          }}
        />
      </Form>
    </Card>
  );
});
export default FeeModalTable;
