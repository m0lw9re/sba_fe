import { Form, Row, Space, Card } from "antd";
import InputFields from "components/InputFields";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "./style.scss";
import { FC, useEffect, useState } from "react";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { useDispatch } from "react-redux";
import { setTotalDebt } from "pages/AccountantDebtDetail/store/accountantDebtDetailSlice";

const { INPUT_NUMBER } = TYPE_FIELD;

const TotalDebt: FC<any> = ({ accountDetail, props }) => {
  const { dataItem } = props;
  const [isEditing, setIsEditing] = useState(true);
  const [staffName, setStaffName] = useState("");
  const [totalDebtOneValue, setTotalDebtOneValue] = useState(0);
  const [totalDebtTwoValue, setTotalDebtTwoValue] = useState(0);
  const [totalDebtValue, setTotalDebtValue] = useState(0);
  const [totalRevenueOneValue, setTotalRevenueOneValue] = useState(0);
  const [totalRevenueTwoValue, setTotalRevenueTwoValue] = useState(0);
  const [totalRevenueValue, setTotalRevenueValue] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    setTotalDebtOneValue(dataItem?.totalDebtOne);
    setTotalDebtTwoValue(dataItem?.totalDebtTwo);
    setTotalDebtValue(dataItem?.totalDebt);

    // setTotalRevenueOneValue(dataItem?.totalRevenueOne);
    // setTotalRevenueTwoValue(dataItem?.totalRevenueTwo);
    // setTotalRevenueValue(dataItem?.totalRevenue);

    //   setTotalDebtOneValue(
    //     dataItem &&
    //       dataItem.feeContents
    //         .filter(
    //           (item: any) =>
    //             (item.contentId === 3 &&
    //               (item.received > 0 || item.statusEms === 3)) ||
    //             (item.contentId === 1 &&
    //               (item.received > 0 || item.statusEms === 3))
    //         )
    //         .reduce((sum: any, cur: any) => sum + cur.congNo, 0)
    //   );
    //   setTotalDebtTwoValue(
    //     dataItem &&
    //       dataItem.feeContents
    //         .filter(
    //           (item: any) =>
    //             item.contentId === 2 &&
    //             (item.received > 0 || item.statusEms === 3)
    //         )
    //         .reduce((sum: any, cur: any) => sum + cur.congNo, 0)
    //   );

    setTotalRevenueOneValue(
      dataItem &&
        dataItem.feeContents
          .filter(
            (item: any) =>
              (item.contentId === 3 &&
                (item.received > 0 || item.statusEms === 3)) ||
              (item.contentId === 1 &&
                (item.received > 0 || item.statusEms === 3))
          )
          .reduce(
            (sum: any, cur: any) =>
              sum + cur.soTienXuatHoaDonThucTe + cur.received,
            0
          )
    );
    setTotalRevenueTwoValue(
      dataItem &&
        dataItem.feeContents
          .filter(
            (item: any) =>
              item.contentId === 2 &&
              (item.received > 0 || item.statusEms === 3)
          )
          .reduce(
            (sum: any, cur: any) =>
              sum + cur.soTienXuatHoaDonThucTe + cur.received,
            0
          )
    );
  }, [dataItem]);

  useEffect(() => {
    // setTotalDebtValue(totalDebtOneValue + totalDebtTwoValue);
    setTotalRevenueValue(totalRevenueOneValue + totalRevenueTwoValue);
    // dispatch(
    //   setTotalDebt({
    //     totalDebtValue: totalDebtOneValue + totalDebtTwoValue,
    //     totalRevenueValue: totalRevenueOneValue + totalRevenueTwoValue,
    //   })
    // );
  }, [
    dataItem,
    totalDebtOneValue,
    totalDebtTwoValue,
    totalRevenueOneValue,
    totalRevenueTwoValue,
  ]);

  // const editFields = () => {
  //   setIsEditing(!isEditing);
  // };

  // const saveEditFields = async () => {
  //   setIsEditing(!isEditing);
  //   const data: StaffEditType = {
  //     staffName: staffName || accountDetail.staffName,
  //     username: accountDetail.username,
  //     phone: staffPhone || accountDetail.phone,
  //     address: staffAddress || accountDetail.address,
  //     staffEmail: staffEmail || accountDetail.staffEmail,
  //     positionId: staffPosition.positionId || accountDetail.positionId,
  //     dateOfBirth: selectedDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
  //   };
  //   try {
  //     const response = await accountApi.updateStaff(data);
  //     if (response.data.code === 200) {
  //       message.success(response.data.message);
  //     } else message.error(response.data.message);
  //   } catch (error: any) {
  //     message.error(error);
  //   }
  // };

  // const cancelEditFields = () => {
  //   setIsEditing(!isEditing);
  //   setStaffName(accountDetail?.staffName || "");
  //   setStaffPhone(accountDetail?.phone || "");
  //   setStaffAddress(accountDetail?.address || "");
  //   setStaffEmail(accountDetail?.staffEmail || "");
  //   setStaffPosition({
  //     positionId: accountDetail.position.positionId,
  //     positionName: accountDetail.position.positionName,
  //   });
  //   setSelectedDate(dayjs(accountDetail?.dateOfBirth));
  // };

  // const handleInputChange = (e: any) => {
  //   setStaffAddress(e.target.value);
  // };

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
            {/* <Col span={24}>
              <Form.Item
                className="form-item-custom"
                labelCol={{ span: 4 }}
                colon={false}
                label={
                  <Tooltip placement="bottom" title={"Địa chỉ"}>
                    <>Địa chỉ</>
                  </Tooltip>
                }
              >
                <Input
                  value={staffAddress}
                  placeholder={"Nhập"}
                  className="form-input-custom"
                  disabled={isEditing}
                  // onChange={(e) => handleInputChange(e)}
                />
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
        {/* <Row justify={"end"}>
          {isEditing && (
            <ButtonCustom
              // onClick={editFields}
              label="Chỉnh sửa"
              icon={<EditSVG />}
              size="small"
            />
          )}

          {!isEditing && (
            <div className="btn-fields">
              <ButtonCustom
                label="Lưu"
                type="default"
                size="small"
                className="btn-fields__edit"
                onClick={saveEditFields}
              />
              <ButtonCustom
                label="Hủy"
                danger
                type="primary"
                size="small"
                className="btn-fields__del"
                onClick={cancelEditFields}
              />
            </div>
            <Space>
              <ButtonCustom
                label="Lưu"
                type="default"
                size="small"
                className="btn-fields__edit"
                onClick={saveEditFields}
              />
              <ButtonCustom
                label="Hủy"
                danger
                type="primary"
                size="small"
                className="btn-fields__del"
                onClick={cancelEditFields}
              />
            </Space>
          )}
        </Row> */}
      </Space>
    </Card>
  );
};

export default TotalDebt;
