import { Form, Row, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import { DynamicTable } from "components/DynamicTable";
import InputFields from "components/InputFields";
import FormItem from "components/InputFields/FormItem";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import {
  AssetsLegalInformationType,
  AssetsLegalProjectInformationType,
  LegalDocumentTypeType,
} from "constant/types/appraisalFile";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { randomId } from "utils";
import { useCustomerDocumentType } from "utils/request";
import { stringValidate } from "utils/validate";
import * as Yup from "yup";

const { INPUT, SELECT, DATE_PICKER, TEXT_AREA, POPUP_INPUT } = TYPE_FIELD;

type Props = {
  assetLevelTwoId: number | null;
  legalInformations: Array<AssetsLegalProjectInformationType>;
  legalInformation_full?: string | null;
  noteLegalSBA?: string | null;
};

type RefProps = {
  updateLegalProjectInfors: () => void;
};

type FormDataType = {
  legalInformations: Array<AssetsLegalProjectInformationType>;
  noteLegalSBA: string | null;
};

const formSchema = Yup.object().shape({
  noteLegalSBA: Yup.string()
    .trim()
    .max(500, "Chỉ nhập được 500 ký tự.")
    .nullable(),
  legalInformations: Yup.array().of(
    Yup.object().shape({
      owner: stringValidate.max(255, "Chỉ nhập được 255 ký tự").nullable(),
      issueUnit: Yup.string()
        .trim()
        .max(255, "Chỉ nhập được 255 ký tự")
        .nullable(),
      details: Yup.string()
        .trim()
        .max(1000, "Chỉ nhập được 1000 ký tự")
        .nullable(),
      investor: Yup.string()
        .max(255, "Chỉ nhập được 255 ký tự").trim().nullable(),
    })
  ),
});

const LegalProjectInfo = forwardRef<RefProps, Props>(
  (
    { assetLevelTwoId, legalInformations, legalInformation_full, noteLegalSBA },
    ref
  ) => {
    const formControl = useFormik({
      initialValues: {} as FormDataType,
      //   validateOnChange: true,
      validationSchema: formSchema,
      onSubmit: (data: FormDataType): any => {
        return {
          ...data,
          legalInformations: formControl.values.legalInformations.map(
            (item, index) => ({ ...item, orderBy: index })
          ),
        };
      },
    });

    const handleSubmit = () => {
      return formControl.submitForm();
    };

    const { data: legalInforOptions } = useCustomerDocumentType({
      // customerTypeId: customerTypeId,
      assetLevelTwoId: assetLevelTwoId === 8 ? 1 : assetLevelTwoId,
    });

    useImperativeHandle(ref, () => ({
      updateLegalProjectInfors: handleSubmit,
    }));

    useEffect(() => {
      if (legalInformations) {
        formControl.setValues({
          ...formControl.values,
          legalInformations: legalInformations.map((item) => ({
            ...item,
            key: randomId(),
          })),
          noteLegalSBA: noteLegalSBA || "",
        });
      }
    }, []);

    const errorsLegalProjectInformation: any =
      formControl.errors.legalInformations;
    const touchLegalProjectInformation: any =
      formControl.touched.legalInformations;

    const columns: ColumnsType<AssetsLegalInformationType> = [
      {
        key: 1,
        dataIndex: "legalInformationTypeId",
        title: "Tên hồ sơ pháp lý",
        render: (legalInformationTypeId, record, rowIndex: number) => {
          return (
            <FormItem
              type={SELECT}
              error={
                errorsLegalProjectInformation?.[rowIndex]
                  ?.legalInformationTypeId
              }
              touched={
                touchLegalProjectInformation?.[rowIndex]?.legalInformationTypeId
              }
              options={
                legalInforOptions?.map((item: LegalDocumentTypeType) => {
                  return {
                    label: item.name,
                    value: item.legalDocumentTypeId,
                  };
                }) || []
              }
              value={legalInformationTypeId}
              onChange={(value: any) =>
                handleChangeRow(record.key || "", {
                  legalInformationTypeId: value,
                })
              }
              style={{width: "300px"}}
            />
          );
        },
      },
      {
        key: 2,
        dataIndex: "legalInformationNumber",
        title: "Số hiệu HSPL",
        render: (legalInformationNumber, record, index: number) => {
          return (
            <FormItem
              // error={
              //   errorsLegalProjectInformation?.[index]?.legalInformationNumber
              // }
              // touched={
              //   touchLegalProjectInformation?.[index]?.legalInformationNumber
              // }
              type={INPUT}
              value={legalInformationNumber || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  legalInformationNumber: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        key: 3,
        dataIndex: "issueUnit",
        title: "Cơ quan cấp/bán/cho thuê",
        render: (issueUnit, record, index: number) => {
          return (
            <FormItem
              type={INPUT}
              error={errorsLegalProjectInformation?.[index]?.issueUnit}
              touched={touchLegalProjectInformation?.[index]?.issueUnit}
              value={issueUnit || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  issueUnit: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        key: 4,
        dataIndex: "issueDate",
        title: "Ngày ký/ngày cấp",
        render: (issueDate, record, index: number) => {
          return (
            <FormItem
              type={DATE_PICKER}
              error={errorsLegalProjectInformation?.[index]?.issueDate}
              touched={touchLegalProjectInformation?.[index]?.issueDate}
              formatDatetime={DATE_TIME_FORMAT.day}
              allowClear={true}
              value={issueDate ? dayjs(issueDate) : null}
              onChange={(value: any) => {
                handleChangeRow(record.key || "", {
                  issueDate: value ? dayjs(value).toISOString() : null,
                });
              }}
            />
          );
        },
      },
      {
        key: 5,
        dataIndex: "owner",
        title: "Đơn vị/Người đứng tên chủ quyền/Hợp đồng",
        render: (owner, record, index: number) => {
          return (
            <FormItem
              type={POPUP_INPUT}
              error={errorsLegalProjectInformation?.[index]?.owner}
              touched={touchLegalProjectInformation?.[index]?.owner}
              value={owner || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  owner: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        key: 6,
        dataIndex: "investor",
        title: "Chủ đầu tư",
        render: (investor, record, index: number) => {
          return (
            <FormItem
              type={INPUT}
              error={errorsLegalProjectInformation?.[index]?.investor}
              touched={touchLegalProjectInformation?.[index]?.investor}
              value={investor || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  investor: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        key: 7,
        dataIndex: "details",
        title: "Chi tiết",
        render: (details, record, index: number) => {
          return (
            <FormItem
              maxLength={1000}
              type={POPUP_INPUT}
              error={errorsLegalProjectInformation?.[index]?.details}
              touched={touchLegalProjectInformation?.[index]?.details}
              value={details || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  details: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        key: "action",
        render: (_, record) => (
          <ButtonCustom
            bgColor="#00b335"
            size="small"
            icon={<Icons.copy style={{ color: "#FFFFFF" }} />}
            onClick={() => handleCopyRow(record)}
            style={{ justifyContent: "center" }}
          ></ButtonCustom>
        ),
        align: "center",
        width: "1.5%",
      },
    ];
    const handleAddRow = () => {
      const newItem: AssetsLegalProjectInformationType = {
        key: randomId(),
        legalInformationTypeId: null,
        legalInformationNumber: null,
        issueUnit: null,
        issueDate: null,
        owner: "",
        investor: "",
        details: "",
      };
      formControl.setValues({
        ...formControl.values,
        legalInformations: [...formControl.values.legalInformations, newItem],
      });
    };

    const handleCopyRow = (record: any) => {
      const newRecord = {
        ...record,
        id: randomId(),
        key: randomId(),
      };
      delete newRecord.legalInformationId;
      formControl.setValues({
        ...formControl.values,
        legalInformations: [...formControl.values.legalInformations, newRecord],
      });
    };
    const handleRemoveRow = (record: any) => {
      const tmpArr = [...formControl.values.legalInformations];
      const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

      if (foundIndex === -1) return;

      tmpArr.splice(foundIndex, 1);
      // setLegalInfoList([...tmpArr]);
      formControl.setValues({
        ...formControl.values,
        legalInformations: [...tmpArr],
      });
    };

    const handleChangeRow = (key: string, data: any) => {
      const tmpArr = [...formControl.values.legalInformations];
      const foundIndex = tmpArr.findIndex((el) => el.key === key);
      if (foundIndex === -1) return;

      tmpArr[foundIndex] = { ...tmpArr[foundIndex], ...data };
      formControl.setValues({
        ...formControl.values,
        legalInformations: [...tmpArr],
      });
    };

    const inputSearchBasic: InputFiledParams[] = [
      {
        key: 11,
        label: "Ghi chú Sacombank",
        showCount: false,
        type: TEXT_AREA,
        allowClear: false,
        maxLength: 6000,
        placeholder: "Hệ thống tự nhập",
        css: { xs: 24 },
        labelCol: { xs: 24, md: 4 },
        wrapperCol: { xs: 24, md: 20 },
        value: legalInformation_full || null,
      },
      {
        key: 13,
        label: "Ghi chú pháp lý SBA",
        showCount: true,
        type: TEXT_AREA,
        allowClear: false,
        maxLength: 500,
        placeholder: "nhập",
        css: { xs: 24 },
        labelCol: { xs: 24, md: 4 },
        wrapperCol: { xs: 24, md: 20 },
        value: formControl.values.noteLegalSBA || null,
        onChange: (e: any) =>
          formControl.setValues({
            ...formControl.values,
            noteLegalSBA: e.target.value,
          }),
        error: formControl.errors.noteLegalSBA,
        touched: formControl.touched.noteLegalSBA,
      },
    ];

    return (
      <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
        <Form labelAlign="left" labelWrap size="small" layout="inline">
          <Row gutter={[8, 8]} style={{ width: "100%" }}>
            <InputFields data={inputSearchBasic} />
          </Row>
        </Form>
        <DynamicTable
          columns={columns}
          dataSource={formControl.values.legalInformations}
          onAddRow={handleAddRow}
          onRemoveRow={(record) => handleRemoveRow(record)}
        />
      </Space>
    );
  }
);

export default LegalProjectInfo;
