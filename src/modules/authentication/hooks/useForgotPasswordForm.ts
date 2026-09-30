import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas";
import { useForgotPassword } from "../api/hooks/useForgotPassword";

export const useForgotPasswordForm = () => {
  const {
    mutate: forgotPasswordMutate,
    isPending,
    isSuccess,
    data,
    reset,
  } = useForgotPassword();

  const { control, handleSubmit, setError } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (payload: ForgotPasswordFormValues) => {
    reset();
    forgotPasswordMutate(payload, {
      onSuccess: (response) => {
        if (!response.isSuccess) {
          applyApiFieldErrors(setError, response.data);
        }
      },
      onError: (error) => {
        const result = getSimpleResultFromAxiosError(error);
        applyApiFieldErrors(setError, result?.data);
      },
    });
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
