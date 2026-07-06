import {useAppSelector} from "configs/hooks";
const Logs = () => {
  const assetInfo = useAppSelector(state => state.fastExpertiseSlice.assetInfo);
  return (
    <div>
      {assetInfo?.logs?.map((e: any) => (
        <div style={{fontWeight: `${e?.includes("Tiêu chí") ? "bold" : ""}`}}>
          {e}
        </div>
      ))}
    </div>
  );
};
export default Logs;
