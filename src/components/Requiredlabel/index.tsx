import { FC, Fragment, ReactNode } from "react";

type Props = {
  label: ReactNode | string | number;
  required?: boolean;
};
export const RequireLabel: FC<Props> = ({ label, required = true }) => {
  return (
    <Fragment>
      <span style={{ opacity: "0.7" }}>{label}</span>
      {required && <span style={{ color: "#F25B60" }}> *</span>}
    </Fragment>
  );
};
