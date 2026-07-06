import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Row, Space, message } from "antd";
import { assignmentApi } from "apis/asignment";
import { branchsApi } from "apis/branch";
import { categoryApi } from "apis/category";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import TitleCustom from "components/TitleCustom";
import { RootState } from "configs/configureStore";
import { ROLES } from "constant/common";
import { TYPE_FIELD } from "constant/enums";
import { CreateAssignmentType } from "constant/types/assignment";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useFormik } from "formik";
import useAppraisalFileFunction from "hooks/useAppraisalFileFunction";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRoleAccount, isContainRole, isLiveEnv } from "utils/common";
import {
  useAppraisalFileDetail,
  useAssignments,
  useFeeNotifications,
} from "utils/request";
import * as Yup from "yup";
import AssignmentTable from "./component/AssignmentTable/AssignmentTable";
import "./style.scss";
const { SELECT, MULTI_SELECT_SEARCH } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  appraisalFileId: string;
  appraisalUnit: number | null;
  fileStatus: number;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };

const formSchema = Yup.object().shape({
  staffs: Yup.string().nullable().required("Phải chọn nhân viên phân công"),
  jobTypeId: Yup.number().nullable().required("Phải chọn bước thực hiện"),
  priorityLevel: Yup.number().nullable().required("Phải chọn độ ưu tiên"),
});

const AssignmentModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  appraisalFileId,
  appraisalUnit,
  fileStatus,
}) => {
  const { mutate: mutateAssignment } = useAssignments(appraisalFileId);
  const { mutate: mutateAppraisalFile } = useAppraisalFileDetail(
    appraisalFileId || ""
  );
  const { isUserCanNotUpdate, isCompletedAppraisalFromLos, isReceivedFromLos } =
    useAppraisalFileFunction({
      appraisalId: appraisalFileId,
    });
  const globalSliceData = useSelector((state: RootState) => state.globalSlice);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [staffs, setStaffs] = useState<Array<any>>([]);

  const { data: dataFeeNotifications, mutate: mutateFeeNotifications } =
    useFeeNotifications(appraisalFileId);

  // disable chuyển giao chi nhánh
  const [disableBranchEdit, setDisableBranchEdit] = useState<boolean>(true);

  const isMworkConfirmed: boolean =
    isContainRole(ROLES.CBTH) || isContainRole(ROLES.CBTM)
      ? dataFeeNotifications && dataFeeNotifications.status === 3
        ? true
        : false
      : true;

  const roles = getRoleAccount() || [];

  // tính năng chưa đẩy live
  const canNotEdit: boolean =
    isUserCanNotUpdate() ||
    (isContainRole(ROLES.CVTD) && roles.length <= 1) ||
    fileStatus === 2;
  // ||
  // (!isLiveEnv ? !isMworkConfirmed : false);

  const form = useFormik({
    initialValues: {
      appraisalFileId: appraisalFileId || "",
      staffs: null,
      jobTypeId: null,
      priorityLevel: null,
      companyBranchId: appraisalUnit,
      note: "",
    } as CreateAssignmentType,
    validationSchema: disableBranchEdit ? formSchema : undefined,
    onSubmit: async (data: CreateAssignmentType) => {
      try {
        setIsLoading(true);
        // Nếu chọn bước chuyển giao chi nhánh
        if (!disableBranchEdit && data.companyBranchId) {
          const res = await branchsApi.updateBranchAppraisalFile({
            appraisalFileId: appraisalFileId,
            companyBranchId: data.companyBranchId,
          });
          if (res.data.code === 200) {
            message.success(res.data.message);
            setDisableBranchEdit(true);
            form.resetForm();
            closeModal();
            mutateAssignment();
            mutateAppraisalFile();
          } else message.error(res.data.message);
        } else {
          const dataCreate: any = {
            appraisalFileId: data.appraisalFileId,
            staffs: data.staffs !== null ? JSON.parse(data.staffs) : [],
            jobTypeId: data.jobTypeId,
            companyBranchId: data.companyBranchId,
            priorityLevel: data.priorityLevel,
            note: data.note,
          };
          const res = await assignmentApi.create(dataCreate);
          if (res.data.code === 200) {
            message.success(res.data.message);
            mutateAssignment();
            form.resetForm();
            closeModal();
          } else message.error(res.data.message);
        }
        setIsLoading(false);
      } catch (error: any) {
        message.error("Phân giao không thành công.");
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const getStaffForAssign = async () => {
      try {
        if (form.values.jobTypeId && form.values.companyBranchId) {
          const res = await categoryApi.getStaffForAssign(
            form.values.jobTypeId,
            form.values.companyBranchId
          );

          setStaffs(
            res.data.map((item: any) => {
              // 05/01/2024 - haipham - fix hiện cụ thể số lượng hồ sơ
              if (form.values.jobTypeId == 2) {
                // 2: Phân công khảo sát
                return {
                  label: item.username + " (" + item.waitAssignment + ")",
                  value: item.username,
                };
              } else if (form.values.jobTypeId == 3) {
                // 3: Khảo sát
                return {
                  label:
                    item.username +
                    " (" +
                    item.assignmentWork +
                    "/" +
                    item.assignment +
                    ")",
                  value: item.username,
                };
              } else {
                return {
                  label: item.username,
                  value: item.username,
                };
              }
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getStaffForAssign();
  }, [form.values.jobTypeId, form.values.companyBranchId]);

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Bước",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.jobTypeId,
      onChange: (value: number) => {
        // Kiểm tra có phải bước chuyển chi nhánh không
        const newData = {
          ...form.values,
          staffs: "",
          jobTypeId: value,
        };
        if (value === 7) {
          // Cho phép thay đổi chi nhánh
          setDisableBranchEdit(false);
        } else {
          setDisableBranchEdit(true);
          newData.companyBranchId = appraisalUnit;
        }
        form.setValues(newData);
      },
      options: globalSliceData.jobTypeOptions.map((item) => {
        let disabled = false;

        //Chưa xác nhận phí thì khoá hết chỉ mở chuyển chi nhánh
        if (!isMworkConfirmed && item.value !== 7) {
          disabled = true;
        }
        return {
          ...item,
          disabled,
        };
      }),
      error: form.errors.jobTypeId,
      touched: form.touched.jobTypeId,
      disable: canNotEdit,
      require: true,
    },
    {
      key: 2,
      label: "Chi nhánh SBA",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.companyBranchId,
      disable: disableBranchEdit,
      onChange: (value: number) => {
        form.setValues({ ...form.values, companyBranchId: value });
      },
      options: globalSliceData.branchOptions,
    },
    {
      key: 3,
      label: "Cán bộ phụ trách",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: MULTI_SELECT_SEARCH,
      value: form.values.staffs ? JSON.parse(form.values.staffs || "[]") : [],
      error: form.errors.staffs,
      touched: form.touched.staffs,
      onChange: (value: string[]) => {
        form.setValues({
          ...form.values,
          staffs: value.length > 0 ? JSON.stringify(value) : "",
        });
      },
      options: staffs,
      disable: form.values.jobTypeId ? false : true,
      require: true,
    },
    {
      key: 4,
      label: "Độ ưu tiên",
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      type: SELECT,
      value: form.values.priorityLevel,
      onChange: (value: number) => {
        form.setValues({ ...form.values, priorityLevel: value });
      },
      options: globalSliceData.priorityLevelOptions,
      error: form.errors.priorityLevel,
      touched: form.touched.priorityLevel,
      disable: canNotEdit,
      require: true,
    },
  ];
  useEffect(() => {
    if (isOpenModal) {
      if (isCompletedAppraisalFromLos() || isReceivedFromLos())
        message.info("Vui lòng hoàn thành tiếp nhận trước.");
    }
  }, [isOpenModal]);
  useEffect(() => {
    if (typeof appraisalUnit === "number") {
      form.setFieldValue("companyBranchId", appraisalUnit);
    }
  }, [appraisalUnit]);
  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalAssignment"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalAssignment-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Phân giao" color="#FFF" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => {
              form.resetForm();
              closeModal();
            }}
            size="small"
          />
        </Row>
        {!canNotEdit && (
          <>
            <Form labelAlign="left" labelWrap size="small">
              <Row gutter={[24, 4]}>
                <InputFields data={inputFields} />
              </Row>
            </Form>
            <Row
              justify={"end"}
              style={{ padding: "0 8px" }}
              className="button-row"
            >
              <Space>
                <ButtonCustom
                  label="Hủy bỏ"
                  onClick={() => {
                    form.resetForm();
                    closeModal();
                  }}
                />
                <ButtonCustom
                  disabled={isLoading || canNotEdit}
                  label="Lưu"
                  type="primary"
                  onClick={form.submitForm}
                  bgColor="rgba(40, 98, 175, 1)"
                />
              </Space>
            </Row>
          </>
        )}
        <div style={{ padding: "0px 8px" }}>
          <TitleCustom size="middle" title="Danh sách phân giao" />
          <AssignmentTable
            appraisalFileId={appraisalFileId}
            fileStatus={fileStatus}
            appraisalUnit={appraisalUnit}
          />
        </div>
      </Space>
    </Modal>
  );
};
export default AssignmentModal;
