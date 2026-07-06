import { Form, Row, Space, Card } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "./style.scss";
import { FC, useEffect, useState } from "react";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";

const { INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  dataItem: any;
};

const TotalDebt: FC<Props> = ({ dataItem }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [totalDebtOneValue, setTotalDebtOneValue] = useState(0);
  const [totalDebtTwoValue, setTotalDebtTwoValue] = useState(0);
  const [totalDebtValue, setTotalDebtValue] = useState(0);
  const [totalRevenueOneValue, setTotalRevenueOneValue] = useState(0);
  const [totalRevenueTwoValue, setTotalRevenueTwoValue] = useState(0);
  const [totalRevenueValue, setTotalRevenueValue] = useState(0);

  const calRevenueOne = (feeContents: any[]) => {
    if (!feeContents) return 0;

    //Tìm dòng phí đợt 1
    const pd1 = feeContents.find((el: any) => el.contentId === 1);

    //Tìm dòng công tác phí
    const ctp = feeContents.find((el: any) => el.contentId === 3);

    //Nếu trạng thái là Đã xuất hoá đơn thì mới tính vào doanh thu
    const daThu =
      (pd1?.status === 5 ? pd1?.daThu : 0) +
      (ctp?.status === 5 ? ctp?.daThu : 0);
    const gnnb = (pd1?.received || 0) + (ctp?.received || 0);
    const revenue = daThu || 0 + gnnb;
    return revenue;
  };

  const calRevenueTwo = (feeContents: any[]) => {
    if (!feeContents) return 0;

    //Tìm dòng phí đợt 2
    const pd2 = feeContents.find((el: any) => el.contentId === 2);

    //Nếu trạng thái là Đã xuất hoá đơn thì mới tính vào doanh thu
    const daThu = pd2?.status === 5 ? pd2?.daThu : 0;
    const gnnb = pd2?.received || 0;
    const revenue = daThu || 0 + gnnb;
    return revenue;
  };

  useEffect(() => {
    setTotalDebtOneValue(dataItem?.totalDebtOne);
    setTotalDebtTwoValue(dataItem?.totalDebtTwo);
    setTotalDebtValue(dataItem?.totalDebt);

    setTotalRevenueOneValue(dataItem?.totalRevenueOne);
    setTotalRevenueTwoValue(dataItem?.totalRevenueTwo);
    setTotalRevenueValue(dataItem?.totalRevenue);
  }, [dataItem]);

  // useEffect(() => {
  //   setTotalRevenueValue(totalRevenueOneValue + totalRevenueTwoValue);
  // }, [
  //   dataItem,
  //   totalDebtOneValue,
  //   totalDebtTwoValue,
  //   totalRevenueOneValue,
  //   totalRevenueTwoValue,
  // ]);

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
  const inputFields: InputFiledParams[] = [
    {
      key: 1,
      label: "Tổng công nợ 1",
      type: INPUT_NUMBER,
      currencable: true,
      isRounded: true,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: totalDebtOneValue,
      // require: true,
      disable: isEditing,
      onChange: (e: any) => setTotalDebtOneValue(e.target.value),
    },
    {
      key: 2,
      label: "Tổng doanh thu 1",
      type: INPUT_NUMBER,
      currencable: true,
      isRounded: true,
      css: css,
      className: { align: "right" },
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: totalRevenueOneValue,
      // require: true,
      disable: isEditing,
      onChange: (e: any) => setTotalRevenueOneValue(e.target.value),
    },
    {
      key: 3,
      label: "Tổng công nợ 2",
      type: INPUT_NUMBER,
      currencable: true,
      isRounded: true,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: totalDebtTwoValue,
      // require: true,
      disable: isEditing,
      onChange: (e: any) => setTotalDebtTwoValue(e.target.value),
    },
    {
      key: 4,
      label: "Tổng doanh thu 2",
      type: INPUT_NUMBER,
      currencable: true,
      isRounded: true,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: totalRevenueTwoValue,
      // require: true,
      disable: isEditing,
      onChange: (e: any) => setTotalRevenueTwoValue(e.target.value),
    },
    {
      key: 5,
      label: "Tổng công nợ",
      type: INPUT_NUMBER,
      currencable: true,
      isRounded: true,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: totalDebtValue,
      // require: true,
      disable: isEditing,
      onChange: (e: any) => setTotalDebtValue(e.target.value),
    },
    {
      key: 6,
      label: "Tổng doanh thu",
      type: INPUT_NUMBER,
      currencable: true,
      isRounded: true,
      css: css,
      labelCol: { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 },
      wrapperCol: { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 },
      value: totalRevenueValue,
      // require: true,
      disable: isEditing,
      onChange: (e: any) => setTotalRevenueValue(e.target.value),
    },
  ];

  return (
    <Card
      className="total-debt-container"
      size="small"
      style={{ padding: "4px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Tổng doanh thu, công nợ" />
      </div>
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={"small"}
        className="commonInfo-wrapper"
      >
        <Form labelAlign="left" labelWrap size="small">
          <Row gutter={[24, 4]}>
            <InputFields data={inputFields} />
          </Row>
        </Form>
      </Space>
    </Card>
  );
};

export default TotalDebt;
