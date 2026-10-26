import { ProjectStatus, ProjectType } from "../constants/projectList";
import type { ProjectFormValues } from "../schemas/projectFormSchema";
import type {
  TCreateProjectRequest,
  TProject,
  TUpdateProjectRequest,
} from "../types/project";

const emptyToNull = (value: string) => {
  const text = value.trim();
  return text ? text : null;
};

const coordinateToNull = (value: string) => {
  const text = value.trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
};

export const emptyProjectFormValues = (): ProjectFormValues => ({
  name: "",
  number: "",
  officialName: "",
  clientId: 0,
  projectType: ProjectType.Residential,
  status: ProjectStatus.Draft,
  notes: "",
  taxIncluded: false,
  hasDemolisionLicence: false,
  hasCivilDefenseLicence: false,
  isActive: true,
  country: "",
  city: "",
  district: "",
  street: "",
  buildingNumber: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  landmark: "",
  locationNotes: "",
});

export const projectToFormValues = (project: TProject): ProjectFormValues => ({
  name: project.name ?? "",
  number: project.number ?? "",
  officialName: project.officialName ?? "",
  clientId: project.clientId ?? 0,
  projectType: project.projectType ?? ProjectType.Residential,
  status: project.status ?? ProjectStatus.Draft,
  notes: project.notes ?? "",
  taxIncluded: Boolean(project.taxIncluded),
  hasDemolisionLicence: Boolean(project.hasDemolisionLicence),
  hasCivilDefenseLicence: Boolean(project.hasCivilDefenseLicence),
  isActive: project.isActive !== false,
  country: project.country ?? "",
  city: project.city ?? "",
  district: project.district ?? "",
  street: project.street ?? "",
  buildingNumber: project.buildingNumber ?? "",
  postalCode: project.postalCode ?? "",
  latitude:
    project.latitude == null || project.latitude === undefined
      ? ""
      : String(project.latitude),
  longitude:
    project.longitude == null || project.longitude === undefined
      ? ""
      : String(project.longitude),
  landmark: project.landmark ?? "",
  locationNotes: project.locationNotes ?? "",
});

export const formValuesToCreateBody = (
  values: ProjectFormValues,
): TCreateProjectRequest => ({
  name: values.name.trim(),
  number: emptyToNull(values.number),
  officialName: emptyToNull(values.officialName),
  clientId: values.clientId,
  projectType: values.projectType,
  status: values.status,
  notes: emptyToNull(values.notes),
  taxIncluded: values.taxIncluded,
  hasDemolisionLicence: values.hasDemolisionLicence,
  hasCivilDefenseLicence: values.hasCivilDefenseLicence,
  country: emptyToNull(values.country),
  city: emptyToNull(values.city),
  district: emptyToNull(values.district),
  street: emptyToNull(values.street),
  buildingNumber: emptyToNull(values.buildingNumber),
  postalCode: emptyToNull(values.postalCode),
  latitude: coordinateToNull(values.latitude),
  longitude: coordinateToNull(values.longitude),
  landmark: emptyToNull(values.landmark),
  locationNotes: emptyToNull(values.locationNotes),
});

export const formValuesToUpdateBody = (
  values: ProjectFormValues,
  projectId: number,
): TUpdateProjectRequest => ({
  ...formValuesToCreateBody(values),
  id: projectId,
  isActive: values.isActive,
});
