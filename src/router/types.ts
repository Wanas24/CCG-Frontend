import type { RouteObject } from "react-router";

/**
 * Extended route object for the CCG application.
 *
 * Adds first-class fields alongside the standard React Router RouteObject
 * so route definitions read as plain, flat data — no nesting under `handle`.
 *
 * Usage:
 *   {
 *     path: "daily-logs",
 *     Component: DailyLogs,
 *   }
 */
export type AppRouteObject = Omit<RouteObject, "children"> & {
  /** Roles that may access this route. Empty array means all authenticated users. */

  /** Human-readable label — plain string or an i18n key. */
  label?: string;

  /** Whether this route appears as a sidebar / menu entry. */
  showInMenu?: boolean;

  /** Breadcrumb label. Falls back to `label` when not set. */
  breadcrumb?: string;

  /** Icon identifier resolved to an icon component by the sidebar renderer. */
  iconKey?: string;

  /** Display order inside the sidebar menu. Lower values appear first. */
  order?: number;

  /** Recursive — children use the same extended type. */
  children?: AppRouteObject[];
};
