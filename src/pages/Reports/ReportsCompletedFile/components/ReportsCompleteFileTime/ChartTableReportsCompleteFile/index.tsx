import React from "react";
import ColumnChart from "./chart";
import { Card } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import "./style.scss";
import { randomId } from "utils";

type Props = {
  data: Array<any>;
};

const TableReportCompletedFile: React.FC<Props> = ({ data }) => {
  const dataSource: Array<any> = data
    .map((item: any) => {
      return {
        key: randomId(),
        index: item?.month,
        name: `Tháng ${item?.month}`,
        month: item?.month,
        year: item?.year,
        "Hồ sơ tồn đầu kỳ": item?.delayAtBegin,
        "Hồ sơ hoàn thành đúng tiến độ": item?.income,
        "Hồ sơ hoàn thành không đúng tiến độ": item?.outcome,
        "Hồ sơ tồn cuối kỳ": item?.delayAtEnd,
        "Hồ sơ nhận trong kỳ": item?.receive,
        "Hồ sơ huỷ trong kỳ": item?.reject,
      };
    })
    .sort((a, b) => {
      if (a?.year !== b?.year) {
        return a.year - b.year;
      }
      else return a?.month - b?.month
    });

  return (
    <Card className="card-container" size="small">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <CardTitleCustomUpdate title="Biểu đồ" />
      </div>
      <ColumnChart data={dataSource} />
    </Card>
  );
};

export default TableReportCompletedFile;
