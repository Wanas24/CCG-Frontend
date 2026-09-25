import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    isError,
    isSuccess,
    error: resetPasswordError,
    data,
    reset,
  } = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    reset();
    resetPasswordMutate({
      email,
      token,
      newPassword: values.password,
    });
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
    isError,
    isSuccess: isSuccess && Boolean(data?.isSuccess),
    resetPasswordError,
    successMessage: data?.message,
  };
};
