import { useEffect, useRef } from "react";

const useUpdatedRef = <T>(value: T) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};

export default useUpdatedRef;
