import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { signupSchema, type SignupFormValues } from "../schemas";
import { useRegister } from "../api/hooks/useRegister";

export const useSignupForm = () => {
  const navigate = useNavigate();
  const {
    mutate: registerMutate,
    isPending,
    isError,
    error: registerError,
  } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      fullAddress: "",
      extraPhone: "",
      nationalId: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    registerMutate(values, {
      onSuccess: () => {
        navigate(AUTH_ROUTES.login);
      },
    });
  };

  return {
    control,
    isPending,
    isError,
    registerError,
    handleSubmit,
    errors,
    onSubmit,
  };
};
