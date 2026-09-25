import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../api/hooks/useLogin";
import { establishSession } from "./establishSession";

export const useLoginManager = () => {
  const navigate = useNavigate();
  const { mutate: loginMutate, isPending } = useLogin();

  const { control, handleSubmit, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (payload: LoginFormValues) => {
    loginMutate(payload, {
      onSuccess: (response) => {
        if (!response.isSuccess) {
          applyApiFieldErrors(setError, response.data);
          return;
        }

        const { data } = response;
        if (!data?.token || !data.isAuthenticated) return;

        establishSession(data);
        navigate(APP_ROUTES.home, { replace: true });
      },
      onError: (error) => {
        const result = getSimpleResultFromAxiosError(error);
        applyApiFieldErrors(setError, result?.data);
      },
    });
  };

  return {
    control,
    isPending,
    handleSubmit,
    onSubmit,
  };
};
