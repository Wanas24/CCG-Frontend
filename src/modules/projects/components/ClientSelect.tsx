import { useMemo, useState, type UIEvent } from "react";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { AppDropDownSelect } from "@/shared/ANTD_UIComponents";
import { useGetClientsInfinite } from "../api/hooks/useGetClientsInfinite";

type Props = {
  value?: number;
  selectedLabel?: string | null;
  onChange: (clientId: number | undefined, label?: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errorMsg?: string;
  allowClear?: boolean;
};

const nearListBottom = (event: UIEvent<HTMLDivElement>) => {
  const target = event.currentTarget;
  return target.scrollTop + target.clientHeight >= target.scrollHeight - 32;
};

const ClientSelect = ({
  value,
  selectedLabel,
  onChange,
  label,
  placeholder,
  required,
  disabled,
  errorMsg,
  allowClear = true,
}: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search.trim(), 300);
  const clientsQuery = useGetClientsInfinite(
    debouncedSearch,
    !disabled && dropdownOpen,
  );

  const clients = useMemo(() => {
    const pages = clientsQuery.data?.pages ?? [];
    const rows = pages.flatMap((page) =>
      page.isSuccess ? (page.data?.data ?? []) : [],
    );
    return rows;
  }, [clientsQuery.data?.pages]);

  const options = useMemo(() => {
    const mapped = clients.map((client) => ({
      value: client.id,
      label: client.name || String(client.id),
    }));
    if (
      value != null &&
      value > 0 &&
      !mapped.some((option) => option.value === value)
    ) {
      mapped.unshift({
        value,
        label: selectedLabel?.trim() || String(value),
      });
    }
    return mapped;
  }, [clients, selectedLabel, value]);

  return (
    <AppDropDownSelect
      label={label}
      required={required}
      disabled={disabled}
      errorMsg={errorMsg}
      allowClear={allowClear}
      showSearch
      filterOption={false}
      placeholder={placeholder ?? t("projects.filters.anyClient")}
      value={value && value > 0 ? value : undefined}
      options={options}
      loading={clientsQuery.isPending || clientsQuery.isFetchingNextPage}
      onSearch={setSearch}
      onDropdownVisibleChange={(visible) => {
        setDropdownOpen(visible);
        if (!visible) setSearch("");
      }}
      onPopupScroll={(event) => {
        if (nearListBottom(event) && clientsQuery.hasNextPage) {
          void clientsQuery.fetchNextPage();
        }
      }}
      onChange={(next) => {
        if (typeof next !== "number") {
          onChange(undefined, undefined);
          return;
        }
        const match = options.find((option) => option.value === next);
        onChange(next, match?.label);
      }}
    />
  );
};

export default ClientSelect;
