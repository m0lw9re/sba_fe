import { Popconfirm, Row, Typography } from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import "components/CardTitleCustomUpdate/style.scss";
import React, { useEffect, useState } from "react";
import { getRoleAccount } from "utils/common";

type Props = {
  title: string;
  color?: string;
  disabled?: boolean;
  disabledSave?: boolean;
  isSaveLoading?: boolean;
  addButtonCode?: string;
  saveButtonCode?: string;
  approvedButtonCode?: string;
  addFunction?: () => void;
  saveFunction?: () => void;
  approvedFunction?: () => void;
};

const CardTitleCustomUpdate: React.FC<Props> = ({
  title,
  color,
  addFunction,
  saveFunction,
  disabledSave = false,
  approvedFunction,
  disabled,
  isSaveLoading = false,
  addButtonCode,
  saveButtonCode,
  approvedButtonCode,
}) => {
  const authories: any = getRoleAccount() || [];
  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(() => {
    if (authories.length === 0) {
      setDisableBtn(true);
    }
  }, []);

  return (
    <div className="card-title-container">
      <Row justify={"space-between"} style={{ marginBottom: "4px" }}>
        <Typography.Text className="title" style={{ color: color }}>
          {title}
        </Typography.Text>
        {addFunction ? (
          <ButtonCustom
            disabled={disableBtn}
            type="primary"
            icon={<Icons.add />}
            size="small"
            code={addButtonCode}
            onClick={addFunction}
            label="Thêm mới"
            bgColor={disableBtn ? "#ccc" : "#2862AF"}
          />
        ) : (
          <></>
        )}
        {saveFunction ? (
          <ButtonCustom
            type="primary"
            size="small"
            loading={isSaveLoading}
            onClick={saveFunction}
            disabled={disabledSave}
            code={saveButtonCode}
            label="Lưu"
            bgColor="#2862AF"
          />
        ) : (
          <></>
        )}
        {approvedFunction && (
          <Popconfirm
            className="danger-confirm"
            title="Bạn muốn chắc chắn muốn duyệt tất cả tài sản đã chọn?"
            onConfirm={() => {
              approvedFunction();
            }}
            okText={"Duyệt"}
            cancelText={"Huỷ"}
          >
            <ButtonCustom
              disabled={disabled ? disabled : false}
              code={approvedButtonCode}
              type="primary"
              size="small"
              label="Duyệt tất cả"
              bgColor="#2862AF"
            />
          </Popconfirm>
        )}
      </Row>
    </div>
  );
};

export default CardTitleCustomUpdate;
