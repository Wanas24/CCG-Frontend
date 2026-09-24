import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../api/hooks/useLogin";

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
      email: "mohamed.ashraf@construct-code.com",
      password: "Test@123",
      rememberMe: false,
    },
  });

  const onSubmit = (payload: LoginFormValues) => {
    loginMutate(payload, {
      onSuccess: () => {
        navigate(APP_ROUTES.home);
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
