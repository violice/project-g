import { useEffect, useRef } from "react";

export const useOnMount = (cb: () => void) => {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  useEffect(() => {
    cbRef.current();
  }, []);
};
