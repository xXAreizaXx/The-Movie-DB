import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer: ReturnType<typeof globalThis.setTimeout> = globalThis.setTimeout(
      () => setDebouncedValue(value),
      delay,
    );
    return () => globalThis.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
