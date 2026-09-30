import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas";
import type { TResetPasswordParams } from "../types";
import { useResetPassword } from "../api/hooks/useResetPassword";

export const useResetPasswordForm = ({
  email,
  token,
}: TResetPasswordParams) => {
  const {
    mutate: resetPasswordMutate,
    isPending,
    isSuccess,
    data,
    reset,
  } = useResetPassword();

  const { control, handleSubmit, setError } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    reset();
    resetPasswordMutate(
      {
        email,
        token,
        newPassword: values.password,
      },
      {
        onSuccess: (response) => {
          if (!response.isSuccess) {
            applyApiFieldErrors(setError, response.data);
          }
        },
        onError: (error) => {
          const result = getSimpleResultFromAxiosError(error);
          applyApiFieldErrors(setError, result?.data);
        },
      },
    );
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isPending,
    isSuccess: isSuccess && Boolean(data?.isSuccess),
    successMessage: data?.message,
  };
};
