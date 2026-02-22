import { useState, useEffect, useCallback } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseFetchActions {
  refetch: () => Promise<void>;
  reset: () => void;
}

export function useFetch<T>(
  url: string | null,
  fetchFn: (url: string) => Promise<T>
): UseFetchState<T> & UseFetchActions {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!url) return;

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const result = await fetchFn(url);
      setState({
        data: result,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as Error,
      });
    }
  }, [url, fetchFn]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (!url) return;
    refetch();
  }, [url, refetch]);

  return {
    ...state,
    refetch,
    reset,
  };
}
