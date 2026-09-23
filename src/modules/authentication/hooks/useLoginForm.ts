// hooks/useLoginForm.ts

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { createLoginSchema, type LoginFormValues } from "../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";

export const useLoginForm = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const schema = createLoginSchema(t);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
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
            localStorage.setItem("CCG_TOKEN", "admin");
            navigate(APP_ROUTES.home);
        } else {
            localStorage.removeItem("CCG_TOKEN");
        }
    };

    return {
        control,
        handleSubmit,
        errors,
        onSubmit,
    };
};