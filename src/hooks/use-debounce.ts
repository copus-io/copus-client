import { useState, useEffect } from 'react';

/** 防抖value */
const useDebounce = (value: string, interval = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, interval);

    return () => {
      clearTimeout(timer);
    };
  }, [value, interval]);

  return debouncedValue;
};
export default useDebounce;
