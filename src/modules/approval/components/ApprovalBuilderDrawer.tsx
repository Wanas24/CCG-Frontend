import clsx from "clsx";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { InputNumber, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/i18n/useLocale";
import {
  AppButton,
  AppDrawer,
  AppDropDownSelect,
  AppInput,
} from "@/shared/ANTD_UIComponents";
import {
  ApprovalActionScope,
  ApprovalApproverType,
  ApprovalRequirementMode,
  type TApprovalActionScope,
} from "../types";
import { APPROVAL_ACTION_SCOPES } from "../utils/approvalScopes";
import type {
  ApprovalBuilderGroupDraft,
  ApprovalBuilderLevelDraft,
  ApprovalStudioApi,
} from "../hooks/useApprovalStudio";
import ApprovalHintIcon from "./ApprovalHintIcon";

type Props = {
  studio: ApprovalStudioApi;
};

const whenSomeoneKey = (scope: TApprovalActionScope) => {
  switch (scope) {
    case ApprovalActionScope.Create:
      return "approval.scopes.createsIt" as const;
    case ApprovalActionScope.Update:
      return "approval.scopes.updatesIt" as const;
    case ApprovalActionScope.Delete:
      return "approval.scopes.deletesIt" as const;
    default:
      return "approval.scopes.anyChange" as const;
  }
};

const ApprovalBuilderDrawer = ({ studio }: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const draft = studio.builder;
  const open = Boolean(draft);
  const errors = draft?.showErrors ? studio.validateDraft(draft) : [];

  const updateDraft = (
    patch: Partial<NonNullable<typeof draft>> | ((current: NonNullable<typeof draft>) => NonNullable<typeof draft>),
  ) => {
    if (!draft) return;
    if (typeof patch === "function") {
      studio.setBuilder(patch(draft));
      return;
    }
    studio.setBuilder({ ...draft, ...patch });
  };

  const updateLevel = (
    levelKey: string,
    updater: (level: ApprovalBuilderLevelDraft) => ApprovalBuilderLevelDraft,
  ) => {
    updateDraft((current) => ({
      ...current,
      levels: current.levels.map((level) =>
        level.key === levelKey ? updater(level) : level,
      ),
    }));
  };

  const updateGroup = (
    levelKey: string,
    groupKey: string,
    updater: (group: ApprovalBuilderGroupDraft) => ApprovalBuilderGroupDraft,
  ) => {
    updateLevel(levelKey, (level) => ({
      ...level,
      groups: level.groups.map((group) =>
        group.key === groupKey ? updater(group) : group,
      ),
    }));
  };

  const moveLevel = (index: number, direction: -1 | 1) => {
    updateDraft((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.levels.length) return current;
      const levels = [...current.levels];
      const [item] = levels.splice(index, 1);
      levels.splice(nextIndex, 0, item);
      return { ...current, levels };
    });
  };

  const roleOptions =
    studio.roles?.map((role) => ({
      value: role.id,
      label: role.name,
    })) ?? [];

  const employeeOptions =
    studio.employees?.map((employee) => {
      const name = `${employee.firstName} ${employee.lastName}`.trim();
      return {
        value: employee.id,
        label: name || employee.email,
      };
    }) ?? [];

  const canSave = draft?.id ? studio.canUpdate : studio.canCreate;

  return (
    <AppDrawer
      open={open}
      placement={isRtl ? "left" : "right"}
      width={720}
      title={
        draft?.id
          ? t("approval.builder.editTitle", { name: draft.name || "…" })
          : t("approval.builder.newTitle")
      }
      onClose={studio.closeBuilder}
      footer={
        <div className="flex w-full justify-end gap-2">
          <AppButton variant="secondary" onClick={studio.closeBuilder}>
            {t("approval.builder.cancel")}
          </AppButton>
          {canSave ? (
            <AppButton
              loading={studio.isSaving}
              onClick={() => void studio.saveBuilder()}
            >
              {t("approval.builder.save")}
            </AppButton>
          ) : null}
        </div>
      }
    >
      {draft ? (
        <div className="flex flex-col gap-5">
          <p className="m-0 text-sm text-(--Grey600)">
            {t("approval.builder.subtitle")}
          </p>

          {errors.length > 0 ? (
            <ul className="m-0 list-disc rounded-xl border border-(--statusR200) bg-(--statusR100) px-5 py-3 text-sm text-(--statusR200)">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}

          <AppInput
            required
            label={t("approval.builder.name")}
            placeholder={t("approval.builder.namePlaceholder")}
            value={draft.name}
            onChange={(event) => updateDraft({ name: event.target.value })}
          />

          <AppDropDownSelect
            required
            label={t("approval.builder.appliesTo")}
            placeholder={t("approval.builder.chooseEntity")}
            value={draft.entityType || undefined}
            options={studio.entityTypes.map((entity) => ({
              value: entity.key,
              label: entity.value,
            }))}
            onChange={(value) => updateDraft({ entityType: String(value) })}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-(--app-text)">
              <span>{t("approval.builder.whenSomeone")}</span>
              <ApprovalHintIcon hintKey="actionScope" />
            </div>
            <div className="flex flex-wrap gap-2">
              {APPROVAL_ACTION_SCOPES.map((scope) => (
                <button
                  key={scope.value}
                  type="button"
                  className={clsx(
                    "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    draft.actionScope === scope.value
                      ? "border-(--Primary400) bg-(--Primary400) text-(--app-surface)"
                      : "border-(--Grey400) bg-(--app-surface) text-(--Grey600) hover:border-(--Primary400)",
                  )}
                  onClick={() => updateDraft({ actionScope: scope.value })}
                >
                  {t(whenSomeoneKey(scope.value))}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-(--app-text)">
            <Switch
              checked={draft.isActive}
              onChange={(checked) => updateDraft({ isActive: checked })}
            />
            {t("approval.builder.active")}
          </label>

          <section className="flex flex-col gap-3">
            <div>
              <h3 className="m-0 text-[15px] font-bold text-(--app-text)">
                {t("approval.builder.levelsTitle")}
              </h3>
              <p className="m-0 mt-1 text-xs text-(--Grey500)">
                {t("approval.builder.levelsHint")}
              </p>
            </div>

            {draft.levels.map((level, levelIndex) => (
              <div
                key={level.key}
                className="rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-(--Grey600)">
                    {t("approval.builder.levelLabel", { index: levelIndex + 1 })}
                  </span>
                  <div className="ms-auto flex gap-1">
                    <AppButton
                      variant="default"
                      disabled={levelIndex === 0}
                      icon={<ArrowUp size={14} />}
                      onClick={() => moveLevel(levelIndex, -1)}
                      aria-label="Move level up"
                    />
                    <AppButton
                      variant="default"
                      disabled={levelIndex === draft.levels.length - 1}
                      icon={<ArrowDown size={14} />}
                      onClick={() => moveLevel(levelIndex, 1)}
                      aria-label="Move level down"
                    />
                    <AppButton
                      variant="delete"
                      icon={<Trash2 size={14} />}
                      disabled={draft.levels.length <= 1}
                      onClick={() =>
                        updateDraft((current) => ({
                          ...current,
                          levels: current.levels.filter(
                            (item) => item.key !== level.key,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>

                <AppInput
                  placeholder={t("approval.builder.levelNamePlaceholder")}
                  value={level.name}
                  onChange={(event) =>
                    updateLevel(level.key, (current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />

                <div className="mt-3 flex flex-col gap-2">
                  {level.groups.length === 0 ? (
                    <p className="m-0 text-xs text-(--Grey500)">
                      {t("approval.builder.noApprovers")}
                    </p>
                  ) : null}

                  {level.groups.map((group) => {
                    const isRole =
                      group.approverType === ApprovalApproverType.Role;
                    const isAny =
                      group.requirementMode === ApprovalRequirementMode.Any;
                    return (
                      <div
                        key={group.key}
                        className="rounded-xl border border-(--Grey300) bg-(--app-surface) p-3"
                      >
                        <div className="mb-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            className={clsx(
                              "cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold",
                              isRole
                                ? "border-(--Primary400) bg-(--Primary100) text-(--Primary400)"
                                : "border-(--Grey400) text-(--Grey600)",
                            )}
                            onClick={() =>
                              updateGroup(level.key, group.key, (current) => ({
                                ...current,
                                approverType: ApprovalApproverType.Role,
                                approverKey: "",
                                requirementMode: ApprovalRequirementMode.Any,
                                minApprovals: 1,
                              }))
                            }
                          >
                            {t("approval.builder.role")}
                          </button>
                          <button
                            type="button"
                            className={clsx(
                              "cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold",
                              !isRole
                                ? "border-(--Primary400) bg-(--Primary100) text-(--Primary400)"
                                : "border-(--Grey400) text-(--Grey600)",
                            )}
                            onClick={() =>
                              updateGroup(level.key, group.key, (current) => ({
                                ...current,
                                approverType: ApprovalApproverType.User,
                                approverKey: "",
                                requirementMode: ApprovalRequirementMode.All,
                                minApprovals: 1,
                              }))
                            }
                          >
                            {t("approval.builder.person")}
                          </button>
                          <AppButton
                            variant="delete"
                            className="ms-auto"
                            icon={<Trash2 size={14} />}
                            onClick={() =>
                              updateLevel(level.key, (current) => ({
                                ...current,
                                groups: current.groups.filter(
                                  (item) => item.key !== group.key,
                                ),
                              }))
                            }
                          />
                        </div>

                        {isRole ? (
                          studio.roles === null ? (
                            <p className="m-0 text-xs text-(--statusR200)">
                              {t("approval.builder.rolesDenied")}
                            </p>
                          ) : (
                            <AppDropDownSelect
                              placeholder={t("approval.builder.chooseRole")}
                              value={group.approverKey || undefined}
                              options={roleOptions}
                              showSearch
                              optionFilterProp="label"
                              onChange={(value) =>
                                updateGroup(level.key, group.key, (current) => ({
                                  ...current,
                                  approverKey: String(value),
                                }))
                              }
                            />
                          )
                        ) : studio.employees === null ? (
                          <p className="m-0 text-xs text-(--statusR200)">
                            {t("approval.builder.peopleDenied")}
                          </p>
                        ) : (
                          <AppDropDownSelect
                            placeholder={t("approval.builder.choosePerson")}
                            value={group.approverKey || undefined}
                            options={employeeOptions}
                            showSearch
                            optionFilterProp="label"
                            onChange={(value) =>
                              updateGroup(level.key, group.key, (current) => ({
                                ...current,
                                approverKey: String(value),
                              }))
                            }
                          />
                        )}

                        {isRole ? (
                          <div className="mt-3 flex flex-col gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-(--app-text)">
                              <span>{t("approval.builder.any")}</span>
                              <span>/</span>
                              <span>{t("approval.builder.everyone")}</span>
                              <ApprovalHintIcon hintKey="requirementMode" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                className={clsx(
                                  "cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold",
                                  isAny
                                    ? "border-(--Primary400) bg-(--Primary100) text-(--Primary400)"
                                    : "border-(--Grey400) text-(--Grey600)",
                                )}
                                onClick={() =>
                                  updateGroup(level.key, group.key, (current) => ({
                                    ...current,
                                    requirementMode: ApprovalRequirementMode.Any,
                                  }))
                                }
                              >
                                {t("approval.builder.any")}
                              </button>
                              <button
                                type="button"
                                className={clsx(
                                  "cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold",
                                  !isAny
                                    ? "border-(--Primary400) bg-(--Primary100) text-(--Primary400)"
                                    : "border-(--Grey400) text-(--Grey600)",
                                )}
                                onClick={() =>
                                  updateGroup(level.key, group.key, (current) => ({
                                    ...current,
                                    requirementMode: ApprovalRequirementMode.All,
                                    minApprovals: 1,
                                  }))
                                }
                              >
                                {t("approval.builder.everyone")}
                              </button>
                            </div>

                            {isAny ? (
                              <label className="flex flex-wrap items-center gap-2 text-xs text-(--app-text)">
                                <span>{t("approval.builder.atLeast")}</span>
                                <InputNumber
                                  min={1}
                                  value={group.minApprovals}
                                  onChange={(value) =>
                                    updateGroup(level.key, group.key, (current) => ({
                                      ...current,
                                      minApprovals: Number(value) || 1,
                                    }))
                                  }
                                />
                                <ApprovalHintIcon hintKey="minApprovals" />
                              </label>
                            ) : (
                              <p className="m-0 text-xs text-(--Grey500)">
                                {t("approval.builder.mustApprove")}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="m-0 mt-2 text-xs text-(--Grey500)">
                            {t("approval.builder.mustApprove")}
                          </p>
                        )}

                        {levelIndex > 0 ? (
                          <label className="mt-3 flex items-center gap-2 text-xs text-(--app-text)">
                            <Switch
                              checked={group.canSkipLowerLevels}
                              onChange={(checked) =>
                                updateGroup(level.key, group.key, (current) => ({
                                  ...current,
                                  canSkipLowerLevels: checked,
                                }))
                              }
                            />
                            <span>{t("approval.builder.canSkip")}</span>
                            <ApprovalHintIcon hintKey="canSkipLowerLevels" />
                          </label>
                        ) : null}
                      </div>
                    );
                  })}

                  <AppButton
                    variant="secondary"
                    icon={<Plus size={14} />}
                    onClick={() =>
                      updateLevel(level.key, (current) => ({
                        ...current,
                        groups: [
                          ...current.groups,
                          studio.createEmptyApproverGroup(),
                        ],
                      }))
                    }
                  >
                    {t("approval.builder.addApprover")}
                  </AppButton>
                </div>
              </div>
            ))}

            <AppButton
              variant="secondary"
              icon={<Plus size={14} />}
              onClick={() =>
                updateDraft((current) => ({
                  ...current,
                  levels: [
                    ...current.levels,
                    studio.createEmptyApprovalLevel(),
                  ],
                }))
              }
            >
              {t("approval.builder.addLevel", {
                index: draft.levels.length + 1,
              })}
            </AppButton>
          </section>
        </div>
      ) : null}
    </AppDrawer>
  );
};

export default ApprovalBuilderDrawer;
