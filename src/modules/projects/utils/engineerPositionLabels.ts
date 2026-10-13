import {
  EngineerPosition,
  type TEngineerPosition,
} from "../constants/engineerPositions";

const POSITION_LABEL_KEYS = {
  [EngineerPosition.ProjectManager]: "projects.team.positions.projectManager",
  [EngineerPosition.ResidentEngineer]: "projects.team.positions.residentEngineer",
  [EngineerPosition.SiteEngineer]: "projects.team.positions.siteEngineer",
  [EngineerPosition.QuantitySurveyor]: "projects.team.positions.quantitySurveyor",
  [EngineerPosition.SafetyOfficer]: "projects.team.positions.safetyOfficer",
  [EngineerPosition.OfficeEngineer]: "projects.team.positions.officeEngineer",
  [EngineerPosition.Draftsman]: "projects.team.positions.draftsman",
  [EngineerPosition.SiteManager]: "projects.team.positions.siteManager",
  [EngineerPosition.CivilEngineer]: "projects.team.positions.civilEngineer",
  [EngineerPosition.ArchitecturalEngineer]:
    "projects.team.positions.architecturalEngineer",
  [EngineerPosition.ElectricalEngineer]:
    "projects.team.positions.electricalEngineer",
  [EngineerPosition.MechanicalEngineer]:
    "projects.team.positions.mechanicalEngineer",
  [EngineerPosition.PlanningEngineer]: "projects.team.positions.planningEngineer",
  [EngineerPosition.CostControlEngineer]:
    "projects.team.positions.costControlEngineer",
  [EngineerPosition.QaQcEngineer]: "projects.team.positions.qaQcEngineer",
  [EngineerPosition.Surveyor]: "projects.team.positions.surveyor",
  [EngineerPosition.Foreman]: "projects.team.positions.foreman",
  [EngineerPosition.OperationsManager]:
    "projects.team.positions.operationsManager",
  [EngineerPosition.ProcurementManager]:
    "projects.team.positions.procurementManager",
  [EngineerPosition.ProcurementOfficer]:
    "projects.team.positions.procurementOfficer",
  [EngineerPosition.ContractsManager]: "projects.team.positions.contractsManager",
  [EngineerPosition.ContractsEngineer]:
    "projects.team.positions.contractsEngineer",
  [EngineerPosition.EstimationEngineer]:
    "projects.team.positions.estimationEngineer",
  [EngineerPosition.DocumentController]:
    "projects.team.positions.documentController",
  [EngineerPosition.HrManager]: "projects.team.positions.hrManager",
  [EngineerPosition.HrSpecialist]: "projects.team.positions.hrSpecialist",
  [EngineerPosition.ItSpecialist]: "projects.team.positions.itSpecialist",
  [EngineerPosition.FinanceManager]: "projects.team.positions.financeManager",
  [EngineerPosition.ChiefAccountant]: "projects.team.positions.chiefAccountant",
  [EngineerPosition.ProjectAccountant]:
    "projects.team.positions.projectAccountant",
  [EngineerPosition.CostAccountant]: "projects.team.positions.costAccountant",
  [EngineerPosition.GeneralAccountant]:
    "projects.team.positions.generalAccountant",
} as const;

type PositionLabelKey =
  (typeof POSITION_LABEL_KEYS)[keyof typeof POSITION_LABEL_KEYS];

export const engineerPositionLabelKey = (
  value: number | null | undefined,
): PositionLabelKey | null => {
  if (value == null) return null;
  if (Object.prototype.hasOwnProperty.call(POSITION_LABEL_KEYS, value)) {
    return POSITION_LABEL_KEYS[value as TEngineerPosition];
  }
  return null;
};
