import { useReducer, useCallback } from "react";
import { AppError } from "@/app/shared-kernel/domain/errors/AppError";

interface State<T> {
  status: "idle" | "loading" | "success" | "error";
  data: T | null;
  error: AppError | null;
}

type Action<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_FAILURE"; payload: AppError };

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading", data: null, error: null };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload, error: null };
    case "FETCH_FAILURE":
      return { status: "error", data: null, error: action.payload };
    default:
      return state;
  }
};

/**
 * Универсальный хук для управления асинхронными операциями (use-кейсами).
 * @param asyncFunction - Use-кейс или любая другая асинхронная функция.
 */
export const useAsync = <T, P extends unknown[]>(
  asyncFunction: (...args: P) => Promise<T>
) => {
  const initialState: State<T> = {
    status: "idle",
    data: null,
    error: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const execute = useCallback(
    async (...args: P) => {
      dispatch({ type: "FETCH_START" });
      try {
        const result = await asyncFunction(...args);

        dispatch({ type: "FETCH_SUCCESS", payload: result });

        return { success: true, data: result };
      } catch (error: unknown) {
        const appError =
          error instanceof AppError
            ? error
            : new AppError((error as Error).message);

        dispatch({ type: "FETCH_FAILURE", payload: appError });

        return { success: false, error: appError };
      }
    },
    [asyncFunction]
  );

  return { execute, ...state };
};
