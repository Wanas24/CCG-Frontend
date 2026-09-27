import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { authService } from "../services/authentication.service";
import type { TConfirmationStatusResponse } from "../../types";

export const confirmationStatusQueryKey = [
  "auth",
  "confirmation-status",
] as const;

/** Poll interval while the user is waiting on the verify-account page. */
export const CONFIRMATION_STATUS_POLL_INTERVAL_MS = 20_000;

type UseConfirmationStatusOptions = {
  enabled?: boolean;
  /** Pass a number (ms) to poll; `false` disables polling. */
  refetchInterval?: number | false;
};

/** Imperative one-shot fetch (e.g. after confirming email). */
export const fetchConfirmationStatus = () =>
  queryClient.fetchQuery({
    queryKey: confirmationStatusQueryKey,
    queryFn: authService.getConfirmationStatus,
  });

export const useConfirmationStatus = ({
  enabled = true,
  refetchInterval = false,
}: UseConfirmationStatusOptions = {}) => {
  return useQuery<TConfirmationStatusResponse>({
    queryKey: confirmationStatusQueryKey,
    queryFn: authService.getConfirmationStatus,
    enabled,
    staleTime: 0,
    refetchInterval: enabled ? refetchInterval : false,
    // Pause polling in background tabs; resume when the user returns
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
};
