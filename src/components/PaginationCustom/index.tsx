import React from "react";
import { Pagination, PaginationProps } from "antd";
import "components/PaginationCustom/style.scss";

type Props = {
  page: number;
  pageSize: number;
  total: number;
};

const PaginationCustom: React.FC<Props & PaginationProps> = ({
  page,
  pageSize,
  total,
  ...rest
}) => {
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.stopPropagation();
        }
      }}
    >
      <Pagination
        className="pagination-custom"
        {...rest}
        defaultCurrent={page}
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger={false}
        showQuickJumper={total > 200}
        locale={{
          jump_to: "Đến trang",
          jump_to_confirm: "Xác nhận",
          items_per_page: "bản ghi/trang",
          next_3: "3 trang tiếp",
          next_5: "5 trang tiếp",
          next_page: "Trang tiếp",
          page: "",
          prev_3: "3 trang trước",
          prev_5: "5 trang trước",
          prev_page: "Trang trước",
        }}
      />
    </div>
  );
};

export default PaginationCustom;
