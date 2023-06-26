import { ChangeEvent, useCallback, useState } from "react";

type UseInputReturnType = [
  number | null,
  (e: number) => void
];

// string이나 null중 하나를 내보냄
export default (initialValue: number | null = null): UseInputReturnType => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e: number) => {
    setValue(e);
  }, []);
  console.log(value);
  return [value, handler];
};
