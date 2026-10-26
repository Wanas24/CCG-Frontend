export const ClientExportFormat = {
  Excel: 1,
  Pdf: 2,
  Word: 3,
} as const;

export type TClientExportFormat =
  (typeof ClientExportFormat)[keyof typeof ClientExportFormat];

export const CLIENT_EXPORT_FORMAT_OPTIONS = [
  ClientExportFormat.Excel,
  ClientExportFormat.Pdf,
  ClientExportFormat.Word,
] as const;

export const CLIENT_EXPORT_EXTENSION: Record<TClientExportFormat, string> = {
  [ClientExportFormat.Excel]: "xlsx",
  [ClientExportFormat.Pdf]: "pdf",
  [ClientExportFormat.Word]: "docx",
};

export const CLIENT_EXPORT_REPORT_TYPE = "Clients" as const;

export const CLIENT_EXPORT_COLUMN_GROUPS = [
  {
    id: "client",
    columns: [
      "Id",
      "Name",
      "Notes",
      "Email",
      "Phone",
      "Address",
      "City",
      "Country",
      "ContactPerson",
      "TaxNumber",
      "ProjectsCount",
    ],
  },
  {
    id: "history",
    columns: ["AddedBy", "AddedAt", "UpdatedBy", "UpdatedAt"],
  },
] as const;

export type TClientExportColumn =
  (typeof CLIENT_EXPORT_COLUMN_GROUPS)[number]["columns"][number];

export const CLIENT_EXPORT_ALL_COLUMNS: TClientExportColumn[] =
  CLIENT_EXPORT_COLUMN_GROUPS.flatMap((group) => [...group.columns]);

export const CLIENT_EXPORT_ESSENTIAL_COLUMNS: TClientExportColumn[] = [
  "Name",
  "Email",
  "Phone",
  "City",
  "Country",
];
