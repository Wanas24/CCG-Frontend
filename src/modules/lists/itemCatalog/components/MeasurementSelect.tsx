import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import { AppDropDownSelect } from "@/shared/ANTD_UIComponents";
import { useGetMeasurements } from "../../units/api/hooks/useGetMeasurements";

type Props = {
  value?: number;
  selectedLabel?: string | null;
  onChange: (unitId: number | undefined, label?: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errorMsg?: string;
  allowClear?: boolean;
  enabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

const MeasurementSelect = ({
  value,
  selectedLabel,
  onChange,
  label,
  placeholder,
  required,
  disabled,
  errorMsg,
  allowClear = true,
  enabled = true,
  className,
  "aria-label": ariaLabel,
}: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [pinnedLabel, setPinnedLabel] = useState<string | null>(null);
  const [debouncedSearch] = useDebounce(search.trim(), 300);

  const params = useMemo(
    () => ({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [debouncedSearch],
  );

  const unitsQuery = useGetMeasurements(params, enabled && !disabled);

  const units = useMemo(() => {
    if (!unitsQuery.data?.isSuccess) return [];
    const rows = unitsQuery.data.data?.data;
    return Array.isArray(rows) ? rows : [];
  }, [unitsQuery.data]);

  const resolvedSelectedLabel =
    selectedLabel?.trim() || pinnedLabel?.trim() || "";

  const options = useMemo(() => {
    if (unitsQuery.isFetching && search.trim() !== debouncedSearch) {
      return value != null && value > 0
        ? [
            {
              value,
              label: resolvedSelectedLabel || String(value),
            },
          ]
        : [];
    }

    const mapped = units.map((unit) => ({
      value: unit.id,
      label: unit.unit,
    }));

    if (
      value != null &&
      value > 0 &&
      !mapped.some((option) => option.value === value)
    ) {
      mapped.unshift({
        value,
        label: resolvedSelectedLabel || String(value),
      });
    }

    return mapped;
  }, [
    debouncedSearch,
    resolvedSelectedLabel,
    search,
    units,
    unitsQuery.isFetching,
    value,
  ]);

  const notFoundContent = unitsQuery.isError
    ? t("lists.units.loadError")
    : unitsQuery.isPending || unitsQuery.isFetching
      ? t("common.loading")
      : t("lists.units.emptySearchDescription");

  return (
    <AppDropDownSelect
      className={className}
      label={label}
      required={required}
      disabled={disabled}
      errorMsg={errorMsg}
      allowClear={allowClear}
      showSearch
      filterOption={false}
      placeholder={placeholder ?? t("lists.itemCatalog.unitPlaceholder")}
      aria-label={ariaLabel}
      value={value != null && value > 0 ? value : undefined}
      options={options}
      loading={unitsQuery.isPending || unitsQuery.isFetching}
      notFoundContent={notFoundContent}
      onSearch={setSearch}
      onDropdownVisibleChange={(visible) => {
        if (!visible) setSearch("");
      }}
      onChange={(next) => {
        if (typeof next !== "number") {
          setPinnedLabel(null);
          onChange(undefined, undefined);
          return;
        }
        const match = options.find((option) => option.value === next);
        const nextLabel = match?.label;
        if (nextLabel) setPinnedLabel(nextLabel);
        onChange(next, nextLabel);
      }}
    />
  );
};

export default MeasurementSelect;
