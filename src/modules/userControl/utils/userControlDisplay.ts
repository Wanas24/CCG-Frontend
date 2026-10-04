import type { TApplicationRolePermissionAction } from "../types";

const ACCENT_COUNT = 6;

export const personName = (person: {
  firstName: string;
  lastName: string;
  email?: string;
}) => {
  const name = `${person.firstName} ${person.lastName}`.trim();
  return name || person.email || "";
};

export const personInitials = (person: {
  firstName: string;
  lastName: string;
  email?: string;
}) => {
  const letters = personName(person)
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2);

  return (letters || "?").toUpperCase();
};

export const accentIndex = (seed: string) => {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }
  return hash % ACCENT_COUNT;
};

export const permissionLabel = (action: TApplicationRolePermissionAction) => {
  const description = action.description?.trim();
  if (description) return description;
  if (action.displayName && action.displayName !== action.name) {
    return action.displayName;
  }
  const actionName = action.name.split(".").pop() ?? action.name;
  return actionName.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const setsEqual = <T>(left: Set<T>, right: Set<T>) => {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
};

export const withUserRole = (
  source: Map<string, Set<string>>,
  userId: string,
  roleId: string,
  assigned: boolean,
): Map<string, Set<string>> => {
  const next = new Map(source);
  const roles = new Set(next.get(userId) ?? []);
  if (assigned) roles.add(roleId);
  else roles.delete(roleId);
  next.set(userId, roles);
  return next;
};
