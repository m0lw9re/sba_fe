import { Alert, Card, Form, Modal, Row, Space, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import {
  FeeContentType,
  FeeNotificationType,
} from "constant/types/appraisalFilesDetail";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useAppraisalFileDetail,
  useFeeNotifications,
  useGetAllFeeNotifications,
} from "utils/request";
import FeeModalTable from "./FeeTable";
import TotalDebt from "./TotalDebt";
import { DATE_TIME_FORMAT } from "constant/enums";
import dayjs from "dayjs";

import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import { syncEMSApi } from "apis/syncEMS";
import "./style.scss";
const { INPUT, DATE_PICKER } = TYPE_FIELD;

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
  const { isSetConfirmButton } = useSelector(
    (state: RootState) => state.accountantDebtDetailSlice
  );
  const appraisalFileIdRef = useRef(null);
  const feeNotificationIdRef = useRef(null);
  const isFirstMount = useRef<boolean>(true);
  const { state } = useLocation();
  let { id }: { id?: string } = useParams();
  appraisalFileIdRef.current = state?.appraisalFileId;
  const appraisalFileIdProps = appraisalFileIdRef.current;

  feeNotificationIdRef.current = state?.feeNotificationId;
  const feeNotificationIdProps = feeNotificationIdRef.current;

  const [submit, setSubmit] = useState<boolean>(false);

  const [proposalCode, setProposalCode] = useState<string>("");
  const [reportCode, setReportCode] = useState<string>("");
  const [appraisalFileId, setAppraisalFileId] = useState<string>("");
  const [feeNotificationId, setFeeNotificationId] = useState<string>("");
  const [feeContentsData, setFeeContentsData] = useState<FeeContentType[]>([]);
  const [temporaryKeyword, setTemporaryKeyword] = useState({
    proposalCode: "",
    reportCode: "",
  });
  // const {
  //   data: dataAllFeeNotifications,
  //   isLoading: isLoadingAllFeeNotifications,
  //   error: errorAllFeeNotifications,
  //   mutate: mutateAllFeeNotifications,
  // } = useGetAllFeeNotifications({ limit: 1000 });

  const { data, isLoading, error, mutate } = useFeeNotifications(id || "");

  const [loading, setLoading] = useState<boolean>(false);
  const btnRefFeeContentsTable = useRef<any>();

  // useEffect(() => {
  //   setAppraisalFileId(
  //     dataAllFeeNotifications?.data
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
    if (feeNotificationIdProps) setFeeNotificationId(feeNotificationIdProps);
  }, [appraisalFileIdProps || feeNotificationIdProps]);

  // useEffect(() => {
  //   const currentUrl = window.location.href;
  //   const parts = currentUrl.split("/");
  //   const lastPart = parts[parts.length - 1];

  //   if (lastPart && !(appraisalFileIdProps || feeNotificationIdProps)) {
  //     setAppraisalFileId(lastPart.toString());
  //   }
  // }, []);

  var body: any;
  const form = useFormik({
    initialValues: data ? data : {},
    // validationSchema: formSchema,
    onSubmit: async (data: FeeNotificationType) => {
      try {
        setSubmit(true);
        setLoading(true);
        try {
          await handleGetTableData();
        } catch (error: any) {
          setLoading(false);
        }
        var resultFile: any;
        // var resultFile2: any;
        try {
          resultFile = await btnRefFeeContentsTable.current?.uploadFile();
          // resultFile2 =
          //   await btnRefFeeContentsTable.current?.uploadFileResult();
        } catch (error: any) {
          setLoading(false);
        }

        if (validateResultProps === false) {
          setLoading(false);
          return;
        }

        // Cho phép xóa những thằng có status chờ báo phí
        let bodyFeeContentCount = 0;
        let dataFeeContentCount = 0;
        let feeContentIds;
        feeContentsDataProps.forEach((item: any) => {
          if (item.code) {
            bodyFeeContentCount++;
          }
        });

        data.feeContents.forEach((item: any) => {
          if (item.code) {
            dataFeeContentCount++;
          }
        });

        if (
          feeContentsDataProps.length < data.feeContents.length ||
          bodyFeeContentCount < dataFeeContentCount
        ) {
          const deleteContentsData = [];
          for (let i = 0; i < data.feeContents.length; i++) {
            let matchingResult = data.feeContents[i];
            let foundMatch = false;
            for (let j = 0; j < feeContentsDataProps.length; j++) {
              if (feeContentsDataProps[j]?.key === data.feeContents[i]?.key) {
                foundMatch = true;
                break;
              }
            }
            if (!foundMatch) {
              deleteContentsData.push(matchingResult);
            }
          }
          feeContentIds = deleteContentsData.map((item) => ({
            feeContentId: item.feeContentId,
            feeNotificationId: item.feeNotificationId,
          }));
          try {
            setLoading(true);
            for (const item of feeContentIds) {
              await appraisalFilesApi.deleteFeeNotificationInfo(
                item.feeNotificationId,
                item.feeContentId
              );
            }
            setLoading(false);
          } catch (error) {
            message.error("Cập nhật doanh thu, công nợ thất bại!");
            setLoading(false);
            return;
          }
        }

        // Thêm file
        if (resultFile.length > 0 && feeContentsDataProps.length > 0) {
          const updatedFeeContentsDataWithFile: any = [];
          for (let i = 0; i < feeContentsDataProps.length; i++) {
            const feeContentItem = feeContentsDataProps[i];
            let matchingResultFile;
            for (let j = 0; j < resultFile.length; j++) {
              if (resultFile[j]?.key === feeContentItem?.key) {
                matchingResultFile = resultFile[j];
                break;
              }
            }
            updatedFeeContentsDataWithFile[i] = {
              ...feeContentItem,
              fileName: matchingResultFile?.filename || feeContentItem.fileName,
              ecmId: matchingResultFile?.ecmId || feeContentItem.ecmId,
            };
          }

          // Không cho trùng content
          let containsBothStrings = false;
          let countCTP = 0;
          let countPD1 = 0;
          let countPD2 = 0;
          for (let i = 0; i < updatedFeeContentsDataWithFile.length; i++) {
            if (updatedFeeContentsDataWithFile[i].content === "Công tác phí") {
              countCTP++;
            }
            if (updatedFeeContentsDataWithFile[i].content === "Phí đợt 1") {
              countPD1++;
            }
            if (updatedFeeContentsDataWithFile[i].content === "Phí đợt 2") {
              countPD2++;
            }
            if (countCTP > 1 || countPD1 > 1 || countPD2 > 1) {
              containsBothStrings = true;
              break;
            }
          }
          // if (containsBothStrings) {
          //   message.error("Vui lòng không tạo nội dung hóa đơn trùng nhau!");
          //   return;
          // }

          body = {
            ...data,
            feeContents: updatedFeeContentsDataWithFile,
            // Nếu thêm file 2
            // fileName:
            //   resultFile2.length > 0 ? resultFile2[0].filename : data.fileName,
            // ecmId: resultFile2.length > 0 ? resultFile2[0].ecmId : data.ecmId,
          };
        }

        // Thêm file
        if (resultFile.length === 0 && feeContentsDataProps.length > 0) {
          // Không cho trùng content
          let containsBothStrings = false;
          let countCTP = 0;
          let countPD1 = 0;
          let countPD2 = 0;
          for (let i = 0; i < feeContentsDataProps.length; i++) {
            if (feeContentsDataProps[i].content === "Công tác phí") {
              countCTP++;
            }
            if (feeContentsDataProps[i].content === "Phí đợt 1") {
              countPD1++;
            }
            if (feeContentsDataProps[i].content === "Phí đợt 2") {
              countPD2++;
            }
            if (countCTP > 1 || countPD1 > 1 || countPD2 > 1) {
              containsBothStrings = true;
              break;
            }
          }
          // if (containsBothStrings) {
          //   message.error("Vui lòng không tạo nội dung hóa đơn trùng nhau!");
          //   return;
          // }

          // Nếu thêm file 2
          body = {
            ...data,
            // fileName:
            //   resultFile2.length > 0 ? resultFile2[0].filename : data.fileName,
            // ecmId: resultFile2.length > 0 ? resultFile2[0].ecmId : data.ecmId,
            feeContents: feeContentsDataProps
              // .filter((item: any) => item.content && item.price)
              .map((item: any) => ({
                ...item,
                feeNotificationId: data?.feeNotificationId,
              })),
          };
        }

        if (
          (feeContentIds && !body) ||
          (feeContentIds && body) ||
          (!feeContentIds && body)
        ) {
          if (body) {
            let res: any = await appraisalFilesApi.updateFeeNotificationInfo(
              body,
              true
            );
            if (res.data.body.code === 200) {
              // if (body.feeContents.some((item: any) => item.fileName)) {
              //   body.feeContents.forEach((item: any) => {
              //     if (item.fileName) {
              //       message.success(`Upload file ${item.fileName} thành công!`);
              //     }
              //   });
              // }
              message.success("Cập nhật thành công");

              const resSyncEms = await syncEMSApi.syncEMS({
                profileCode: body.reportCode,
                options: 1,
                clientId: null,
                issuedInvoiceOnly: false,
                paidOnly: false,
              });
              if (resSyncEms?.data?.code === 200) {
                message.success(`Đồng bộ từ EMS thành công!`);
              } else {
                message.error(
                  resSyncEms?.data?.message || `Đồng bộ từ EMS thất bại!`
                );
              }
              mutate();
              btnRefFeeContentsTable.current?.clearSelectedRows();
              setLoading(false);
            } else {
              message.error(res?.data?.body?.message);
            }
          }
        }
      } catch (error: any) {
        message.error("Cập nhật số tiền xuất hóa đơn thất bại!");
        setLoading(false);
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
        // (async () => {
        //   try {
        //     await appraisalFilesApi.updateDebtFeeNotificationInfo(
        //       updatedDataFeeContents
        //     );
        //   } catch (error) {
        //     console.log(error);
        //   }
        // })();
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
        setFeeContentsData([]);
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
      value:
        form.values &&
        (form.values?.addressCustomDetail || form.values.addressAsset),
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
    {
      key: 13,
      label: "Ngày gửi TBKQ cho LOS",
      type: DATE_PICKER,
      showTime: true,
      placeholder: DATE_TIME_FORMAT.dateTimeFull,
      formatDatetime: DATE_TIME_FORMAT.dateTimeFull,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.dateSendTb ? dayjs(form.values.dateSendTb) : null,
      disable: true,
    },
    {
      key: 14,
      label: "Ngày gửi KQ cho LOS",
      type: DATE_PICKER,
      showTime: true,
      placeholder: DATE_TIME_FORMAT.dateTimeFull,
      formatDatetime: DATE_TIME_FORMAT.dateTimeFull,
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      value: form.values.dateSendToLos
        ? dayjs(form.values.dateSendToLos)
        : null,
      disable: true,
    },
  ];

  var validateResultProps: any;
  var feeContentsDataProps: any;
  const handleGetTableData = async () => {
    [feeContentsDataProps, validateResultProps] =
      await btnRefFeeContentsTable.current?.feeContentsData();
    return [feeContentsDataProps, validateResultProps];
  };

  const handlePostNotification = async () => {
    const saveFeeContentsData: any = [];
    for (let i = 0; i < data.feeContents.length; i++) {
      const feeContentItem = data.feeContents[i];
      let matchingResult;
      for (
        let j = 0;
        j < btnRefFeeContentsTable.current?.checkCheckBox.length;
        j++
      ) {
        if (
          btnRefFeeContentsTable.current?.checkCheckBox[j]?.key ===
          feeContentItem?.key
        ) {
          matchingResult = true;
          break;
        }
      }
      saveFeeContentsData[i] = {
        ...feeContentItem,
        isChecked: matchingResult || feeContentItem.isChecked,
      };
    }

    // Phí đợt 2 thì phải có cả phí đọt 1 và công tác phí
    // let containsCtacPhi = false;
    // let containsPhiDot1 = false;
    // let containsBothStrings = true;
    // for (let i = 0; i < saveFeeContentsData.length; i++) {
    //   if (
    //     saveFeeContentsData[i].isChecked &&
    //     saveFeeContentsData[i].content === "Phí đợt 2"
    //   ) {
    //     for (let j = 0; j < saveFeeContentsData.length; j++) {
    //       if (
    //         saveFeeContentsData[j].content === "Công tác phí" &&
    //         saveFeeContentsData[j].status === 1
    //       ) {
    //         containsCtacPhi = true;
    //       }
    //       if (
    //         saveFeeContentsData[j].content === "Phí đợt 1" &&
    //         saveFeeContentsData[j].status === 1
    //       ) {
    //         containsPhiDot1 = true;
    //       }
    //     }
    //     containsBothStrings = containsCtacPhi && containsPhiDot1;
    //   }
    // }
    // if (!containsBothStrings) {
    //   message.error(
    //     '"Phí đợt 1" và "Công tác phí" phải cần được báo phí trước!'
    //   );
    //   return;
    // }

    body = {
      ...data,
      feeContents: saveFeeContentsData,
    };

    try {
      setLoading(true);

      let res: any = await appraisalFilesApi.updateDebtFeeNotificationInfo(
        body.feeContents
      );

      if (res.data.code === 200) {
        const resSecond =
          await appraisalFilesApi.updateFeeNotificationInfoToLOS(
            data?.feeNotificationId
          );

        if (resSecond.data.body.code === 200) {
          setLoading(false);
          message.success("Gửi báo phí sang LOS thành công!");
        }
      }

      mutate();
      setLoading(false);
    } catch (error) {
      message.error("Gửi báo phí sang LOS thất bại!");
      setLoading(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc muốn gửi báo phí sang LOS?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        handlePostNotification();
      },
    });
  };

  if (error) return null;
  // if (isLoading) {
  //   return (
  //     <Row justify={"center"}>
  //       <Spin />
  //     </Row>
  //   );
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
        <CardTitleCustomUpdate
          title={`Chi tiết doanh thu, công nợ ${
            data && data.notificationCode ? data.notificationCode : ""
          }`}
        />
        <ButtonCustom
          label="Lưu"
          type="primary"
          disabled={data?.isLocked ? true : isSetConfirmButton ? false : true}
          size="small"
          style={{ margin: "3px 0" }}
          bgColor="#2862AF"
          onClick={() => {
            handleGetTableData();
            form.submitForm();
          }}
          loading={loading}
        />
      </div>
      <Space
        direction="vertical"
        size={"small"}
        className="space-assignment"
        style={{ marginBottom: "10px" }}
      >
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]} className="form-infor-debt">
            <InputFields data={inputFields} />
          </Row>
        </Form>
      </Space>
      {/* <CollapseCustom
        isInner
        itemList={[
          {
            label: "Danh sách theo dõi doanh thu, công nợ",
            children: (
              <div>
                <FeeModalTable
                  data={data ? data.feeContents : []}
                  ref={btnRefFeeContentsTable}
                  dataAll={data ? data : {}}
                />
                <div style={{ paddingTop: "10px" }}>
                  <TotalDebt />
                </div>
              </div>
            ),
          },
        ]}
      /> */}
      <div>
        {data?.sendToLos && (
          <div className="flex-center" style={{ margin: "0 0 12px 0" }}>
            <Alert
              message="Đã gửi kết quả cho LOS"
              type="success"
              showIcon
              style={{
                width: "30%",
              }}
            />
          </div>
        )}
        <div style={{ padding: "10px 0" }}>
          <FeeModalTable
            data={data ? data.feeContents : []}
            ref={btnRefFeeContentsTable}
            dataAll={data ? data : {}}
            appraisalFileId={appraisalFileId}
            mutateFeeModalTable={mutate}
          />
        </div>
        <div style={{ padding: "10px 0" }}>
          <TotalDebt dataItem={data} />
        </div>
      </div>
    </Card>
  );
};
export default FeeModal;
