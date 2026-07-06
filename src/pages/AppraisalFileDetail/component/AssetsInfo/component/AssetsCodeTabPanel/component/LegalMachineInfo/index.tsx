/* eslint-disable react/jsx-pascal-case */
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { ColumnsType } from "antd/es/table";
import {
  AssetsLegalInformationType,
  LegalDocumentTypeType,
} from "constant/types/appraisalFile";
import { randomId } from "utils";
import { TYPE_FIELD } from "constant/enums";
import dayjs from "dayjs";
import { Space, Row, Form } from "antd";
import { DynamicTable } from "components/DynamicTable";
import { useCustomerDocumentType } from "utils/request";
import InputFields from "components/InputFields";
import { InputFiledParams } from "constants/types/Form_Field_type";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";
import FormItem from "components/InputFields/FormItem";
import * as Yup from "yup";
import { useFormik } from "formik";
import { validLengthInput } from "utils/validate";
import renderRequire from "components/RenderRequire";

const { INPUT, SELECT, DATE_PICKER, TEXT_AREA, POPUP_INPUT } = TYPE_FIELD;

type Props = {
  assetLevelTwoId: number | null;
  legalInformations: Array<AssetsLegalInformationType>;
  legalInformation_full?: string | null;
  noteSpecifications?: string | null;
  noteLegalSBA?: string | null;
};

type RefProps = {
  updateLegalMachineInfors: () => void;
};

const formSchema = Yup.object().shape({
  noteLegalSBA: Yup.string()
    .trim()
    .max(500, "Chỉ nhập được 500 ký tự.")
    .nullable(),
  legalInformations: Yup.array().of(
    Yup.object().shape({
      issueUnit: Yup.string()
        .nullable()
        .test("legalMachieSchemaIssueUnit", "Chỉ nhập được 255 ký tự", (val) =>
          validLengthInput(val, 255)
        ),
      owner: Yup.string()
        .nullable()
        .test("legalMachieSchemaOwner", "Chỉ nhập được 255 ký tự", (val) =>
          validLengthInput(val, 255)
        ),
    })
  ),
});

type LegalMachineFormType = {
  legalInformations: Array<AssetsLegalInformationType>;
  noteLegalSBA: string | null;
};

const initialValue: LegalMachineFormType = {
  legalInformations: [],
  noteLegalSBA: "",
};

const LegalMachineInfo = forwardRef<RefProps, Props>(
  (
    {
      assetLevelTwoId,
      legalInformations,
      legalInformation_full,
      noteSpecifications,
      noteLegalSBA,
    },
    ref
  ) => {
    const form = useFormik({
      initialValues: initialValue,
      validateOnChange: true,
      validationSchema: formSchema,
      onSubmit: (data: LegalMachineFormType): any => {
        return {
          ...data,
          legalInformations: data?.legalInformations?.map((item, index) => ({
            ...item,
            orderBy: index,
          })),
        };
      },
    });

    const { data: legalInforOptions } = useCustomerDocumentType({
      // customerTypeId: customerTypeId,
      assetLevelTwoId: assetLevelTwoId === 8 ? 1 : assetLevelTwoId,
    });

    useImperativeHandle(ref, () => ({
      updateLegalMachineInfors: async () => {
        return form.submitForm();
      },
    }));

    useEffect(() => {
      if (legalInformations) {
        form.setValues({
          ...form.values,
          legalInformations: legalInformations.map(
            (item: AssetsLegalInformationType) => ({ ...item, key: randomId() })
          ),
          noteLegalSBA: noteLegalSBA || "",
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [legalInformations]);

    const errorsLegalMachineInformation: any = form.errors.legalInformations;
    const touchLegalMachineInformation: any = form.touched.legalInformations;

    const columns: ColumnsType<AssetsLegalInformationType> = [
      {
        key: 1,
        dataIndex: "legalInformationTypeId",
        title: "Tên hồ sơ pháp lý",
        render: (legalInformationTypeId, record, rowIndex) => {
          return (
            <FormItem
              type={SELECT}
              options={
                legalInforOptions?.map((item: LegalDocumentTypeType) => {
                  return {
                    label: item.name,
                    value: item.legalDocumentTypeId,
                  };
                }) || []
              }
              value={legalInformationTypeId}
              style={{
                maxWidth: "250px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onChange={(value: any) =>
                handleChangeRow(record.key || "", {
                  legalInformationTypeId: value,
                })
              }
            />
          );
        },
        width: "20%",
      },
      {
        key: 2,
        dataIndex: "legalInformationNumber",
        title: "Số hiệu HSPL",
        render: (legalInformationNumber, record, rowIndex) => {
          // const err: any = form.errors?.legalInformations?.[rowIndex];
          return (
            <FormItem
              type={INPUT}
              value={legalInformationNumber || ""}
              onChange={(e: any) => {
                handleChangeRow(record.key || "", {
                  legalInformationNumber: e.target.value || "",
                });
              }}
              // error={
              //   errorsLegalMachineInformation?.[rowIndex]
              //     ?.legalInformationNumber
              // }
              // touched={
              //   touchLegalMachineInformation?.[rowIndex]?.legalInformationNumber
              // }
            />
          );
        },
        width: "15%",
      },
      {
        key: 3,
        dataIndex: "issueUnit",
        title: "Cơ quan cấp/bán/cho thuê",
        render: (issueUnit, record, rowIndex) => {
          const err: any = form.errors?.legalInformations?.[rowIndex];
          return (
            <FormItem
              type={INPUT}
              value={issueUnit || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  issueUnit: e.target.value,
                })
              }
              error={errorsLegalMachineInformation?.[rowIndex]?.issueUnit}
              touched={touchLegalMachineInformation?.[rowIndex]?.issueUnit}
            />
          );
        },
      },
      {
        key: 4,
        dataIndex: "issueDate",
        title: "Ngày ký/ngày cấp",
        render: (issueDate, record) => {
          return (
            <FormItem
              type={DATE_PICKER}
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
        title: "Đơn vị/Người đứng tên/ Chủ sở hữu/ Đăng ký",
        render: (owner, record, rowIndex) => {
          const err: any = form.errors?.legalInformations?.[rowIndex];
          return (
            <FormItem
              type={POPUP_INPUT}
              error={errorsLegalMachineInformation?.[rowIndex]?.owner}
              touched={touchLegalMachineInformation?.[rowIndex]?.owner}
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
        dataIndex: "details",
        title: "Chi tiết",
        render: (details, record) => {
          // return (
          //   <InputCustom
          //     value={details || ""}
          //     onChange={(e) => {
          //       handleChangeRow(record.key || "", {
          //         details: e.target.value,
          //       });
          //     }}
          //   />
          // );
          return (
            <FormItem
              maxLength={1000}
              type={POPUP_INPUT}
              value={details}
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
      const newItem: AssetsLegalInformationType = {
        key: randomId(),
        legalInformationTypeId: null,
        legalInformationNumber: null,
        issueUnit: null,
        issueDate: null,
        owner: "",
        details: "",
      };
      form.setValues({
        ...form.values,
        legalInformations: [...form.values.legalInformations, newItem],
      });
    };

    const handleCopyRow = (record: any) => {
      const newRecord = {
        ...record,
        id: randomId(),
        key: randomId(),
      };
      delete newRecord.legalInformationId;
      form.setValues({
        ...form.values,
        legalInformations: [...form.values.legalInformations, newRecord],
      });
    };
    const handleRemoveRow = (record: any) => {
      const tmpArr = [...form.values.legalInformations];
      const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

      if (foundIndex === -1) return;

      tmpArr.splice(foundIndex, 1);
      form.setValues({ ...form.values, legalInformations: [...tmpArr] });
    };

    const handleChangeRow = (key: string, data: any) => {
      const tmpArr = [...form.values.legalInformations];
      const foundIndex = tmpArr.findIndex((el) => el.key === key);
      if (foundIndex === -1) return;

      tmpArr[foundIndex] = { ...tmpArr[foundIndex], ...data };
      form.setValues({ ...form.values, legalInformations: [...tmpArr] });
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
        value: legalInformation_full,
      },
      {
        key: 12,
        label: "Ghi chú thông số kỹ thuật",
        showCount: false,
        type: TEXT_AREA,
        allowClear: false,
        maxLength: 6000,
        placeholder: "Hệ thống tự nhập",
        css: { xs: 24 },
        labelCol: { xs: 24, md: 4 },
        wrapperCol: { xs: 24, md: 20 },
        value: noteSpecifications || null,
        disable: true,
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
        value: form.values.noteLegalSBA || null,
        onChange: (e: any) =>
          form.setValues({
            ...form.values,
            noteLegalSBA: e.target.value,
          }),
        error: form.errors.noteLegalSBA,
        touched: form.touched.noteLegalSBA,
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
          dataSource={form.values.legalInformations}
          onAddRow={handleAddRow}
          onRemoveRow={(record) => handleRemoveRow(record)}
        />
      </Space>
    );
  }
);

export default LegalMachineInfo;
