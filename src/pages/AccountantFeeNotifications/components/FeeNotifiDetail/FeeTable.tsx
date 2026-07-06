import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import ButtonCustom from "components/ButtonCustom";
import { DynamicTable } from "components/DynamicTable";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { AssetLandInfoType } from "constant/types/appraisalFile";
import { FeeContentType } from "constant/types/appraisalFilesDetail";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { randomId } from "utils";
import { useGetFeeNotificationContent } from "utils/request/useFeeNotifications";

const { INPUT_NUMBER, INPUT, SELECT } = TYPE_FIELD;

type Props = {
  data: FeeContentType[];
  notificationStatus: string;
};
type RefProps = {
  feeContentsData: () => void;
};
const feeContentInit: FeeContentType = {
  feeContentId: null,
  feeNotificationId: null,
  key: randomId(),
  content: "",
  code: "",
  contentId: 0,
  dateConfirm: "",
  dateCreate: "",
  dateModify: "",
  dateNotification: "",
  dateUpload: "",
  fileName: "",
  isChecked: false,
  note: "",
  noteByLos: "",
  price: 0,
  status: 0,
  statusEms: null,
  totalPrice: 0,
  whoCreate: "",
  reducedFee: 0,
  reduceFeePercent: 0,
};

const FeeTable = forwardRef<RefProps, Props>((props, ref) => {
  const { data = [], notificationStatus } = props;
  const [form] = Form.useForm();
  const { data: contentsData } = useGetFeeNotificationContent();

  const [dataSource, setDataSource] = useState<FeeContentType[]>([]);
  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: FeeContentType[]
    ) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };
  const handleAddFeeContent = () => {
    setDataSource([...dataSource, feeContentInit]);
  };
  const handleDeleteFeeContent = (id: string) => {
    const newFeeContentData = dataSource.filter(
      (item) => item.feeNotificationId !== id
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
      width: "3%",
      align: "center",
      render: (value: any, _, index: number) => index + 1,
    },
    {
      key: 2,
      title: "Nội dung",
      dataIndex: "content",
      width: "11%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "content"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
            ]}
            type={SELECT}
            value={value}
            options={
              contentsData?.map((item: any) => ({
                value: item.contentId,
                label: item.content,
              })) || []
            }
            onChange={(value: any) =>
              handleRowChange({ content: value }, index)
            }
          />
        );
      },
    },
    {
      key: 3,
      title: "Mã",
      dataIndex: "code",
      width: "8%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "code"]}
            type={INPUT}
            value={value}
            disable={true}
            placeholder="Hệ thống tự tạo"
          />
        );
      },
    },
    {
      key: 4,
      title: "ĐVT",
      dataIndex: "dvt",
      width: "8%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "dvt"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
            ]}
            type={INPUT}
            value={value}
            onChange={(e: any) =>
              handleRowChange({ dvt: e.target.value }, index)
            }
          />
        );
      },
    },
    {
      key: 5,
      title: "Số lượng",
      dataIndex: "quantity",
      width: "10%",
      align: "center",
      render: (value: any, _, index: number) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "2px" }}
            className="quantity-input-container"
          >
            <ButtonCustom
              icon={<MinusOutlined />}
              type="text"
              ghost
              onClick={() => {
                if (Number(value) === 1) return;
                handleRowChange({ quantity: Number(value) - 1 }, index);
              }}
            />
            <FormItem
              name={["data", index, "quantity"]}
              rules={[
                {
                  required: true,
                  message: "Nhập thông tin",
                },
                {
                  validator: async (_, value) => {
                    if (Number(value) < 0) {
                      return Promise.reject(new Error("Số tiền không được âm"));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              type={INPUT_NUMBER}
              min={1}
              value={value}
              onChange={(value: string) => {
                handleRowChange({ quantity: value }, index);
              }}
              currencable
            />
            <ButtonCustom
              icon={<PlusOutlined />}
              type="text"
              ghost
              onClick={() => {
                handleRowChange({ quantity: Number(value) + 1 }, index);
              }}
            />
          </div>
        );
      },
    },
    {
      key: 6,
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: "10%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "unitPrice"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
              {
                validator: async (_, value) => {
                  if (Number(value) < 0) {
                    return Promise.reject(new Error("Số tiền không được âm"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            type={INPUT_NUMBER}
            currencable
            isRounded
            min={0}
            value={value}
            onChange={(value: string) => {
              handleRowChange({ unitPrice: value }, index);
            }}
          />
        );
      },
    },
    {
      key: 7,
      title: "VAT",
      dataIndex: "vat",
      width: "9%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "vat"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
            ]}
            percentable
            type={INPUT_NUMBER}
            max={100}
            min={0}
            addonAfter={"%"}
            value={value}
            onChange={(value: string) => {
              handleRowChange({ vat: value }, index);
            }}
          />
        );
      },
    },
    {
      key: 8,
      title: "Giảm phí",
      dataIndex: "reducedFee",
      width: "9%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "reducedFee"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
            ]}
            max={100}
            min={0}
            percentable
            type={INPUT_NUMBER}
            addonAfter={"%"}
            value={value}
            onChange={(value: string) => {
              handleRowChange({ reducedFee: value }, index);
            }}
          />
        );
      },
    },
    {
      key: 9,
      title: "Thành tiền",
      dataIndex: "totalPrice",
      width: "10%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            name={["data", index, "totalPrice"]}
            rules={[
              {
                required: true,
                message: "Nhập thông tin",
              },
              {
                validator: async (_, value) => {
                  if (Number(value) < 0) {
                    return Promise.reject(new Error("Số tiền không được âm"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            type={INPUT_NUMBER}
            currencable
            isRounded
            value={value}
            disable
          />
        );
      },
    },
    {
      key: 11,
      title: "Tài liệu",
      dataIndex: "document",
      width: "10%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            type={INPUT}
            value={value}
            onChange={(e: any) =>
              handleRowChange({ document: e.target.value }, index)
            }
          />
        );
      },
    },
    {
      key: 12,
      title: "Ghi chú",
      dataIndex: "note",
      width: "10%",
      render: (value: any, _, index: number) => {
        return (
          <FormItem
            type={INPUT}
            value={value}
            onChange={(e: any) =>
              handleRowChange({ note: e.target.value }, index)
            }
          />
        );
      },
    },
  ];

  useImperativeHandle(ref, () => ({
    feeContentsData: async () => {
      try {
        const validateForm = await form.validateFields();
        return [dataSource, validateForm];
      } catch (error: any) {
        return [dataSource, false];
      }
    },
  }));
  useEffect(() => {
    setDataSource(data);
    form.setFieldsValue({ data });
  }, []);
  useEffect(() => {
    form.setFieldsValue({ data: dataSource });
  }, [dataSource]);

  return (
    <Form
      labelWrap
      labelAlign="left"
      size="small"
      form={form}
      component={false}
      initialValues={{
        data: dataSource,
      }}
      disabled={notificationStatus !== "0" && notificationStatus !== "3"}
    >
      <DynamicTable
        columns={columns}
        dataSource={dataSource || []}
        onAddRow={() => {
          handleAddFeeContent();
        }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        onRemoveRow={(data, index: number) => {
          handleDeleteFeeContent(data.feeNotificationId);
        }}
      />
      {notificationStatus !== "0" && notificationStatus !== "3" && (
        <p style={{ textAlign: "center", color: "#999" }}>
          Hồ sơ đã chuyển sang trạng thái khác, không thể chỉnh sửa
        </p>
      )}
    </Form>
  );
});
export default FeeTable;
