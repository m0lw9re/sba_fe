import { Card, Form, Row, Space, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import {
  FeeContentType,
  FeeNotificationType,
} from "constant/types/appraisalFilesDetail";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFeeNotifications, useGetAllFeeNotifications } from "utils/request";
import FeeModalTable from "./FeeTable";
const { INPUT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

type StatusMessages = {
  [key: string]: string;

  "0": string;
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  "6": string;
};

const FeeModal = () => {
  const appraisalFileIdRef = useRef(null);
  const feeNotificationIdRef = useRef(null);
  const isFirstMount = useRef<boolean>(true);
  const { state } = useLocation();

  appraisalFileIdRef.current = state?.appraisalFileId;
  const appraisalFileIdProps = appraisalFileIdRef.current;
  const navigate = useNavigate();

  feeNotificationIdRef.current = state?.feeNotificationId;
  const feeNotificationIdProps = feeNotificationIdRef.current;

  const [submit, setSubmit] = useState<boolean>(false);

  const [proposalCode, setProposalCode] = useState<string>("");
  const [reportCode, setReportCode] = useState<string>("");
  const [appraisalFileId, setAppraisalFileId] = useState<string>("");
  const [temporaryKeyword, setTemporaryKeyword] = useState({
    proposalCode: "",
    reportCode: "",
  });
  // const { data: dataAllFeeNotifications } = useGetAllFeeNotifications({
  //   limit: 1000,
  // });

  const { data, error, mutate } = useFeeNotifications(appraisalFileId);

  const btnRefFeeContentsTable = useRef<any>();

  // useEffect(() => {
  //   setAppraisalFileId(
  //     dataAllFeeNotifications
  //       ?.filter((dataFilters: any) => {
  //         return (
  //           dataFilters.proposalCode === proposalCode ||
  //           dataFilters.reportCode === reportCode
  //         );
  //       })
  //       .map((filteredData: any) => filteredData.appraisalFileId)
  //   );
  // }, [proposalCode, reportCode]);

  useEffect(() => {
    if (appraisalFileIdProps) setAppraisalFileId(appraisalFileIdProps);
  }, [appraisalFileIdProps || feeNotificationIdProps]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const parts = currentUrl.split("/");
    const lastPart = parts[parts.length - 1];

    if (lastPart && !(appraisalFileIdProps || feeNotificationIdProps)) {
      setAppraisalFileId(lastPart.toString());
    }
  }, []);

  const form = useFormik({
    initialValues: data ? data : {},
    // validationSchema: formSchema,
    onSubmit: async (data: FeeNotificationType) => {
      try {
        const feeContentsData =
          await btnRefFeeContentsTable.current?.feeContentsData();
        const res = await appraisalFilesApi.updateFeeNotificationInfo({
          ...data,
          feeContents: [...feeContentsData[0]],
        });
        if (res.data.code === 200) {
          message.success(res.data.message);
          mutate();
        }
        setSubmit(true);
      } catch (error: any) {
        message.error("Cập nhật số tiền xuất hóa đơn thất bại!");
      } finally {
        setSubmit(false);
      }
    },
  });

  useEffect(() => {
    if (data) {
      form.setValues(data);

      if (isFirstMount) {
        const updatedDataFeeContents: FeeContentType[] = data.feeContents.map(
          (item: FeeContentType) => ({
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
          })
        );
        (async () => {
          try {
            await appraisalFilesApi.updateDebtFeeNotificationInfo(
              updatedDataFeeContents
            );
          } catch (error) {
            console.log(error);
          }
        })();
        isFirstMount.current = false;
      }
    } else {
      form.setValues({
        feeNotificationId: null,
        appraisalFileId: null,
        proposalCode: "",
        reportCode: "",
        notificationCode: "",
        assetName: "",
        addressAsset: "",
        appraisalPurposeId: "",
        natureId: "",
        natureName: "",
        branchCode: "",
        branchName: "",
        appraisalPurposeName: "",
        branch: {
          branchCode: "",
          branchName: "",
          address: "",
          email: "",
          phoneNumber: "",
          hibernateLazyInitializer: {},
        },
        fullName: "",
        addressCustomer: "",
        mst: "",
        email: "",
        status: "",
        whoCreate: "",
        dateCreate: "",
        dateCreate2nd: "",
        dateModify: "",
        dateModify2nd: "",
        feeContents: [],
      });
    }
  }, [data]);

  const statusMessages: StatusMessages = {
    "0": "Chưa tạo nội dung báo phí",
    "1": "Đã tạo phí thẩm định đợt 1",
    "2": "Đã tạo phí thẩm định đợt 2",
    "3": "Đã đồng ý báo phí đợt 1",
    "4": "Đã từ chối báo phí đợt 1",
    "5": "Đã đồng ý báo phí đợt 2",
    "6": "Đã từ chối báo phí đợt 2",
    "7": "Đã báo phí đợt 1",
    "8": "Đã báo phí đợt 2",
    // "7": "Từ chối công tác phí",
    // "8": "Báo lại công tác phí",
    // "9": "Đồng ý phí báo lại công tác phí",
    // "10": "Báo lại phí đợt 2",
    // "11": "Đồng ý phí báo lại đợt 2",
  };

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã đề nghị:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      disable: true,
      value: temporaryKeyword.proposalCode || form.values.proposalCode,
      onChange: (e: any) => {
        setTemporaryKeyword((prevState) => ({
          ...prevState,
          proposalCode: e.target.value,
        }));
      },
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setProposalCode(temporaryKeyword.proposalCode);
        }
      },
    },
    {
      key: 2,
      label: "Chi nhánh:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values?.branch?.branchName || form.values?.branchName || "",
      disable: true,
    },
    {
      key: 3,
      label: "Số tờ trình:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      disable: true,
      // placeholder: temporaryKeyword.reportCode || form.values.reportCode,
      value: temporaryKeyword.reportCode || form.values.reportCode || "",
      onChange: (e: any) => {
        setTemporaryKeyword((prevState) => ({
          ...prevState,
          reportCode: e.target.value,
        }));
      },
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setReportCode(temporaryKeyword.reportCode);
        }
      },
    },
    {
      key: 4,
      label: "Họ Tên KH:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values.fullName,
      disable: true,
    },
    {
      key: 5,
      label: "Tên tài sản:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      disable: true,
      value: form.values.assetName,
      onChange: (value: string) => {
        form.setValues({ ...form.values, assetName: value });
      },
      error:
        form.errors.assetName && form.touched.assetName
          ? form.errors.assetName
          : "",
    },
    {
      key: 6,
      label: "Địa chỉ KH:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      disable: true,
      value: form.values.addressCustomer,
      onChange: (e: any) => {
        form.setValues({ ...form.values, addressCustomer: e.target.value });
      },
      error:
        form.errors.addressCustomer && form.touched.addressCustomer
          ? form.errors.addressCustomer
          : "",
    },
    {
      key: 7,
      label: "Địa chỉ tài sản:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values.addressAsset,
      disable: true,
    },

    {
      key: 8,
      label: "CCCD/MST:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values.mst,
      disable: true,
    },

    {
      key: 9,
      label: "Mục đích TĐG:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      // value:
      //   feeNotificationStatus.find((item) => item.value == form.values.status)
      //     ?.label || feeNotificationStatus[0].label,
      value: form.values.appraisalPurposeName,
      disable: true,
    },
    {
      key: 10,
      label: "Email:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values.email,
      disable: true,
    },
    {
      key: 11,
      label: "Tính chất:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values.natureName,
      disable: true,
    },
    {
      key: 12,
      label: "Trạng thái:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: statusMessages[form.values.status],
      disable: true,
    },
  ];

  if (error) return null;
  // if ( data && data.status && data.status.toString() !== '8' ) {
  //   message.error("Chỉ được phép chỉnh sửa khi trạng thái là 'Đã báo phí đợt 2'");
  //   navigate(-1);
  //   return null;
  // }

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <div></div>
        <ButtonCustom
          label="Lưu"
          type="primary"
          disabled={appraisalFileId ? false : submit}
          size="small"
          style={{ margin: "3px 0" }}
          bgColor="#2862AF"
          onClick={() => {
            form.submitForm();
          }}
        />
      </div>
      <Space
        direction="vertical"
        size={"small"}
        className="space-assignment"
        style={{ marginBottom: "10px" }}
      >
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
      </Space>
      <div style={{ padding: "10px 0" }}>
        <FeeModalTable
          data={data ? data.feeContents : []}
          ref={btnRefFeeContentsTable}
          dataAll={data ? data : {}}
          appraisalFileId={appraisalFileId}
          mutateFeeModalTable={mutate}
        />
      </div>
    </Card>
  );
};
export default FeeModal;
