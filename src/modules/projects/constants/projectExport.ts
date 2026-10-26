export const ProjectExportFormat = {
  Excel: 1,
  Pdf: 2,
  Word: 3,
} as const;

export type TProjectExportFormat =
  (typeof ProjectExportFormat)[keyof typeof ProjectExportFormat];

export const PROJECT_EXPORT_FORMAT_OPTIONS = [
  ProjectExportFormat.Excel,
  ProjectExportFormat.Pdf,
  ProjectExportFormat.Word,
] as const;

export const PROJECT_EXPORT_EXTENSION: Record<TProjectExportFormat, string> = {
  [ProjectExportFormat.Excel]: "xlsx",
  [ProjectExportFormat.Pdf]: "pdf",
  [ProjectExportFormat.Word]: "docx",
};

export const PROJECT_EXPORT_REPORT_TYPE = "Projects" as const;

export const PROJECT_EXPORT_COLUMN_GROUPS = [
  {
    id: "project",
    columns: [
      "Id",
      "Name",
      "Number",
      "OfficialName",
      "ClientName",
      "Status",
      "ApprovalStatus",
      "ProjectType",
      "IsActive",
    ],
  },
  {
    id: "property",
    columns: [
      "TaxIncluded",
      "HasDemolisionLicence",
      "HasCivilDefenseLicence",
    ],
  },
  {
    id: "site",
    columns: [
      "Country",
      "City",
      "District",
      "Street",
      "BuildingNumber",
      "PostalCode",
      "Latitude",
      "Longitude",
      "Landmark",
      "LocationNotes",
    ],
  },
  {
    id: "history",
    columns: ["AddedBy", "AddedAt", "UpdatedBy", "UpdatedAt"],
  },
] as const;

export type TProjectExportColumn =
  (typeof PROJECT_EXPORT_COLUMN_GROUPS)[number]["columns"][number];

export const PROJECT_EXPORT_ALL_COLUMNS: TProjectExportColumn[] =
  PROJECT_EXPORT_COLUMN_GROUPS.flatMap((group) => [...group.columns]);

export const PROJECT_EXPORT_ESSENTIAL_COLUMNS: TProjectExportColumn[] = [
  "Name",
  "Number",
  "ClientName",
  "Status",
  "City",
];
