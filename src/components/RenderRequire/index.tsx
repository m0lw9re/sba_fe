import "./styles.scss";

const renderRequired = (label: string) => {
  return (
    <>
      {label}
      <span style={{ color: "#F25B60" }}> *</span>
    </>
  );
};

export default renderRequired;
