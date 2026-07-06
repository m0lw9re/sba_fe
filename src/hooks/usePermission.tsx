import { RootState } from "configs/configureStore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const usePermission = (code: string | null) => {
  const [isNotAllowed, setIsAllowed] = useState(false);
  const { currentPagePermissions } = useSelector(
    (state: RootState) => state.globalSlice
  );

  useEffect(() => {
    if (code && currentPagePermissions) {
      let checkIsNotAllowed = false;
      const foundIndex = currentPagePermissions?.findIndex(
        (item) => item.code === code && item.value
      );
      if (foundIndex !== -1) checkIsNotAllowed = true;
      setIsAllowed(checkIsNotAllowed);
    }
  }, [code, currentPagePermissions]);

  return isNotAllowed;
};
