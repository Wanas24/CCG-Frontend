import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas";
import type { ResetPasswordParams } from "../types/auth";

export const useResetPasswordForm = ({
  userId,
  token,
}: ResetPasswordParams) => {
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

  const onSubmit = (_values: ResetPasswordFormValues) => {
    void userId;
    void token;
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
};
