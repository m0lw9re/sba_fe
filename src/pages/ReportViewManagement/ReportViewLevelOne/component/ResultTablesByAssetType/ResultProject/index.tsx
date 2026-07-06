import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import InputFields from "components/InputFields";
import FormItem from "components/InputFields/FormItem";
import TitleCustom from "components/TitleCustom";
import { TYPE_FIELD } from "constant/enums";
import {
  ApprovalHistoryConstructionDtos,
  ApprovalHistoryValues,
} from "constant/types/appraisalFile";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { FC } from "react";
import { numberUtils } from "utils";
import { UpdateInfoProps } from "../../..";
import "../style.scss";
import { isNumber, sortBy } from "lodash";

const { INPUT_NUMBER, INPUT } = TYPE_FIELD;

type Props = {
  updateFormValue: UpdateInfoProps;
  setUpdateFormValue: any;
  totalValue: number;
  assetLevelTwoId: number;
};

export const ResultByProject: FC<Props> = (props) => {
  const { updateFormValue, setUpdateFormValue, totalValue, assetLevelTwoId } =
    props;
  const { approvalHistoryValues, approvalHistoryConstructionDtos } =
    updateFormValue;

  const columns: ColumnsType<ApprovalHistoryValues> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "stt",
      width: "5%",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      key: 2,
      title: "Tên tài sản",
      dataIndex: "name",
      width: "40%",
      align: "center",
      render: (name, _, index) => (
        <FormItem
          type={INPUT}
          value={name}
          onChange={(e: any) =>
            handleValueRowChange({ name: e.target.value }, index)
          }
          disable
          style={{ maxWidth: "400px", margin: "0 auto" }}
        />
      ),
    },
    {
      key: 4,
      title: "Diện tích (m²)",
      dataIndex: "totalArea",
      width: "10%",
      render: (totalArea, _, index) => (
        <FormItem
          type={INPUT_NUMBER}
          value={totalArea}
          currencable
          onChange={(value: number) =>
            handleValueRowChange({ totalArea: value }, index)
          }
        />
      ),
    },
    {
      key: 7,
      title: "Đơn giá (đồng/m²)",
      dataIndex: "unitPrice",
      width: "15%",
      render: (unitPrice, _, index) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={unitPrice}
          onChange={(value: number) =>
            handleValueRowChange({ unitPrice: value }, index)
          }
        />
      ),
    },
    {
      key: 8,
      title: "Giá trị (đồng)",
      dataIndex: "totalValue",
      width: "15%",
      render: (totalValue, record, index) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          disable={record?.isValuationResultProject ? false : true}
          value={totalValue}
          onChange={(value: number) =>
            handleValueRowChange({ totalValue: value }, index)
          }
        />
      ),
    },
  ];
  const handleValueRowChange = (data: any, index: number) => {
    const newApprovalHistoryValues = [...approvalHistoryValues];
    if (
      (!isNaN(data.totalArea) || !isNaN(data.unitPrice)) &&
      !newApprovalHistoryValues[index]?.isValuationResultProject
    ) {
      newApprovalHistoryValues[index] = {
        ...newApprovalHistoryValues[index],
        ...data,
        totalValue: Math.round(
          Number(data.totalArea ?? approvalHistoryValues[index].totalArea) *
            Number(data.unitPrice ?? approvalHistoryValues[index].unitPrice)
        ),
      };
    } else {
      newApprovalHistoryValues[index] = {
        ...newApprovalHistoryValues[index],
        ...data,
      };
    }
    setUpdateFormValue({
      ...updateFormValue,
      approvalHistoryValues: newApprovalHistoryValues,
    });
  };

  const columnsCTXD: ColumnsType<ApprovalHistoryConstructionDtos> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "stt",
      width: "5%",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      key: 2,
      title: "Loại công trình xây dựng",
      width: "20%",
      align: "center",
      render: (_, record, index: number) => (
        <FormItem
          type={INPUT}
          value={record.constructionTypeName}
          disable
          style={{ maxWidth: "300px", margin: "0 auto" }}
        />
      ),
    },
    {
      key: 3,
      title: "Tên công trình xây dựng",
      width: "24%",
      align: "center",
      render: (_, record, index: number) => (
        <FormItem
          type={INPUT}
          value={record.constructionName}
          disable
          style={{ maxWidth: "300px", margin: "0 auto" }}
        />
      ),
    },
    {
      key: 5,
      title: "CLCL %",
      dataIndex: "remainingQuality",
      width: "8%",
      render: (remainingQuality, _, index: number) => (
        <FormItem
          type={INPUT_NUMBER}
          percentable
          value={remainingQuality}
          onChange={(value: number) =>
            handleConstructionRowChange({ remainingQuality: value }, index)
          }
        />
      ),
    },
    {
      key: 6,
      title: "MĐHT (%)",
      dataIndex: "mdht",
      width: "8%",
      render: (mdht, _, index: number) => (
        <FormItem
          type={INPUT_NUMBER}
          value={mdht}
          percentable
          onChange={(value: number) =>
            handleConstructionRowChange({ mdht: value }, index)
          }
        />
      ),
    },
    {
      key: 4,
      title: "Diện tích sử dụng (m²)",
      dataIndex: "constructionArea",
      width: "8%",
      render: (constructionArea, _, index: number) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          value={constructionArea}
          onChange={(value: number) =>
            handleConstructionRowChange({ constructionArea: value }, index)
          }
        />
      ),
    },
    {
      key: 7,
      title: "Đơn giá (đồng/m2 hoặc đ/m3)",
      dataIndex: "unitPrice",
      width: "12%",
      render: (unitPrice, _, index: number) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={unitPrice}
          onChange={(value: number) =>
            handleConstructionRowChange({ unitPrice: value }, index)
          }
        />
      ),
    },
    {
      key: 8,
      title: "Giá trị (đồng)",
      dataIndex: "totalValue",
      width: "12%",
      render: (totalValue, _, index: number) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          disable
          isRounded
          value={totalValue}
          onChange={(value: number) =>
            handleConstructionRowChange({ totalValue: value }, index)
          }
        />
      ),
    },
  ];
  const handleConstructionRowChange = (data: any, index: number) => {
    const newApprovalHistoryConstructionDtos = sortBy(
      approvalHistoryConstructionDtos,
      ["assetLandInforId", "orderBy"]
    );
    const remainingQuality =
      data?.remainingQuality !== undefined
        ? data?.remainingQuality
        : newApprovalHistoryConstructionDtos[index].remainingQuality ||
          undefined;
    const mdht =
      data?.mdht !== undefined
        ? data?.mdht
        : newApprovalHistoryConstructionDtos[index].mdht || undefined;
    const unitPrice =
      data?.unitPrice !== undefined
        ? data?.unitPrice
        : newApprovalHistoryConstructionDtos[index].unitPrice || 0;
    const constructionArea =
      data?.constructionArea !== undefined
        ? data?.constructionArea
        : newApprovalHistoryConstructionDtos[index].constructionArea || 0;
    if (isNumber(remainingQuality) && isNumber(mdht)) {
      newApprovalHistoryConstructionDtos[index] = {
        ...newApprovalHistoryConstructionDtos[index],
        ...data,
        totalValue: Math.round(Number(constructionArea) * Number(unitPrice)),
      };
    } else if (isNumber(remainingQuality) && !isNumber(mdht)) {
      newApprovalHistoryConstructionDtos[index] = {
        ...newApprovalHistoryConstructionDtos[index],
        ...data,
        totalValue: Math.round(
          Number(constructionArea) *
            Number(unitPrice) *
            (Number(remainingQuality) / 100)
        ),
      };
    } else {
      newApprovalHistoryConstructionDtos[index] = {
        ...newApprovalHistoryConstructionDtos[index],
        ...data,
      };
    }
    setUpdateFormValue({
      ...updateFormValue,
      approvalHistoryConstructionDtos: newApprovalHistoryConstructionDtos,
    });
  };
  return (
    <div>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <TitleCustom title="Kết quả chi tiết tài sản" size="middle" />
        <Table
          className="table-result-wrapper"
          size="small"
          bordered
          columns={columns}
          dataSource={sortBy(approvalHistoryValues, ["orderBy"]) || []}
          pagination={false}
        />
      </Space>
      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", marginTop: 10 }}
      >
        <TitleCustom title="Kết quả chi tiết giá CTXD" size="middle" />
        <Table
          className="table-result-wrapper"
          size="small"
          bordered
          columns={columnsCTXD}
          dataSource={
            sortBy(approvalHistoryConstructionDtos, [
              "assetLandInforId",
              "orderBy",
            ]) || []
          }
          pagination={false}
        />
      </Space>
      <Space
        direction="horizontal"
        size="middle"
        style={{ width: "100%", marginTop: "24px" }}
      >
        <TitleCustom title="Tổng giá trị tài sản (đồng):" size="middle" />
        <span style={{ fontWeight: 700, color: "#3d9ffb", fontSize: "17px" }}>
          {numberUtils.formatNumber(totalValue)}
        </span>
      </Space>
    </div>
  );
};
