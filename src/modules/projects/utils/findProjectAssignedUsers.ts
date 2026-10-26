import { projectEmployeeService } from "@/modules/userControl/api/services/projectEmployee.service";
import type { TProjectUser } from "@/modules/userControl/types";

const MAX_PAGES = 50;
const PAGE_SIZE = 10;

export const findProjectAssignedUsers = async (
  projectId: number,
  searchHint?: string,
): Promise<TProjectUser[]> => {
  const attempts = [searchHint?.trim(), undefined].filter(
    (value, index, all) => all.indexOf(value) === index,
  );

  for (const search of attempts) {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const response = await projectEmployeeService.projects({
        page,
        pageSize: PAGE_SIZE,
        ...(search ? { search } : {}),
      });

      if (!response.isSuccess || !response.data) {
        break;
      }

      const match = response.data.data.find((project) => project.id === projectId);
      if (match) {
        return match.users ?? [];
      }

      const totalPages = Math.max(1, response.data.totalPages || 1);
      if (page >= totalPages) break;
    }
  }

  return [];
};
