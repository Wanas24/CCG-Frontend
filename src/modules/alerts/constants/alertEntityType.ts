export const AlertEntityType = {
  Project: 1,
  Client: 4,
  ApplicationUser: 6,
  Employee: 67,
  Company: 58,
  ProjectLocation: 63,
  ProjectResponsibleEngineer: 64,
  Boq: 65,
  BoqItem: 66,
  ItemCategory: 68,
  ReportImage: 69,
} as const;

export type TAlertEntityType =
  (typeof AlertEntityType)[keyof typeof AlertEntityType];
