import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
});

export const useNSEData = (endpoint: string, refreshInterval: number = 5000) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/nse/${endpoint}`,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  return {
    data,
    error,
    isLoading,
    refetch: mutate,
  };
};
