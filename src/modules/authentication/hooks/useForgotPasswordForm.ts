import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas";
import { useForgotPassword } from "../api/hooks/useForgotPassword";

export const useForgotPasswordForm = () => {
  const {
    mutate: forgotPasswordMutate,
    isPending,
    isError,
    isSuccess,
    error: forgotPasswordError,
    data,
    reset,
  } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (payload: ForgotPasswordFormValues) => {
    reset();
    forgotPasswordMutate(payload);
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
    isError,
    isSuccess: isSuccess && Boolean(data?.isSuccess),
    forgotPasswordError,
    successMessage: data?.message,
  };
};
