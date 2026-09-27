import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { ErrorCode } from "@/lib/api/errorCodes";
import { useChangePhone } from "../api/hooks/useChangePhone";
import {
  changePhoneSchema,
  type ChangePhoneFormValues,
} from "../schemas";
import { navigateToPhoneVerification } from "../utils/startPhoneVerification";

const isVerificationRequired = (errorCode?: number | null) =>
  Number(errorCode) === ErrorCode.AccountVerificationRequired;

export const useChangePhoneManager = (currentPhoneNumber: string) => {
  const { mutate: changePhoneMutate, isPending } = useChangePhone();

  const { control, handleSubmit, setError, reset, formState } =
    useForm<ChangePhoneFormValues>({
      resolver: zodResolver(changePhoneSchema),
      mode: "onChange",
      defaultValues: {
        phoneNumber: currentPhoneNumber,
      },
    });

  const phoneNumber = useWatch({ control, name: "phoneNumber" });

  useEffect(() => {
    reset({ phoneNumber: currentPhoneNumber });
  }, [currentPhoneNumber, reset]);

  const hasPhoneChanged = phoneNumber !== currentPhoneNumber;
  const canSubmit = hasPhoneChanged && formState.isValid && !isPending;

  const onSubmit = (values: ChangePhoneFormValues) => {
    if (values.phoneNumber === currentPhoneNumber) {
      return;
    }

    changePhoneMutate(
      { phoneNumber: values.phoneNumber },
      {
        onSuccess: (response) => {
          if (isVerificationRequired(response.errorCode) || response.isSuccess) {
            navigateToPhoneVerification();
            return;
          }

          applyApiFieldErrors(setError, response.data);
        },
        onError: (error) => {
          const result = getSimpleResultFromAxiosError(error);

          if (isVerificationRequired(result?.errorCode)) {
            navigateToPhoneVerification();
            return;
          }

          applyApiFieldErrors(setError, result?.data);
        },
      },
    );
  };

  return {
    control,
    isPending,
    canSubmit,
    handleSubmit,
    onSubmit,
  };
};
