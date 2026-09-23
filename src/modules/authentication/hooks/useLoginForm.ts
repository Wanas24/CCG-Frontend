import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { loginSchema, type LoginFormValues } from "../schemas";

export const useLoginForm = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@admin.com",
      password: "admin@123",
      rememberMe: false,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    if (
      values.email === "admin@admin.com" &&
      values.password === "admin@123"
    ) {
      localStorage.setItem("ALHARMEEN_TOKEN", "admin");
      navigate(APP_ROUTES.home);
    } else {
      localStorage.removeItem("ALHARMEEN_TOKEN");
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
};
