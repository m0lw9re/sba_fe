import { Form, Row, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import { DynamicTable } from "components/DynamicTable";
import InputFields from "components/InputFields";
import FormItem from "components/InputFields/FormItem";
import renderRequired from "components/RenderRequire";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import {
  AssetsLegalInformationType,
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
  legalInformations: Array<AssetsLegalInformationType>;
  legalInformation_full?: string | null;
  noteSpecifications?: string | null;
  noteLegalSBA?: string | null;
};

type RefProps = {
  updateLegalInfors: () => void;
};

type FormDataType = {
  legalInformations: Array<AssetsLegalInformationType>;
  noteLegalSBA: string | null;
};

const initialValue: FormDataType = {
  legalInformations: [],
  noteLegalSBA: "",
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
      details: Yup.string().max(1000, "Chỉ nhập được 1000 ký tự").nullable(),
    })
  ),
});

const LegalTransportInfo = forwardRef<RefProps, Props>(
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
    const formControl = useFormik({
      initialValues: initialValue,
      validateOnChange: true,
      validationSchema: formSchema,
      onSubmit: (data): any => {
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
      updateLegalInfors: handleSubmit,
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

    const errorsLegalInformation: any = formControl.errors.legalInformations;
    const touchLegalInformation: any = formControl.touched.legalInformations;

    const columns: ColumnsType<AssetsLegalInformationType> = [
      {
        key: 1,
        dataIndex: "legalInformationTypeId",
        title: "Tên hồ sơ pháp lý",
        render: (legalInformationTypeId, record, index: number) => {
          return (
            <FormItem
              type={SELECT}
              error={errorsLegalInformation?.[index]?.legalInformationTypeId}
              touched={touchLegalInformation?.[index]?.legalInformationTypeId}
              options={
                legalInforOptions?.map((item: LegalDocumentTypeType) => {
                  return {
                    label: item.name,
                    value: item.legalDocumentTypeId,
                  };
                }) || []
              }
              style={{
                maxWidth: "322px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              value={legalInformationTypeId}
              onChange={(value: any) =>
                handleChangeRow(record.key || "", {
                  legalInformationTypeId: value,
                })
              }
            />
          );
        },
        width: "15%",
      },
      {
        key: 2,
        dataIndex: "legalInformationNumber",
        title: "Số hiệu HSPL",
        render: (legalInformationNumber, record, index: number) => {
          return (
            <FormItem
              // error={errorsLegalInformation?.[index]?.legalInformationNumber}
              // touched={touchLegalInformation?.[index]?.legalInformationNumber}
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
        width: "15%",
      },
      {
        key: 3,
        dataIndex: "issueUnit",
        title: "Cơ quan cấp/bán/cho thuê",
        render: (issueUnit, record, index: number) => {
          return (
            <FormItem
              type={INPUT}
              error={errorsLegalInformation?.[index]?.issueUnit}
              touched={touchLegalInformation?.[index]?.issueUnit}
              value={issueUnit || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  issueUnit: e.target.value,
                })
              }
            />
          );
        },
        width: "15%",
      },
      {
        key: 4,
        dataIndex: "issueDate",
        title: "Ngày ký/ngày cấp",
        render: (issueDate, record, index: number) => {
          return (
            <FormItem
              type={DATE_PICKER}
              error={errorsLegalInformation?.[index]?.issueDate}
              touched={touchLegalInformation?.[index]?.issueDate}
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
        width: "12%",
      },
      {
        key: 5,
        dataIndex: "owner",
        title: "Đơn vị/Người đứng tên/ Chủ sở hữu/ Đăng ký",
        render: (owner, record, rowIndex) => {
          const err: any = formControl.errors?.legalInformations?.[rowIndex];
          return (
            <FormItem
              type={POPUP_INPUT}
              value={owner || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  owner: e.target.value,
                })
              }
              error={errorsLegalInformation?.[rowIndex]?.owner}
              touched={touchLegalInformation?.[rowIndex]?.owner}
            />
          );
        },
        width: "20%",
      },
      {
        key: 6,
        dataIndex: "details",
        title: "Chi tiết",
        render: (details, record, index: number) => {
          return (
            <FormItem
              maxLength={1000}
              type={POPUP_INPUT}
              error={errorsLegalInformation?.[index]?.details}
              touched={touchLegalInformation?.[index]?.details}
              value={details || ""}
              onChange={(e: any) =>
                handleChangeRow(record.key || "", {
                  details: e.target.value,
                })
              }
            />
          );
        },
        width: "20%",
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
      // setLegalInfoList((prev) => [...prev, newItem]);
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
      // setLegalInfoList((prev) => [...legalInfoList, newRecord]);
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
        disable: true,
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

export default LegalTransportInfo;
