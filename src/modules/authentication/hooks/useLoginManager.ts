import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../api/hooks/useLogin";
import { establishSession } from "./establishSession";

export const useLoginManager = () => {
  const navigate = useNavigate();
  const {
    mutate: loginMutate,
    isPending,
    isError,
    error: loginError,
  } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (payload: LoginFormValues) => {
    loginMutate(payload, {
      onSuccess: async (response) => {
        const { data } = response;

        if (!response.isSuccess || !data?.token || !data.isAuthenticated) {
          return;
        }

        const { isVerified } = await establishSession(data);

        navigate(isVerified ? APP_ROUTES.home : AUTH_ROUTES.verifyAccount, {
          replace: true,
        });
      },
    });
  };

  return {
    control,
    isPending,
    isError,
    loginError,
    handleSubmit,
    errors,
    onSubmit,
  };
};
