import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSignupSchema, type SignupFormValues } from "../schemas";

export const useSignupForm = () => {
  const { t } = useTranslation();

  const schema = createSignupSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
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
