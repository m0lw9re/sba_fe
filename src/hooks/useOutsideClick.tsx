import React from "react";

const useOutsideClick = (callback: any, isStopPropagation: boolean = false) => {
  const ref: any = React.useRef();

  React.useEffect(() => {
    const handleClick = (event: any) => {
      if (isStopPropagation) event.stopPropagation();
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref, callback]);

  return ref;
};

export default useOutsideClick;
