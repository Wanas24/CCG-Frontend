import type { UseFormSetError } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import type { TFunction } from "i18next";
import {
  applyApiFieldErrors,
  applyKnownApiFieldErrors,
  getAxiosErrorPayload,
  getSimpleResultFromAxiosError,
  getValidationProblemErrors,
} from "@/lib/api/applyApiFieldErrors";
import {
  getNetworkErrorMessage,
  getPayloadErrorMessage,
} from "@/lib/api/normalizeApiError";
import {
  CLIENT_FORM_FIELD_NAMES,
  type ClientFormValues,
} from "../schemas/clientFormSchema";

export const notifyClientFormApiError = (
  error: unknown,
  setError: UseFormSetError<ClientFormValues>,
  t: TFunction,
) => {
  const payload = getAxiosErrorPayload(error);
  const validationErrors = getValidationProblemErrors(payload);

  if (validationErrors) {
    const { appliedCount, unmappedMessages } = applyKnownApiFieldErrors(
      setError,
      validationErrors,
      CLIENT_FORM_FIELD_NAMES,
    );

    if (unmappedMessages.length > 0) {
      toast.error(unmappedMessages.join(" "));
      return;
    }

    if (appliedCount === 0) {
      toast.error(
        getPayloadErrorMessage(payload) || t("clients.form.validationError"),
      );
    }
    return;
  }

  const result = getSimpleResultFromAxiosError(error);
  if (result) {
    applyApiFieldErrors(setError, result.data);
    if (result.message) {
      toast.error(result.message);
    }
    return;
  }

  if (axios.isAxiosError(error) && !error.response) {
    toast.error(getNetworkErrorMessage(error.code));
    return;
  }

  toast.error(getPayloadErrorMessage(payload) || t("common.unexpectedError"));
};
