import { useState, useCallback, useEffect } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

interface UseApiResponse<T, P extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: P) => Promise<void>;
}

export function useApi<T, P extends unknown[] = []>(
  apiFunction: (...args: P) => Promise<AxiosResponse<T>>,
  immediate = false,
  initialArgs?: P
): UseApiResponse<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: P) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute(...(initialArgs || [] as unknown as P));
    }
  }, [immediate, execute]);

  return { data, loading, error, execute };
}

export default useApi; 