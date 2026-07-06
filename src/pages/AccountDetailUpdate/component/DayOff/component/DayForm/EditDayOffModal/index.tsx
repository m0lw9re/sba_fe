import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Row, Space, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import "./style.scss";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { TYPE_FIELD } from "constant/enums";
import InputFields from "components/InputFields";
import { useEffect, useState } from "react";
import { dayOffVacation } from "apis/dayOffVacation";
import { getListContructionTypesAPI } from "configs/commonSlice";
import { useAppDispatch } from "configs/hooks";
import { useFormik } from "formik";
import { DATE_TIME_FORMAT } from "constant/enums";
import dayjs from "dayjs";
import {
  editDayOffVacation,
  dayOffVacation as dayOffVacationType,
} from "constant/types";
import { select } from "redux-saga/effects";
const { SELECT, INPUT, DATE_PICKER } = TYPE_FIELD;

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  record: any;
  action: "add" | "update" | null;
  mutate?: any;
  selectedDayData: {
    id: number;
    day: string;
    type: string;
  };
  selectedValue: any;
};
const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
// const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 6 };
// const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 18 };

const EditDayOffModal: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  record,
  action,
  mutate,
  selectedDayData,
  selectedValue,
}) => {
  const [form] = Form.useForm();
  const handleChangeForm = (basicData: any) => {
    formControl.setValues((state) => ({
      ...state,
      ...basicData,
    }));
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getDayOffById, setGetDayOffById] = useState({
    note: "",
    type: "",
  });

  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getListContructionTypesAPI());
  }, []);
  useEffect(() => {
    form.setFieldsValue(record);
    if (!record || action == "add") {
      form.resetFields();
    }
  }, [record, action]);

  const getDayOffVacationByDate = async (id: number, day: string) => {
    try {
      if (day) {
        const response = await dayOffVacation.getDayOffVacationByDate({
          id,
          day,
        });
        if (response.data.statusCodeValue === 200) {
          // message.success(response.data.statusCode);
          setGetDayOffById(response.data.body);
        } else {
          // message.error(response.data.message);
        }
      }
    } catch (error: any) {
      message.error(error);
    }
  };
  useEffect(() => {
    const day = selectedDayData.day?.split("-")[2];
    if (selectedDayData.id && day) {
      getDayOffVacationByDate(selectedDayData.id, day);
    }
  }, [selectedDayData]);

  const initialFormData: editDayOffVacation = {
    month: dayjs().month(),
    year: dayjs().year(),
    day: dayjs().date(),
    id: 0,
    note: "",
    type: "",
    fullDay: dayjs(),
  };

  useEffect(() => {
    const updatedValues = { ...formControl.values };

    if (selectedDayData.type) {
      updatedValues.type = selectedDayData.type;
    } else {
      updatedValues.type = "morning_break";
    }

    if (selectedDayData.day) {
      if (selectedDayData.day && selectedDayData.day.includes("-")) {
        const dateParts = selectedDayData.day.split("-");
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const day = parseInt(dateParts[2], 10);
        updatedValues.year = year;
        updatedValues.month = month;
        updatedValues.day = day;
      } else {
        const dateParts = selectedDayData.day.split("/");
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);
        updatedValues.year = year;
        updatedValues.month = month;
        updatedValues.day = day;
      }
    }

    if (selectedValue) {
      updatedValues.fullDay = dayjs(selectedValue);
    }

    if (selectedDayData.id) {
      updatedValues.id = selectedDayData.id;
    }

    if (getDayOffById?.note) {
      updatedValues.note = getDayOffById.note;
    }

    if (selectedDayData.type === "") {
      updatedValues.note = "";
    }

    formControl.setValues(updatedValues);
  }, [selectedDayData, getDayOffById, selectedValue]);

  const formControl = useFormik({
    initialValues: initialFormData,
    validateOnChange: false,
    onSubmit: async (data: editDayOffVacation) => {
      if (action === "add") {
        const dataPost: any = {
          month: data.month,
          year: data.year,
          [`day${data.day}`]: data.type,
          note: data.note,
        };
        try {
          setIsLoadingBtn(true);
          let validateCheck;
          try {
            validateCheck = await dayOffVacation.getDayOffVacation({
              month: data.month.toString(),
              year: data.year.toString(),
            });
          } catch (error) {
            console.error(error);
          }
          if (
            validateCheck?.data?.body &&
            validateCheck.data.body[`day${data.day}`]
          ) {
            message.error(
              "Ngày nghỉ đã tồn tại trước đó. Vui lòng chọn ngày nghỉ mới!"
            );
          } else {
            const response = await dayOffVacation.editDayOffVacation(dataPost);
            if (response.data.code === 200) {
              message.success("Thêm mới thành công");
              formControl.resetForm();
              closeModal();
            } else {
              message.error("Thêm mới thất bại");
            }
          }
          setIsLoadingBtn(false);
        } catch (error: any) {
          message.error(error.message);
          setIsLoadingBtn(false);
        }
      } else {
        try {
          const dataPut: any = {
            id: data.id,
            month: data.month,
            year: data.year,
            [`day${data.day}`]: data.type,
            note: data.note,
          };
          setIsLoadingBtn(true);
          const response = await dayOffVacation.editDayOffVacation(dataPut);
          if (response.data.code === 200) {
            message.success("Cập nhật thành công");
            formControl.resetForm();
            closeModal();
          } else {
            message.error("Cập nhật thất bại");
          }
          setIsLoadingBtn(false);
        } catch (error: any) {
          message.error(error.message);
          setIsLoadingBtn(false);
        }
      }
    },
  });

  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Ngày xin nghỉ",
      disable: action === "update" ? true : false,
      css: css,
      require: true,
      type: DATE_PICKER,
      placeholder: DATE_TIME_FORMAT.day,
      formatDatetime: DATE_TIME_FORMAT.day,
      value: dayjs(formControl.values.fullDay),
      onChange: (value: string) => {
        formControl.setValues({
          ...formControl.values,
          fullDay: dayjs(value),
          day: dayjs(value).date(),
          month: dayjs(value).month() + 1,
          year: dayjs(value).year(),
        });
      },
    },
    {
      key: 2,
      label: "Thời gian nghỉ",
      type: SELECT,
      require: true,
      options: [
        { label: "Nghỉ buổi sáng", value: "morning_break" },
        { label: "Nghỉ buổi chiều", value: "afternoon_break" },
        { label: "Nghỉ cả ngày", value: "rest_all_day" },
      ],
      css: css,
      showSearch: true,
      value: formControl.values.type || "morning_break",
      onChange: (value: any) => {
        handleChangeForm({ type: value });
      },
    },
    {
      key: 3,
      label: "Ghi chú",
      require: true,
      type: INPUT,
      css: css,
      value: formControl.values.note,
      onChange: (e: any) => {
        handleChangeForm({ note: e.target.value });
      },
    },
  ];

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={() => {
        closeModal();
        formControl.resetForm();
      }}
      className="modal-category-invest"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalEditAssignment-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate
            title={action === "add" ? "Thêm ngày nghỉ" : "Sửa ngày nghỉ"}
            color="#fff"
          />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => {
              closeModal();
              formControl.resetForm();
            }}
            size="small"
          />
        </Row>
        <Form
          form={form}
          onFinish={formControl.handleSubmit}
          labelAlign="left"
          labelWrap
          size="small"
        >
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>

          <Row
            justify={"end"}
            style={{ marginTop: 6, marginBottom: 6 }}
            className="button-row"
          >
            <Space>
              <ButtonCustom
                label="Hủy bỏ"
                onClick={() => {
                  closeModal();
                  formControl.resetForm();
                }}
              />
              <ButtonCustom
                // htmlType="submit"
                disabled={isLoading}
                label="Lưu lại"
                type="primary"
                bgColor="rgba(40, 98, 175, 1)"
                onClick={formControl.submitForm}
              />
            </Space>
          </Row>
        </Form>
      </Space>
    </Modal>
  );
};
export default EditDayOffModal;
