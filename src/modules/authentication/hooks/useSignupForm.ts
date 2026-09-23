import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "../schemas";

export const useSignupForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (_values: SignupFormValues) => {
    // Authentication API integration is out of ST-01 scope.
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
};
