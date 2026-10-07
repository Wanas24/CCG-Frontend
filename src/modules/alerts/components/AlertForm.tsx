import type { BaseSyntheticEvent } from "react";
import {
  Controller,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  AppDatePicker,
  AppDropDownSelect,
  AppTextArea,
} from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import { useGetAlertEmployees } from "../api/hooks/useGetAlertEmployees";
import type { AlertFormValues } from "../schemas/alertFormSchema";
import type { TAlertAudienceMode, TAlertEntityContext } from "../types";
import { getAlertEmployeeLabel } from "../utils/alertAudience";
import { extractAlertEmployees } from "../utils/extractAlertEmployees";

type Props = {
  form: UseFormReturn<AlertFormValues>;
  formId?: string;
  enabled?: boolean;
  entityType?: TAlertEntityContext["entityType"];
  entityId?: TAlertEntityContext["entityId"];
  projectId?: TAlertEntityContext["projectId"];
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const AUDIENCE_OPTIONS: TAlertAudienceMode[] = [
  "managers",
  "everyone",
  "people",
];

const getAudienceHintKey = (audience: TAlertAudienceMode) => {
  if (audience === "everyone") return "alerts.form.audienceEveryoneHint";
  if (audience === "people") return "alerts.form.audiencePeopleHint";
  return "alerts.form.audienceManagersHint";
};

const getAudienceLabelKey = (audience: TAlertAudienceMode) => {
  if (audience === "everyone") return "alerts.audience.everyone";
  if (audience === "people") return "alerts.audience.selectedPeople";
  return "alerts.audience.managers";
};

const AlertForm = ({
  form,
  formId = "alert-form",
  enabled = true,
  onSubmit,
  entityType: _entityType,
  entityId: _entityId,
  projectId: _projectId,
}: Props) => {
  void _entityType;
  void _entityId;
  void _projectId;

  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const audience =
    useWatch({ control: form.control, name: "audience" }) ?? "managers";
  const showPeoplePicker = audience === "people";

  const employeesQuery = useGetAlertEmployees(
    { page: 1, pageSize: 100, isActive: true },
    enabled && showPeoplePicker,
  );

  const employeeOptions = extractAlertEmployees(employeesQuery.data).map(
    (employee) => ({
      value: String(employee.id),
      label: getAlertEmployeeLabel(employee) || String(employee.id),
    }),
  );

  const setAudience = (option: TAlertAudienceMode) => {
    form.setValue("audience", option, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    if (option !== "people") {
      form.setValue("receiverUserIds", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
      noValidate
    >
      <Controller
        name="message"
        control={form.control}
        render={({ field, fieldState }) => (
          <AppTextArea
            {...field}
            required
            label={t("alerts.form.messageLabel")}
            placeholder={t("alerts.form.messagePlaceholder")}
            maxLength={1000}
            rows={4}
            showCount
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />

      <Controller
        name="triggerAt"
        control={form.control}
        render={({ field, fieldState }) => (
          <AppDatePicker
            required
            showTime
            label={t("alerts.form.triggerLabel")}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              field.onChange(
                date && dayjs.isDayjs(date) ? date.toISOString() : "",
              );
            }}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-(--app-text)">
          {t("alerts.form.audienceLabel")}
        </span>
        <div className="flex flex-wrap gap-2" role="group">
          {AUDIENCE_OPTIONS.map((option) => {
            const active = audience === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                className={
                  active
                    ? "rounded-full border border-(--Primary400) bg-(--Primary100) px-3 py-1.5 text-sm font-semibold text-(--Primary400)"
                    : "rounded-full border border-(--Grey300) bg-(--Grey100) px-3 py-1.5 text-sm font-semibold text-(--Grey600) hover:border-(--Grey400)"
                }
                onClick={() => setAudience(option)}
              >
                {t(getAudienceLabelKey(option))}
              </button>
            );
          })}
        </div>
        <p className="m-0 text-xs text-(--Grey600)">
          {t(getAudienceHintKey(audience))}
        </p>
      </div>

      {showPeoplePicker ? (
        <Controller
          name="receiverUserIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <AppDropDownSelect
              mode="multiple"
              allowClear
              showSearch
              optionFilterProp="label"
              label={t("alerts.form.peopleLabel")}
              placeholder={t("alerts.form.peoplePlaceholder")}
              options={employeeOptions}
              value={field.value}
              loading={employeesQuery.isPending || employeesQuery.isFetching}
              onChange={(value) => {
                field.onChange(Array.isArray(value) ? value.map(String) : []);
              }}
              notFoundContent={
                employeesQuery.isError ||
                (employeesQuery.data && !employeesQuery.data.isSuccess)
                  ? t("alerts.form.peopleLoadError")
                  : undefined
              }
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
      ) : null}
    </form>
  );
};

export default AlertForm;
