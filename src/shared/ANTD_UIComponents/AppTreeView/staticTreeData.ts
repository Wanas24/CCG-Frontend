import type { TreeNode } from "./TreeViewComponents/treeUtils";

export const DEMO_TREE_DATA: TreeNode[] = [
  {
    id: 1,
    name: "Financial operations and accounting",
    code: "FIN",
    description: "Financial operations and accounting",
    isMain: true,
    children: [
      { id: 11, name: "Accounts Payable", code: "AP" },
      { id: 12, name: "Accounts Receivable", code: "AR" },
      { id: 13, name: "General Ledger", code: "GL" },
    ],
  },
  {
    id: 2,
    name: "Inventory",
    code: "INV",
    description: "Stock and warehouse management",
    isMain: true,
    children: [
      { id: 21, name: "Warehouses", code: "WH" },
      { id: 22, name: "Products", code: "PRD" },
      { id: 23, name: "Stock Transfers", code: "ST" },
    ],
  },
  {
    id: 3,
    name: "Human Resources",
    code: "HR",
    description: "Employee and payroll management",
    isMain: true,
    children: [
      { id: 31, name: "Departments", code: "DEPT" },
      { id: 32, name: "Employees", code: "EMP" },
      { id: 33, name: "Payroll", code: "PAY" },
    ],
  },
  {
    id: 4,
    name: "Sales",
    code: "SLS",
    description: "Orders, invoices, and customers",
    isMain: true,
    children: [
      { id: 41, name: "Customers", code: "CUST" },
      { id: 42, name: "Orders", code: "ORD" },
      { id: 43, name: "Invoices", code: "INV-SLS" },
    ],
  },
];
