import { Card, Form, Row, Space, message, Modal, Spin } from "antd";
import { appraisalFilesApi } from "apis/appraisalFiles";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { FeeNotificationType, AppraisalFileType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import FeeModalTable from "pages/AppraisalFileDetail/component/FeeModal/FeeModalTable/FeeModalTable";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  useFeeNotifications,
  useGetAllFeeNotifications,
  useAppraisalFileDetail,
  useAppraisalFiles,
} from "utils/request";
import { isContainRole } from "utils/common";
import { ROLES } from "constant/common";
import Icons from "assets/icons";

const { INPUT, SELECT } = TYPE_FIELD;
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
  // "7": string;
  // "8": string;
  // "9": string;
  // "10": string;
  // "11": string;
};

const FeeModal = () => {
  const appraisalFileIdRef = useRef(null);
  const feeNotificationIdRef = useRef(null);
  const { state } = useLocation();

  appraisalFileIdRef.current = state?.appraisalFileId;
  const appraisalFileIdProps = appraisalFileIdRef.current;

  feeNotificationIdRef.current = state?.feeNotificationId;
  const feeNotificationIdProps = feeNotificationIdRef.current;

  const [proposalCode, setProposalCode] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [reportCode, setReportCode] = useState<string>("");
  // const [appraisalFileId, setAppraisalFileId] = useState<string[]>([]);
  const [appraisalFileId, setAppraisalFileId] = useState<string>("");
  const [temporaryKeyword, setTemporaryKeyword] = useState<{
    proposalCode: string;
    reportCode: string;
  }>({
    proposalCode: "",
    reportCode: "",
  });

  // const {
  //   data: dataAllFeeNotifications,
  //   isLoading: isLoadingAllFeeNotifications,
  //   error: errorAllFeeNotifications,
  //   mutate: mutateAllFeeNotifications,
  // } = useGetAllFeeNotifications();

  const {
    data: dataAppraisalFileDetail,
    isLoading: isLoadingAppraisalFileDetail,
    error: errorAppraisalFileDetail,
    mutate: mutateAppraisalFileDetail,
  }: {
    data: AppraisalFileType;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useAppraisalFileDetail(appraisalFileId);

  const { data, isLoading, error, mutate } = useFeeNotifications(
    // appraisalFileId[0]
    appraisalFileId
  );

  const {
    data: dataAppraisalFiles,
    isLoading: isLoadingAppraisalFiles,
    error: errorAppraisalFiles,
  } = useAppraisalFiles({ limit: 10000 });

  const isReadOnly =
    dataAppraisalFileDetail && dataAppraisalFileDetail.fileStatus === -1;
  const sendMail =
    dataAppraisalFileDetail && dataAppraisalFileDetail.typeCreated === 0;
  const isReceivedFromLOS =
    dataAppraisalFileDetail && dataAppraisalFileDetail.typeCreated === 1;

  const [loading, setLoading] = useState<boolean>(false);
  const btnRefFeeContentsTable = useRef<any>();

  useEffect(() => {
    // setAppraisalFileId([
    //   ...new Set(
    //     (dataAllFeeNotifications as { appraisalFileId: string }[])
    //       ?.filter((dataFilters: any) => {
    //         return (
    //           dataFilters.proposalCode === proposalCode ||
    //           dataFilters.reportCode === reportCode
    //         );
    //       })
    //       .map((filteredData) => filteredData.appraisalFileId)
    //   ),
    // ]);
    let filterAppraisalFileId =
      // dataAllFeeNotifications
      dataAppraisalFiles?.data
        ?.filter((dataFilters: any) => {
          return (
            dataFilters.proposalCode === proposalCode ||
            dataFilters.reportCode === reportCode
          );
        })
        .map(
          (filteredData: FeeNotificationType) => filteredData.appraisalFileId
        );
    if (filterAppraisalFileId) {
      setAppraisalFileId(filterAppraisalFileId);
    }
    if (
      (filterAppraisalFileId?.length === 0 && reportCode) ||
      (filterAppraisalFileId?.length === 0 && proposalCode)
    ) {
      message.error("Không tìm thấy hồ sơ báo phí!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalCode, reportCode]);

  // useEffect(() => {
  //   if (appraisalFileIdProps) setAppraisalFileId(appraisalFileIdProps);
  //   if (feeNotificationIdProps) setFeeNotificationId(feeNotificationIdProps);
  // }, [appraisalFileIdProps || feeNotificationIdProps]);

  var body: any;
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

        if (validateResultProps === false) {
          setLoading(false);
          return;
        }

        try {
          resultFile = await btnRefFeeContentsTable.current?.uploadFile();
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

  useEffect(() => {
    if (data) {
      form.setValues(data);
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
      disable: false,
      placeholder: temporaryKeyword.reportCode || form.values.reportCode,
      value: temporaryKeyword.reportCode,
      onChange: (e: any) => {
        setTemporaryKeyword((prevState) => ({
          ...prevState,
          reportCode: e.target.value,
        }));
      },
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setReportCode(temporaryKeyword.reportCode.trimEnd().trimStart());
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
      type: SELECT,
      allowClear: true,
      options: [
        { label: "Chưa tạo nội dung báo phí", value: 0 },
        { label: "Đã tạo phí thẩm định đợt 1", value: 1 },
        { label: "Đã tạo phí thẩm định đợt 2", value: 2 },
        { label: "Đã đồng ý báo phí đợt 1", value: 3 },
        { label: "Đã từ chối báo phí đợt 1", value: 4 },
        { label: "Đã đồng ý báo phí đợt 2", value: 5 },
        { label: "Đã từ chối báo phí đợt 2", value: 6 },
        // {label: "Từ chối công tác phí", value: 7 },
        // {label: "Báo lại công tác phí", value: 8 },
        // {label: "Đồng ý phí báo lại công tác phí", value: 9 },
        // {label: "Báo lại phí đợt 2", value: 10 },
        // {label: "Đồng ý phí báo lại đợt 2", value: 11 },
      ],
      value: form.values && form.values.status,
      disable:
        (isContainRole(ROLES.CBTH) || sendMail) && !isReceivedFromLOS
          ? false
          : true,
      onChange: (value: string) => {
        if (Number(value) < Number(form.values.status)) {
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
    //         saveFeeContentsData[j].status > 0
    //       ) {
    //         containsCtacPhi = true;
    //       }
    //       if (
    //         saveFeeContentsData[j].content === "Phí đợt 1" &&
    //         saveFeeContentsData[j].status > 0
    //       ) {
    //         containsPhiDot1 = true;
    //       }
    //     }
    //     containsBothStrings = containsCtacPhi && containsPhiDot1;
    //   }
    // }
    // if (!containsBothStrings) {
    //   message.info(
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
          setLoading(false);
          message.success("Gửi mail thành công!");
          btnRefFeeContentsTable.current?.clearSelectedRows();
        }
      }

      mutate();
      setLoading(false);
    } catch (error) {
      message.error("Gửi mail thất bại!");
      setLoading(false);
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

  if (error) return null;
  if (
    // isLoadingAllFeeNotifications
    isLoadingAppraisalFiles
  ) {
    return (
      <Row justify={"center"}>
        <Spin />
      </Row>
    );
  }

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
          title={`Chi tiết báo phí ${
            data && data.notificationCode ? data.notificationCode : ""
          }`}
        />
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
                <ButtonCustom
                  icon={sendMail ? <Icons.mail /> : <Icons.money />}
                  disabled={loading}
                  label={sendMail ? "Gửi mail" : "Báo phí"}
                  type="primary"
                  bgColor={sendMail ? "#F4493C" : "rgba(40, 98, 175, 1)"}
                  onClick={async () => {
                    // const [dataProps, dataValidateProps] =
                    //   await handleGetTableData();

                    // const isMatch = data?.feeContents.every(
                    //   (item: any, index: any) => {
                    //     return (
                    //       item.content === dataProps[index]?.content &&
                    //       item.price === dataProps[index]?.price &&
                    //       item.note === dataProps[index]?.note &&
                    //       item.reducedFee === dataProps[index]?.reducedFee
                    //     );
                    //   }
                    // );

                    // if (
                    //   dataProps?.length !== data?.feeContents?.length ||
                    //   !isMatch
                    // ) {
                    //   message.info(
                    //     "Bạn vừa thay đổi nội dung báo phí. Hãy lưu lại thay đổi trước khi thực hiện việc báo phí!"
                    //   );
                    //   return;
                    // }

                    if (
                      btnRefFeeContentsTable.current?.checkCheckBox.length === 0
                    ) {
                      message.info(
                        sendMail
                          ? "Chưa chọn nội dung cần gửi mail!"
                          : "Chưa chọn nội dung cần báo phí!"
                      );
                      return;
                    }

                    showConfirm();
                  }}
                />
              ) : (
                <></>
              )}
            </Space>
          </Row>
        )}
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
      <FeeModalTable
        data={data ? data.feeContents : []}
        sendMail={sendMail}
        isReceivedFromLOS={isReceivedFromLOS}
        ref={btnRefFeeContentsTable}
        dataAll={data ? data : {}}
      />
    </Card>
  );
};
export default FeeModal;
