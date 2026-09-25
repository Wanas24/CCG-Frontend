import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas";

export const useForgotPasswordForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
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
