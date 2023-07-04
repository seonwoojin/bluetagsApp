import axios, { AxiosError } from "axios";
import { useState } from "react";

interface UseMutationState<T, U> {
  loading: boolean;
  data?: T;
  error?: U;
  status?: number;
}

export type useMutationResult<T, U> = [
  (data: any) => void,
  UseMutationState<T, U>
];

export default function useMutation<T = any, U = any>(
  url: string
): useMutationResult<T, U> {
  const [state, setState] = useState<UseMutationState<T, U>>({
    loading: false,
    data: undefined,
    error: undefined,
    status: undefined,
  });
  async function mutation(body: any) {
    try {
      const response = await axios.post<T>(url, body);
      const data = response.data;
      const status = response.status;
      setState((prev) => ({ ...prev, data }));
      setState((prev) => ({ ...prev, status }));
    } catch (e: any) {
      const error = e.response.data.error;
      console.log(e.response.data.error);
      const status = e.response.status;
      setState((prev) => ({ ...prev, error }));
      setState((prev) => ({ ...prev, status }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }
  return [mutation, { ...state }];
}
