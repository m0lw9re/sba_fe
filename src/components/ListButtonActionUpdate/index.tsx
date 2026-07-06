import { EyeOutlined, RetweetOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import Icons from "assets/icons";
import { BlueEyeSVG, EditSVG, GreenEyeSVG, TrashRedSVG } from "assets/images";
import { RootState } from "configs/configureStore";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isNotAllowed } from "utils/permission";
import "./style.scss";

type Props = {
  editFunction?: any;
  substractFunction?: any;
  removeFunction?: any;
  downloadFunction?: any;
  viewFunction?: any;
  viewBlueFunction?: any;
  viewGreenFunction?: any;
  disable?: any;
  downloading?: boolean;
  downloadTooltip?: string;
  removePopupPlacement?: TooltipPlacement;
  reviseFunction?: any;
  isLockRePricing?: boolean; // sử dụng cho hồ sơ tái định giá - không cho sửa những bản ghi của hồ sơ cũ
  removeButtonCode?: string;
  editButtonCode?: string;
};

const ListButtonActionUpdate: React.FC<Props> = ({
  substractFunction,
  downloadFunction,
  editFunction,
  removeFunction,
  viewFunction,
  viewBlueFunction,
  viewGreenFunction,
  downloading,
  disable = false,
  downloadTooltip,
  removePopupPlacement = "top",
  reviseFunction,
  isLockRePricing = false,
  removeButtonCode,
  editButtonCode,
}) => {
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  const [openPopconfirm, setOpenPopconfirm] = useState({
    confirmSubtract: false,
    confirmRemove: false,
  });

  return (
    <Space size={"small"}>
      {removeFunction ? (
        <Popconfirm
          className="danger-confirm"
          title="Bạn muốn xóa?"
          placement={removePopupPlacement}
          onConfirm={() => {
            removeFunction();
            setOpenPopconfirm({ ...openPopconfirm, confirmRemove: false });
          }}
          disabled={
            disable ||
            isLockRePricing ||
            (removeButtonCode
              ? isNotAllowed(currentPagePermissions, removeButtonCode!)
              : false)
          }
        >
          <Button
            icon={<TrashRedSVG />}
            danger
            size="small"
            onClick={() =>
              setOpenPopconfirm({ ...openPopconfirm, confirmRemove: true })
            }
            type="text"
            disabled={
              disable ||
              isLockRePricing ||
              (removeButtonCode
                ? isNotAllowed(currentPagePermissions, removeButtonCode!)
                : false)
            }
            className="disabled-delete"
          />
        </Popconfirm>
      ) : null}
      {editFunction ? (
        <Tooltip title="Chỉnh sửa">
          <Button
            icon={<EditSVG />}
            size="small"
            onClick={editFunction}
            type="text"
            disabled={
              disable ||
              isLockRePricing ||
              (editButtonCode
                ? isNotAllowed(currentPagePermissions, editButtonCode)
                : false)
            }
            className="disabled"
          />
        </Tooltip>
      ) : null}
      {downloadFunction ? (
        <Tooltip title={downloadTooltip}>
          <Button
            icon={<Icons.download />}
            onClick={downloadFunction}
            loading={downloading ?? false}
            type="text"
            size="small"
            disabled={disable}
          />
        </Tooltip>
      ) : null}
      {substractFunction ? (
        <Popconfirm
          className="danger-confirm"
          title="Bạn muốn xóa?"
          placement={removePopupPlacement}
          onConfirm={() => {
            substractFunction();
            setOpenPopconfirm({ ...openPopconfirm, confirmSubtract: false });
          }}
          disabled={isLockRePricing}
        >
          <Button
            icon={<Icons.sub />}
            danger
            size="small"
            onClick={() =>
              setOpenPopconfirm({ ...openPopconfirm, confirmSubtract: true })
            }
            type="primary"
            disabled={isLockRePricing}
          />
        </Popconfirm>
      ) : null}
      {viewFunction ? (
        <Button
          type="text"
          size="small"
          onClick={viewFunction}
          icon={<EyeOutlined />}
        />
      ) : null}
      {viewBlueFunction ? (
        <Button
          type="text"
          size="small"
          onClick={viewBlueFunction}
          icon={<BlueEyeSVG />}
        />
      ) : null}
      {viewGreenFunction ? (
        <Button
          type="text"
          size="small"
          onClick={viewGreenFunction}
          icon={<GreenEyeSVG />}
        />
      ) : null}
      {reviseFunction ? (
        <Tooltip title="Gửi duyệt lại">
          <Button
            type="text"
            size="small"
            onClick={reviseFunction}
            icon={<RetweetOutlined />}
          />
        </Tooltip>
      ) : null}
    </Space>
  );
};

export default ListButtonActionUpdate;
