import { Card, Row, Form, Col } from "antd";
import { FC } from "react";
import { TYPE_FIELD } from "constant/enums";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { InputFiledParams } from "constants/types/Form_Field_type";
import InputFields from "components/InputFields";
import "./style.scss";

type Props = {
  filter: any;
  setFilter: (filter: any) => void;
};

const { INPUT } = TYPE_FIELD;

const css = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 };

const RoadVehicleFilter: FC<Props> = ({ filter, setFilter }) => {
  const inputSearch: InputFiledParams[] = [
    {
      key: 1,
      name: "searchKey",
      label: "Tìm kiếm",
      css: css,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      type: INPUT,
      onKeyPress: (e: any) => {
        if (e.key === "Enter") {
          setFilter({ ...filter, searchKey: e.target.value });
        }
      },
    },
  ];

  return (
    <div className="category-legal-filter-container">
      <Card size="small" className="card-container">
        <Row justify={"space-between"} style={{ marginBottom: "4px" }}>
          <CardTitleCustomUpdate title="Tìm kiếm" />
        </Row>
        <div style={{ marginTop: "4px" }}>
          <Form labelAlign="left" labelWrap size="small">
            <Row gutter={[16, 4]}>
              <InputFields data={inputSearch} />
              <Col
                xs={css.xs}
                sm={css.sm}
                md={css.md}
                lg={css.lg}
                xl={css.xl}
                style={{ justifyContent: "end", display: "flex" }}
              ></Col>
            </Row>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default RoadVehicleFilter;
