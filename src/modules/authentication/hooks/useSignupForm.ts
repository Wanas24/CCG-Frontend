import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import {
  normalizeOptionalPhone,
  signupSchema,
  type SignupFormValues,
} from "../schemas";
import { useRegister } from "../api/hooks/useRegister";
import { establishSession } from "./establishSession";

export const useSignupForm = () => {
  const navigate = useNavigate();
  const { mutate: registerMutate, isPending } = useRegister();

  const { control, handleSubmit, setError } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "all",
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
    registerMutate(
      {
        ...values,
        extraPhone: normalizeOptionalPhone(values.extraPhone),
      },
      {
        onSuccess: async (response) => {
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
      },
    );
  };

  return {
    control,
    isPending,
    handleSubmit,
    onSubmit,
  };
};
