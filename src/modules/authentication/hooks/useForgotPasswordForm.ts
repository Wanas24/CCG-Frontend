import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas";

export const useForgotPasswordForm = () => {
  const { t } = useTranslation();

  const schema = createForgotPasswordSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = (_values: ForgotPasswordFormValues) => {
    // Authentication API integration is out of ST-01 scope.
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
};
