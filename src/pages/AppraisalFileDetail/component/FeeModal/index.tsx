import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Row, Space, message } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { ROLES } from "constant/common";
import { TYPE_FIELD } from "constant/enums";
import { FeeNotificationType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { isContainRole } from "utils/common";
import { useFeeNotifications } from "utils/request";
import FeeModalTable from "./FeeModalTable/FeeModalTable";
import Icons from "assets/icons";
import "./style.scss";
import { syncEMSApi } from "apis/syncEMS";

const { INPUT, SELECT } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  appraisalFileId?: string | undefined;
  fileStatus: any;
  disableBtnSave?: boolean;
  dataAll: any;
  assetLevelTwoName: string | null | undefined;
};

type DataFeeConfirm = {
  maHoSo: string;
  trangThai: number;
  noiDung: [
    {
      reducedFee: null | number;
      note: string | null;
      dateModify: string | null;
    }
  ];
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };

const FeeModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  appraisalFileId,
  fileStatus,
  disableBtnSave,
  dataAll,
  assetLevelTwoName,
}) => {
  const { data, mutate } = useFeeNotifications(appraisalFileId);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConfirmFee, setLoadingConfirmFee] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const btnRefFeeContentsTable = useRef<any>();

  var body: any;
  const isReadOnly = fileStatus.fileStatus === -1;
  const isReceivedFromLOS = fileStatus.typeCreated === 1;
  const sendMail = fileStatus.typeCreated === 0;
  const form = useFormik({
    initialValues: data ? data : {},
    onSubmit: async (data: FeeNotificationType) => {
      try {
        setSubmit(true);
        try {
          await handleGetTableData();
        } catch (error: any) {
          setLoading(false);
        }
        var resultFile: any;
        var resultFileAgreeFee: any;

        if (validateResultProps === false) {
          setLoading(false);
          return;
        }

        try {
          let temp = await btnRefFeeContentsTable.current?.uploadFile();
          resultFile = temp.fileUploadedInfo;
          resultFileAgreeFee = temp.fileUploadedAgreeFee;
        } catch (error: any) {
          setLoading(false);
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
            message.error("Cập nhật báo phí thất bại!");
            setLoading(false);
            return;
          }
        }

        // Thêm file
        if (
          (resultFile.length > 0 || resultFileAgreeFee.length > 0) &&
          feeContentsDataProps.length > 0
        ) {
          const updatedFeeContentsDataWithFile: any = [];
          for (let i = 0; i < feeContentsDataProps.length; i++) {
            const feeContentItem = feeContentsDataProps[i];
            let matchingResultFile;
            let matchingResultAgreeFeeFile;

            if (resultFile.length > 0) {
              for (let j = 0; j < resultFile.length; j++) {
                if (resultFile[j]?.key === feeContentItem?.key) {
                  matchingResultFile = resultFile[j];
                  break;
                }
              }
            }

            if (resultFileAgreeFee.length > 0) {
              for (let k = 0; k < resultFileAgreeFee.length; k++) {
                if (resultFileAgreeFee[k]?.key === feeContentItem?.key) {
                  matchingResultAgreeFeeFile = resultFileAgreeFee[k];
                  break;
                }
              }
            }

            updatedFeeContentsDataWithFile[i] = {
              ...feeContentItem,
              fileName: matchingResultFile?.filename || feeContentItem.fileName,
              ecmId: matchingResultFile?.ecmId || feeContentItem.ecmId,
              //
              fileNameAgreeFee:
                matchingResultAgreeFeeFile?.filename ||
                feeContentItem.fileNameAgreeFee,
              ecmIdAgreeFee:
                matchingResultAgreeFeeFile?.ecmId ||
                feeContentItem.ecmIdAgreeFee,
              mediaTypeAgreeFee:
                matchingResultAgreeFeeFile?.mediaType ||
                feeContentItem.mediaTypeAgreeFee,
              dateAgreeFee:
                matchingResultAgreeFeeFile?.dateUpload ||
                feeContentItem.dateAgreeFee,
            };
          }

          // Không cho trùng content
          let containsBothStrings = false;
          let countCTP = 0;
          let countPD1 = 0;
          let countPD2 = 0;
          for (let i = 0; i < updatedFeeContentsDataWithFile.length; i++) {
            if (feeContentsDataProps[i].content === "Công tác phí") {
              countCTP++;
            }
            if (
              feeContentsDataProps[i].content === "Công tác phí" &&
              feeContentsDataProps[i].status === 2
            ) {
              countCTP--;
            }
            if (feeContentsDataProps[i].content === "Phí đợt 1") {
              countPD1++;
            }
            if (
              feeContentsDataProps[i].content === "Phí đợt 1" &&
              feeContentsDataProps[i].status === 2
            ) {
              countPD1--;
            }
            if (feeContentsDataProps[i].content === "Phí đợt 2") {
              countPD2++;
            }
            if (
              feeContentsDataProps[i].content === "Phí đợt 2" &&
              feeContentsDataProps[i].status === 2
            ) {
              countPD2--;
            }
            if (countCTP > 1 || countPD1 > 1 || countPD2 > 1) {
              containsBothStrings = true;
              break;
            }
          }
          if (containsBothStrings) {
            message.info("Vui lòng không tạo nội dung báo phí trùng nhau!");
            return;
          }

          body = {
            ...data,
            status: form.values.status,
            // feeContents: updatedFeeContentsDataWithFile.filter(
            //   (item: any) => item.content && item.price
            // ),
            feeContents: updatedFeeContentsDataWithFile,
          };
        }

        // Rỗng
        // if (feeContentsDataProps.length === 0) {
        //   message.info("Chưa tạo danh sách báo phí!");
        //   mutate();
        //   setLoading(false);
        //   return;
        // }

        // Bình thường
        if (
          resultFile.length === 0 &&
          resultFileAgreeFee.length === 0 &&
          feeContentsDataProps.length > 0
        ) {
          // Không cho trùng content
          let containsBothStrings = false;
          let countCTP = 0;
          let countPD1 = 0;
          let countPD2 = 0;
          for (let i = 0; i < feeContentsDataProps.length; i++) {
            if (feeContentsDataProps[i].content === "Công tác phí") {
              countCTP++;
            }
            if (
              feeContentsDataProps[i].content === "Công tác phí" &&
              feeContentsDataProps[i].status === 2
            ) {
              countCTP--;
            }
            if (feeContentsDataProps[i].content === "Phí đợt 1") {
              countPD1++;
            }
            if (
              feeContentsDataProps[i].content === "Phí đợt 1" &&
              feeContentsDataProps[i].status === 2
            ) {
              countPD1--;
            }
            if (feeContentsDataProps[i].content === "Phí đợt 2") {
              countPD2++;
            }
            if (
              feeContentsDataProps[i].content === "Phí đợt 2" &&
              feeContentsDataProps[i].status === 2
            ) {
              countPD2--;
            }
            if (countCTP > 1 || countPD1 > 1 || countPD2 > 1) {
              containsBothStrings = true;
              break;
            }
          }
          if (containsBothStrings) {
            message.info("Vui lòng không tạo nội dung báo phí trùng nhau!");
            return;
          }

          body = {
            ...data,
            status: form.values.status,
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
            await appraisalFilesApi.lockEditFee({
              feeNotificationId: data?.feeNotificationId || "",
              isLocked: false,
              feeContentIds: [],
            });

            let res: any = await appraisalFilesApi.updateFeeNotificationInfo(
              body
            );
            if (res.data.body.code === 200) {
              // if (body.feeContents.some((item: any) => item.fileName)) {
              //   body.feeContents.forEach((item: any) => {
              //     if (item.fileName) {
              //       message.success(`Upload file ${item.fileName} thành công!`);
              //     }
              //   });
              // }
              message.success("Cập nhật báo phí thành công!");
              mutate();
              setLoading(false);
            }
          } else {
            message.success("Cập nhật báo phí thành công!");
            mutate();
            setLoading(false);
          }
        }
      } catch (error: any) {
        message.error("Cập nhật báo phí thất bại!");
        setLoading(false);
      } finally {
        setSubmit(false);
      }
    },
  });

  const [isOpenUploadFile, setIsOpenUploadFile] = useState<boolean>(false);

  const openUploadFile = () => {
    setIsOpenUploadFile(true);
    setDataEditFile((prevState: any) => ({
      ...prevState,
      ecmId: dataAll.ecmId,
      fileName: dataAll.fileName,
      noteFile: dataAll.noteFile,
      dateUpload: dataAll.dateUpload,
    }));
  };

  const closeUploadFile = () => {
    setIsOpenUploadFile(false);
  };

  const handleCloseModal = () => {
    closeModal();
    btnRefFeeContentsTable.current?.clearSelectedRows();
  };

  const [dataEditFile, setDataEditFile] = useState<any>({
    ecmId: "",
    fileName: "",
    noteFile: "",
    dateUpload: null,
  });

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã đề nghị:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values && form.values.proposalCode,
      disable: true,
    },
    {
      key: 2,
      label: "Chi nhánh / Phòng GD:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      disable: true,
      // options: dataBranch
      //   ? dataBranch?.map((item: any) => ({
      //       value: item.companyBranchId,
      //       label: item.companyBranchName,
      //     }))
      //   : [],
      value:
        (form.values && form.values?.branch?.branchName) ||
        form.values?.branchName ||
        "",
    },
    {
      key: 3,
      label: "Số tờ trình:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values && form.values.reportCode,
      disable: true,
    },
    {
      key: 4,
      label: "Họ Tên KH:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values && form.values.fullName,
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
      value: form.values && form.values.assetName,
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
      value: form.values && form.values.addressCustomer,
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
      value: form.values && form.values.mst,
      disable: true,
    },

    {
      key: 9,
      label: "Mục đích TĐG:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      disable: true,
      type: INPUT,
      value: form.values && form.values.appraisalPurposeName,
    },
    {
      key: 10,
      label: "Email:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: form.values && form.values.email,
      disable: true,
    },
    {
      key: 11,
      label: "Tính chất:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      value: assetLevelTwoName || "",
      disable: true,
    },
    {
      key: 12,
      label: "Trạng thái:",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: SELECT,
      allowClear: true,
      options: [
        { label: "Chưa tạo nội dung báo phí", value: 0 },
        { label: "Đã tạo phí thẩm định đợt 1", value: 1 },
        { label: "Đã tạo phí thẩm định đợt 2", value: 2 },
        { label: "Đã báo phí đợt 1", value: 7 },
        { label: "Đã đồng ý báo phí đợt 1", value: 3 },
        { label: "Đã từ chối báo phí đợt 1", value: 4 },
        { label: "Đã báo phí đợt 2", value: 8 },
        { label: "Đã đồng ý báo phí đợt 2", value: 5 },
        { label: "Đã từ chối báo phí đợt 2", value: 6 },
      ],
      value: form.values && form.values.status,
      disable: true,
      onChange: (value: string) => {
        if (
          (Number(data.status) === 7 &&
            (Number(value) === 3 || Number(value) === 4)) ||
          (Number(data.status) === 8 &&
            (Number(value) === 5 || Number(value) === 6))
        ) {
          form.setValues({
            ...form.values,
            status: value,
          });
          return;
        }
        if (Number(value) < Number(data.status)) {
          message.info("Không được chọn các trạng thái cũ hơn hiện tại!");
        } else {
          form.setValues({
            ...form.values,
            status: value,
          });
        }
      },
    },
  ];

  var validateResultProps: any;
  var feeContentsDataProps: any;
  const handleGetTableData = async () => {
    [feeContentsDataProps, validateResultProps] =
      await btnRefFeeContentsTable.current?.feeContentsData();
    return [feeContentsDataProps, validateResultProps];
  };

  useEffect(() => {
    if (data || isOpenModal) {
      form.setValues(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpenModal]);

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

    const contentCheck: string[] = [];

    btnRefFeeContentsTable.current?.checkCheckBox.forEach((item: any) => {
      if (item.status !== 0) {
        contentCheck.push(item.content);
      }
    });

    if (contentCheck.length > 0) {
      message.error(`${contentCheck.join(", ")} đã được báo phí trước đó!`);
      return;
    }

    body = {
      ...data,
      feeContents: saveFeeContentsData,
    };

    try {
      setLoading(true);
      await appraisalFilesApi.lockEditFee({
        feeNotificationId: data?.feeNotificationId,
        isLocked: false,
        feeContentIds: [],
      });
      let res: any = await appraisalFilesApi.updateFeeNotificationInfo(body);
      if (res.data.body.code === 200) {
        const resSecond =
          await appraisalFilesApi.updateFeeNotificationInfoToLOS(
            data?.feeNotificationId
          );
        if (resSecond.data.body.code === 200) {
          setLoading(false);
          message.success("Gửi báo phí sang LOS thành công!");
          btnRefFeeContentsTable.current?.clearSelectedRows();
        }
      }

      mutate();
      setLoading(false);
    } catch (error) {
      message.error("Gửi báo phí sang LOS thất bại!");
      setLoading(false);
    }
  };

  const handleSendMail = async () => {
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
        isCheckedEmail: matchingResult || feeContentItem.isChecked,
      };
    }

    body = {
      ...data,
      feeContents: saveFeeContentsData,
    };
    try {
      setLoading(true);

      let res: any = await appraisalFilesApi.updateStatusMail(body);

      if (res.data.body.code === 200) {
        const resSecond = await appraisalFilesApi.sendMailToLOS(
          appraisalFileId
        );
        if (resSecond.data.code === 200) {
          message.success("Gửi mail thành công!");
        } else {
          message.error("Gửi mail thất bại!");
        }

        const thirdSecond =
          await appraisalFilesApi.updateFeeNotificationInfoToLOS(
            data?.feeNotificationId
          );
        if (thirdSecond.data.body.code === 200) {
          message.success("Báo phí thành công!");
        } else {
          message.error("Báo phí thất bại!");
        }
        btnRefFeeContentsTable.current?.clearSelectedRows();
      }

      mutate();
      setLoading(false);
    } catch (error) {
      message.error("Lỗi, Báo phí thất bại!");
      setLoading(false);
    }
  };

  const handlePostFeeConfirm = async () => {
    try {
      const contentCheck: string[] = [];
      // const contentCheckCTP: string[] = [];
      const agreeFeeCheck: string[] = [];

      btnRefFeeContentsTable.current?.checkCheckBox.forEach((item: any) => {
        if (item.status !== 1 && item.status !== 4 && item.status !== 5) {
          contentCheck.push(item.content);
        }
        if (item.ecmIdAgreeFee === null) {
          agreeFeeCheck.push(item.content);
        }
      });

      if (contentCheck.length > 0) {
        message.error(`${contentCheck.join(", ")} Cần được báo phí trước!`);
        return;
      }

      if (agreeFeeCheck.length > 0) {
        message.error(
          `${contentCheck.join(
            ", "
          )} Cần phải upload tờ trình đồng ý phí trước!`
        );
        return;
      }

      setLoadingConfirmFee(true);

      for (const item of btnRefFeeContentsTable.current?.checkCheckBox) {
        const isFee1 =
          item?.content === "Phí đợt 1" || item?.content === "Công tác phí";
        const feeConfirmType = isFee1 ? "" : "2nd";
        const dataFeeConfirm: DataFeeConfirm = {
          maHoSo: data.proposalCode,
          trangThai: isFee1 ? 3 : 5,
          noiDung: [
            {
              reducedFee: null,
              note: "Đồng ý",
              dateModify: data.dateModify,
            },
          ],
        };

        const res = await appraisalFilesApi.confirmFee(
          feeConfirmType,
          dataFeeConfirm
        );
        if (res.data.body.code === 200) {
          message.success(`Đồng ý ${item.content} thành công!`);
        } else {
          message.success(`Đồng ý ${item.content} thất bại!`);
        }
      }

      mutate();
    } catch (error) {
      message.error("Đồng ý phí thất bại!");
    } finally {
      setLoadingConfirmFee(false);
    }
  };

  const handlePostFeeRefuse = async () => {
    try {
      const contentCheck: string[] = [];
      const refuseFeeCheck: string[] = [];

      btnRefFeeContentsTable.current?.checkCheckBox.forEach((item: any) => {
        if (item.status >= 4) {
          contentCheck.push(item.content);
        }
        if (item.ecmIdAgreeFee === null) {
          refuseFeeCheck.push(item.content);
        }
      });

      if (contentCheck.length > 0) {
        message.error(`${contentCheck.join(", ")} đã được thu tiền!`);
        return;
      }

      if (refuseFeeCheck.length > 0) {
        message.error(
          `${refuseFeeCheck.join(
            ", "
          )} Cần phải upload tờ trình từ chối phí trước!`
        );
        return;
      }

      setLoadingConfirmFee(true);

      for (const item of btnRefFeeContentsTable.current?.checkCheckBox) {
        const isFee1 =
          item?.content === "Phí đợt 1" || item?.content === "Công tác phí";
        const feeConfirmType = isFee1 ? "" : "2nd";
        const dataFeeConfirm: DataFeeConfirm = {
          maHoSo: data.proposalCode,
          trangThai: isFee1 ? 4 : 6,
          noiDung: [
            {
              reducedFee: null,
              note: "Từ chối",
              dateModify: data.dateModify,
            },
          ],
        };

        const res = await appraisalFilesApi.confirmFee(
          feeConfirmType,
          dataFeeConfirm
        );
        if (res.data.body.code === 200) {
          message.success(`Từ chối ${item.content} thành công!`);
          const res_sync = await syncEMSApi.syncEMS({
            profileCode: data.reportCode,
            options: 1,
            clientId: null,
            issuedInvoiceOnly: false,
            paidOnly: false,
          });
          if (res_sync?.data?.code === 200) {
            message.success(`Đồng bộ từ EMS thành công!`);
          } else {
            message.error(
              res_sync?.data?.message || `Đồng bộ từ EMS thất bại!`
            );
          }
        } else {
          message.success(`Từ chối ${item.content} thất bại!`);
        }
      }

      mutate();
    } catch (error) {
      message.error("Từ chối phí thất bại!");
    } finally {
      setLoadingConfirmFee(false);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: sendMail
        ? "Bạn có chắc muốn gửi mail?"
        : "Bạn có chắc muốn gửi báo phí sang LOS?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        sendMail ? handleSendMail() : handlePostNotification();
      },
    });
  };

  const showConfirmFee = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn muốn thay đổi trạng thái phí này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        handlePostFeeConfirm();
      },
    });
  };

  const showRefuseFee = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn muốn thay đổi trạng thái phí này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        handlePostFeeRefuse();
      },
    });
  };

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={() => handleCloseModal()}
      className="modalFee"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalFee-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Báo phí" color="#FFF" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => handleCloseModal()}
            size="small"
          />
        </Row>
        {!isReadOnly && (
          <Row
            justify={"end"}
            style={{ padding: "0 8px" }}
            className="button-row"
          >
            <Space>
              {isContainRole(ROLES.CBTH) ? (
                <ButtonCustom
                  disabled={appraisalFileId ? submit : true}
                  label="Lưu"
                  type="default"
                  onClick={() => {
                    handleGetTableData();
                    form.submitForm();
                  }}
                />
              ) : (
                <></>
              )}
              {isContainRole(ROLES.CBTH) ? (
                <Space>
                  <ButtonCustom
                    icon={<Icons.check />}
                    label={"Đồng ý phí"}
                    disabled={
                      // Không tìm thấy
                      data?.feeContents.some(
                        (item: any) =>
                          (item.content === "Phí đợt 1" &&
                            item.status >= 1 &&
                            item.status !== 2) ||
                          (item.content === "Phí đợt 2" &&
                            item.status >= 1 &&
                            item.status !== 2)
                      )
                        ? loadingConfirmFee
                        : true
                    }
                    style={{
                      color: "rgb(40, 98, 175)",
                      border: "1px solid rgb(40, 98, 175)",
                    }}
                    onClick={async () => {
                      if (
                        btnRefFeeContentsTable.current?.checkCheckBox.length ===
                        0
                      ) {
                        message.info("Chưa chọn nội dung cần đồng ý phí!");
                        return;
                      }
                      showConfirmFee();
                    }}
                  />
                  <ButtonCustom
                    icon={<Icons.check />}
                    label={"Từ chối phí"}
                    disabled={
                      // Không tìm thấy
                      data?.feeContents.some(
                        (item: any) =>
                          (item.content === "Phí đợt 1" && item.status === 1) ||
                          (item.content === "Phí đợt 2" && item.status === 1)
                      )
                        ? loadingConfirmFee
                        : true
                    }
                    style={{
                      color: "rgb(242, 91, 96)",
                      border: "1px solid rgb(242, 91, 96)",
                    }}
                    onClick={async () => {
                      if (
                        btnRefFeeContentsTable.current?.checkCheckBox.length ===
                        0
                      ) {
                        message.info("Chưa chọn nội dung cần từ chối phí!");
                        return;
                      }
                      showRefuseFee();
                    }}
                  />
                  <ButtonCustom
                    icon={<Icons.money />}
                    disabled={loading}
                    label={"Báo phí"}
                    type="primary"
                    bgColor={"rgba(40, 98, 175, 1)"}
                    onClick={async () => {
                      if (
                        btnRefFeeContentsTable.current?.checkCheckBox.length ===
                        0
                      ) {
                        message.info("Chưa chọn nội dung cần báo phí!");
                        return;
                      }

                      showConfirm();
                    }}
                  />
                </Space>
              ) : (
                <></>
              )}
            </Space>
          </Row>
        )}
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
        <FeeModalTable
          data={data ? data.feeContents : []}
          sendMail={sendMail}
          isReceivedFromLOS={isReceivedFromLOS}
          ref={btnRefFeeContentsTable}
          dataAll={data ? data : {}}
        />
      </Space>
    </Modal>
  );
};
export default FeeModal;
