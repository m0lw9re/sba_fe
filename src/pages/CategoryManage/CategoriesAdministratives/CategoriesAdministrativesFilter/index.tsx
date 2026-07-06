import { Button, Card, Col, Form, Row, Space, Typography } from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import InputFields from "components/InputFields";
import { RootState } from "configs/configureStore";
import { TYPE_FIELD } from "constant/enums";
import { FilterAppraisalFileType } from "constant/types";
import { InputFiledParams } from "constants/types/Form_Field_type";
import "pages/AppraisalFiles/subcomponent/AppraisalFilesFilter/style.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  filters: FilterAppraisalFileType;
  setFilters: (filters: FilterAppraisalFileType) => void;
};

const { INPUT, SELECT } = TYPE_FIELD;

const CategoriesAdministrativesFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const [collapse, setCollapse] = useState<number>(1);
  const [filterData, setFilterData] = useState<FilterAppraisalFileType>({});
  const { provinceOptions } = useSelector((state: RootState) => state.globalSlice)

  useEffect(() => {
    if (filters) {
      setFilterData({ ...filterData, ...filters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCollapse = (value: number) => {
    setCollapse(value);
  };

  const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 };
  const inputSearchBasic: InputFiledParams[] = [
    {
      key: 1,
      label: "Tìm kiếm",
      type: INPUT,
      css: css,
      value: filterData.customerName || null,
      onChange: (e: any) =>
        setFilterData({ ...filterData, customerName: e.target.value }),
    },

    {
      key: 2,
      label: "Tỉnh/Thành phố",
      type: SELECT,
      options: provinceOptions,
      css: css,
      showSearch: true,
      value: filterData.province || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, province: value }),
    },
    {
      key: 3,
      label: "Quận/Huyện/Thị xã",
      type: SELECT,
      options: provinceOptions,
      css: css,
      showSearch: true,
      value: filterData.district || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, district: value }),
    },
    {
      key: 4,
      label: "Xã/Phường/Thị trấn",
      type: SELECT,
      options: provinceOptions,
      css: css,
      showSearch: true,
      value: filterData.ward || null,
      onChange: (value: string) =>
        setFilterData({ ...filterData, ward: value }),
    },
    // {
    //   key: 5,
    //   label: "Tuyến đường",
    //   type: SELECT,
    //   options: addressData.wards,
    //   css: css,
    //   showSearch: true,
    //   value: filterData.ward || null,
    //   onChange: (value: string) =>
    //     setFilterData({ ...filterData, ward: value }),
    // },
  ];

  const searchText = () => {
    switch (collapse) {
      case 0:
        return (
          <Button type="text" size="small" onClick={() => handleCollapse(1)}>
            <Space>
              <Typography className="blue-text">Hiển thị tìm kiếm</Typography>
              <Typography className="blue-text">
                <Icons.down />
              </Typography>
            </Space>
          </Button>
        );
      case 1:
        return (
          <Button type="text" size="small" onClick={() => handleCollapse(0)}>
            <Space>
              <Typography className="blue-text">Ẩn tất cả tìm kiếm</Typography>
              <Typography className="blue-text">
                <Icons.up />
              </Typography>
            </Space>
          </Button>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="appraisal-files-filter-container">
      <Card size="small" className="card-container">
        <Row justify={"space-between"} style={{ marginBottom: "4px" }}>
          <CardTitleCustomUpdate title="Tìm kiếm" />
          <div
            style={{ height: "22px", display: "flex", alignItems: "center" }}
          >
            {searchText()}
          </div>
        </Row>
        {collapse ? (
          <>
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
                  <Space>
                    <ButtonCustom
                      label="Xóa"
                      onClick={() => {
                        setFilters({});
                        setFilterData({});
                      }}
                    />
                    <ButtonCustom
                      label="Tìm kiếm"
                      bgColor="#2862AF"
                      type="primary"
                      onClick={() => setFilters({ ...filterData })}
                    />
                  </Space>
                </Col>
              </Row>
            </Form>
          </>
        ) : null}
      </Card>
    </div>
  );
};

export default CategoriesAdministrativesFilter;
