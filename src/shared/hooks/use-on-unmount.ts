import { useEffect, useRef } from "react";

export const useOnUnmount = (cb: () => void) => {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  useEffect(() => {
    return () => cbRef.current();
  }, []);
};
