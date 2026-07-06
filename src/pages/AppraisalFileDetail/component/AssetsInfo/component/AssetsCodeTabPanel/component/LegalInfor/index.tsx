/* eslint-disable react/jsx-pascal-case */
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { DynamicTable } from "components/DynamicTable";
import { ColumnsType } from "antd/es/table";
import {
  AssetsLegalInformationType,
  LegalDocumentTypeType,
} from "constant/types/appraisalFile";
import { randomId } from "utils/string";
import SelectCustom from "components/SelectCustom";
import InputCustom from "components/InputCustom";
import DatePickerCustom from "components/DatePickerCustom";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT, TYPE_FIELD } from "constant/enums";
import { Form, Row, Space } from "antd";
import InputFields from "components/InputFields";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { useCustomerDocumentType } from "utils/request";
import FormItem from "components/InputFields/FormItem";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";
import "./style.scss";

const { POPUP_INPUT, TEXT_AREA } = TYPE_FIELD;

type Props = {
  assetLevelTwoId: number | null;
  legalInformations: Array<AssetsLegalInformationType>;
  legalInformation_full?: string | null;
  noteLegalSBA?: string | null;
};

type RefProps = {
  updateLegalInfors: () => void;
};

const LegalInfor = forwardRef<RefProps, Props>(
  (
    { assetLevelTwoId, legalInformations, legalInformation_full, noteLegalSBA },
    ref
  ) => {
    const [legalInfoList, setLegalInfoList] = useState<
      Array<AssetsLegalInformationType>
    >([]);
    const [valNoteLegalSBA, setValNoteLegalSBA] = useState<string>(
      noteLegalSBA || ""
    );

    const { data: legalInforOptions } = useCustomerDocumentType({
      // customerTypeId: customerTypeId,
      assetLevelTwoId: assetLevelTwoId === 8 ? 1 : assetLevelTwoId,
    });

    useImperativeHandle(ref, () => ({
      updateLegalInfors: () => ({
        noteLegalSBA: valNoteLegalSBA,
        legalInformations: legalInfoList?.map((item, index) => ({
          ...item,
          orderBy: index,
        })),
      }),
    }));

    useEffect(() => {
      if (legalInformations) {
        setLegalInfoList(
          legalInformations.map((item) => ({ ...item, key: randomId() }))
        );
      }
    }, [legalInformations]);

    const columns: ColumnsType<AssetsLegalInformationType> = [
      {
        key: 1,
        dataIndex: "legalInformationTypeId",
        title: "Tên hồ sơ pháp lý",
        render: (legalInformationTypeId, record) => {
          return (
            <SelectCustom
              showSearch={true}
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
                maxWidth: "322px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              allowClear
              onChange={(value) =>
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
        render: (legalInformationNumber, record) => {
          return (
            <InputCustom
              value={legalInformationNumber || ""}
              onChange={(e) =>
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
        render: (issueUnit, record) => {
          return (
            <InputCustom
              value={issueUnit || ""}
              onChange={(e) =>
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
        render: (issueDate, record) => {
          // console.log(
          //   "date: ",
          //   dayjs("20-10-2023 11:00:10", "DD-MM-YYYY hh:mm:ss")
          // );
          return (
            <DatePickerCustom
              format={DATE_TIME_FORMAT.day}
              allowClear={true}
              value={issueDate ? dayjs(issueDate) : null}
              onChange={(value: any) => {
                handleChangeRow(record.key || "", {
                  issueDate: value
                    ? dayjs(value).toISOString()
                    : //
                      null,
                });
              }}
            />
          );
        },
      },
      {
        key: 5,
        dataIndex: "owner",
        title: "Đơn vị/Người đứng tên/Chủ đầu tư",
        render: (owner, record) => {
          return (
            <FormItem
              type={POPUP_INPUT}
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
          return (
            <FormItem
              maxLength={1000}
              type={POPUP_INPUT}
              value={details || ""}
              onChange={(e: any) => {
                handleChangeRow(record.key || "", {
                  details: e.target.value,
                });
              }}
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
    const handleCopyRow = (record: any) => {
      const newRecord = {
        ...record,
        id: randomId(),
        key: randomId(),
      };
      delete newRecord.legalInformationId;
      setLegalInfoList([...legalInfoList, newRecord]);
    };
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
      setLegalInfoList((prev) => [...prev, newItem]);
    };

    const handleRemoveRow = (record: any) => {
      const tmpArr = [...legalInfoList];
      const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

      if (foundIndex === -1) return;

      tmpArr.splice(foundIndex, 1);
      setLegalInfoList([...tmpArr]);
    };

    const handleChangeRow = (key: string, data: any) => {
      const tmpArr = [...legalInfoList];
      const foundIndex = tmpArr.findIndex((el) => el.key === key);
      if (foundIndex === -1) return;

      tmpArr[foundIndex] = { ...tmpArr[foundIndex], ...data };
      setLegalInfoList([...tmpArr]);
    };
    const inputSearchBasic: InputFiledParams[] = [
      {
        key: 12,
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
        value: valNoteLegalSBA,
        onChange: (e: any) => setValNoteLegalSBA(e.target.value),
      },
    ];

    return (
      <Space
        direction="vertical"
        size={"small"}
        style={{ width: "100%" }}
        className="feature-technique-legal-infor-container"
      >
        <Form labelAlign="left" labelWrap size="small" layout="inline">
          <Row gutter={[8, 8]} style={{ width: "100%" }}>
            <InputFields data={inputSearchBasic} />
          </Row>
        </Form>
        <DynamicTable
          columns={columns}
          dataSource={legalInfoList}
          onAddRow={handleAddRow}
          onRemoveRow={(record) => handleRemoveRow(record)}
        />
      </Space>
    );
  }
);

export default memo(LegalInfor);
