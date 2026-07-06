import {Table} from "antd";

import {Rule} from "antd/es/form";

export type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

type EditableTableProps = Parameters<typeof Table>[0];

export type ColumnsEdit = (ColumnTypes[number] & {
  editable?: boolean;
  dataIndex?: string[] | string;
  selected?: boolean;
  options?: {value: string | number; label: string}[];
  suffix?: React.ReactNode;
  show?: boolean;
  type?: string | number;
  name?: string | number;
  onChange?: Function;
  disabled?: boolean;
  addonAfter?: any;
  onFocus?: () => void;
  rules?: Rule[];
  max?: number;
  hidden?: boolean;
  autoFocus?: boolean;
  onSearch?: (text: string) => void;
  onSelect?: (text: string) => void;
  [x: string]: any;
})[];
