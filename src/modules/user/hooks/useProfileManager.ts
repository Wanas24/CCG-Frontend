import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { normalizeOptionalPhone } from "@/modules/authentication/schemas";
import { userMeQueryKey } from "../api/hooks/useGetMe";
import { useEditProfile } from "../api/hooks/useEditProfile";
import {
  editProfileSchema,
  type EditProfileFormValues,
} from "../schemas";
import type { TUserInfo } from "../types";
import { toProfileApiDate, toProfileFormDate } from "../utils/profileDate";
import { mapUserInfoToSessionUser } from "../utils/mapUserInfoToSessionUser";

const toFormValues = (profile: TUserInfo): EditProfileFormValues => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  extraPhone: profile.extraPhone ?? "",
  nationalId: profile.nationalId,
  dateOfBirth: toProfileFormDate(profile.dateOfBirth),
  fullAddress: profile.fullAddress,
});

export const useProfileManager = (profile: TUserInfo) => {
  const { t } = useTranslation();
  const { mutate: editProfileMutate, isPending } = useEditProfile();

  const { control, handleSubmit, setError, reset } =
    useForm<EditProfileFormValues>({
      resolver: zodResolver(editProfileSchema),
      defaultValues: toFormValues(profile),
    });

  useEffect(() => {
    reset(toFormValues(profile));
  }, [profile, reset]);

  const onSubmit = (values: EditProfileFormValues) => {
    editProfileMutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        extraPhone: normalizeOptionalPhone(values.extraPhone),
        nationalId: values.nationalId,
        dateOfBirth: toProfileApiDate(values.dateOfBirth),
        fullAddress: values.fullAddress,
        phoneNumber: profile.phoneNumber,
        language: profile.language,
        theme: profile.theme,
      },
      {
        onSuccess: (response) => {
          if (!response.isSuccess) {
            applyApiFieldErrors(setError, response.data);
            return;
          }

          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            useAuthStore.getState().setUser(
              mapUserInfoToSessionUser(
                {
                  ...profile,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  extraPhone: normalizeOptionalPhone(values.extraPhone),
                  nationalId: values.nationalId,
                  dateOfBirth: toProfileApiDate(values.dateOfBirth),
                  fullAddress: values.fullAddress,
                },
                currentUser,
              ),
            );
          }

          toast.success(response.message || t("user.profile.saveSuccess"));
          void queryClient.invalidateQueries({ queryKey: userMeQueryKey });
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
