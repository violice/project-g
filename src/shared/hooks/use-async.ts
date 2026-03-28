import { useReducer } from "react";
import { safeAsync } from "../utils";
import { useOnMount } from "./use-on-mount";

type AsyncState<T> = {
  loading: boolean;
  data: T | null;
  error: unknown;
};

enum AsyncActionType {
  Loading = "loading",
  Success = "success",
  Error = "error",
}

type AsyncAction<T> = {
  type: AsyncActionType;
  data?: T | null;
  error?: unknown;
};

const reducer = <T>(state: AsyncState<T>, action: AsyncAction<T>) => {
  switch (action.type) {
    case AsyncActionType.Loading:
      return {
        loading: true,
        data: null,
        error: null,
      };
    case AsyncActionType.Success:
      return {
        loading: false,
        data: action.data ?? null,
        error: null,
      };
    case AsyncActionType.Error:
      return {
        loading: false,
        data: null,
        error: action.error ?? null,
      };
    default:
      return state;
  }
};

type UseAsyncOptions<T, P> = {
  fn: (params: P | undefined) => Promise<T>;
  runOnMount?: boolean;
  initialData?: T | null;
  initialError?: unknown;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
};

export const useAsync = <T, P>({
  fn,
  runOnMount,
  initialData,
  initialError,
  onSuccess,
  onError,
}: UseAsyncOptions<T, P>) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: initialData ?? null,
    error: initialError ?? null,
  } as AsyncState<T>);

  const run = async (params?: P) => {
    dispatch({ type: AsyncActionType.Loading });
    const result = await safeAsync<T>(fn(params));
    if (result.ok) {
      dispatch({ type: AsyncActionType.Success, data: result.data });
      if (onSuccess) {
        onSuccess(result.data);
      }
    } else {
      dispatch({ type: AsyncActionType.Error, error: result.error });
      if (onError) {
        onError(result.error);
      }
    }
    return result;
  };

  useOnMount(() => {
    if (runOnMount) {
      run();
    }
  });

  return { run, ...state };
};
