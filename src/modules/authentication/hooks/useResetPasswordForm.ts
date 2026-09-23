import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas";
import type { ResetPasswordParams } from "../types/auth";

export const useResetPasswordForm = ({ userId, token }: ResetPasswordParams) => {
  const { t } = useTranslation();

  const schema = createResetPasswordSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (_values: ResetPasswordFormValues) => {
    // userId + token are available for the future API call.
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
