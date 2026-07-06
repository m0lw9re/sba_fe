import { Checkbox, Col, Form, Row } from "antd";
import { ColumnsType } from "antd/es/table";
import ButtonCustom from "components/ButtonCustom";
import InputFields from "components/InputFields";
import TableCustom from "components/TableCustom";
import {
  DATE_TIME_FORMAT,
  LOCAL_STORAGE_KEY,
  PAGE_SIZE_OPTIONS,
  TYPE_FIELD,
} from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { numberUtils } from "utils";
import { useStoredAssetLandEstates } from "utils/request";
import "./style.scss";
import { CommonGetAllParams } from "constants/types/common.type";

const { INPUT } = TYPE_FIELD;

type Props = {
  selectedTSSS: any[];
  setSelectedTSSS: (data: any[]) => void;
};

const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };

const CompareAssetModalTable = (props: Props) => {
  const { selectedTSSS, setSelectedTSSS } = props;
  const [filterData, setFilterData] = useState<{
    assetCode: string;
    address: string;
  }>({ assetCode: "", address: "" });

  const { data, isLoading } = useStoredAssetLandEstates(
    {
      page: 1,
      limit: 10,
    },
    { ...filterData }
  );
  const [params, setParams] = useState<CommonGetAllParams>({
    count: localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE)
      ? Number(localStorage.getItem(LOCAL_STORAGE_KEY.PAGE_SIZE))
      : PAGE_SIZE_OPTIONS.OPTION_10,
    page: 1,
  });
  useEffect(() => {
    setParams({ ...params, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "#",
      width: 30,
      align: "center",
      dataIndex: "assetId",
      render: (assetId) => (
        <Checkbox
          checked={selectedTSSS.includes(assetId)}
          onChange={(e) => {
            const checked = e.target.checked;
            const tmp = [...selectedTSSS];
            if (checked) {
              tmp.push(assetId);
              setSelectedTSSS(tmp);
            } else {
              setSelectedTSSS(tmp.filter((el) => el !== assetId));
            }
          }}
        />
      ),
    },
    {
      key: 2,
      title: "Mã tài sản",
      dataIndex: "assetCode",
    },
    {
      key: 3,
      title: "Thời điểm định giá",
      dataIndex: "appraisalTime",
      align: "center",
      render: (appraisalTime) =>
        dayjs(appraisalTime).format(DATE_TIME_FORMAT.day),
    },
    {
      key: 4,
      title: "Địa chỉ",
      dataIndex: "address",
      width: 250,
    },
    {
      key: 5,
      title: "Vị trí",
      render: (_, record) => [record.latitude, record.longitude].join(", "),
    },
    {
      key: 6,
      title: "Diện tích khuôn viên (m²)",
      dataIndex: "areaWidth",
      align: "right",
    },
    {
      key: 6,
      title: "Đơn giá (đồng/m²)",
      dataIndex: "landUnitPrice",
      align: "right",
      render: (landUnitPrice) => numberUtils.formatNumber(landUnitPrice),
    },
    {
      key: 6,
      title: "Giá trị tài sản (đồng)",
      dataIndex: "totalValue",
      align: "right",
      render: (totalValue) => numberUtils.formatNumber(totalValue),
    },
  ];

  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Mã tài sản",
      type: INPUT,
      css: css,
      value: filterData.assetCode || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, assetCode: e.target.value }),
    },
    {
      key: 2,
      label: "Địa chỉ",
      type: INPUT,
      css: css,
      value: filterData.address || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, address: e.target.value }),
    },
  ];

  return (
    <div
      style={{
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <Form labelAlign="left" labelWrap size="small">
        <Row gutter={[16, 4]}>
          <InputFields data={inputSearchBasic} />
          <Col
            xs={css.xs}
            sm={css.sm}
            md={css.md}
            lg={css.lg}
            xl={css.xl}
            style={{ justifyContent: "end", display: "flex" }}
          >
            <ButtonCustom
              label="Bỏ lọc"
              onClick={() => {
                setFilterData({ assetCode: "", address: "" });
              }}
            />
          </Col>
        </Row>
      </Form>
      <TableCustom
        columns={columns}
        dataSource={data?.data}
        bordered={true}
        isLoading={!data && isLoading}
        limit={10}
        total={data ? data.total : 0}
        onLimitChange={(limit) => {
          //setParams({ ...params, limit });
        }}
        onPageChange={(page) => {
          //setParams({ ...params, page });
        }}
        page={1}
      />
    </div>
  );
};

export default CompareAssetModalTable;
