import type { TableColumnsType } from "antd";
import type { IDataType } from "./Types/tableTypes";

export const Tablecolumns: TableColumnsType<IDataType> = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "start",
  },
  {
    title: "Age",
    width: 100,
    dataIndex: "age",
    key: "age",
    fixed: "start",
  },
  {
    title: "Column 1",
    dataIndex: "address",
    key: "1",
    width: 150,
  },
  {
    title: "Column 2",
    dataIndex: "address",
    key: "2",
    width: 150,
  },
  {
    title: "Column 3",
    dataIndex: "address",
    key: "3",
    width: 150,
  },
  {
    title: "Column 4",
    dataIndex: "address",
    key: "4",
    width: 150,
  },
  {
    title: "Column 5",
    dataIndex: "address",
    key: "5",
    width: 150,
  },
  {
    title: "Column 6",
    dataIndex: "address",
    key: "6",
    width: 150,
  },
  {
    title: "Column 7",
    dataIndex: "address",
    key: "7",
    width: 150,
  },
  { title: "Column 8", dataIndex: "address", key: "8" },
  { title: "Column 9", dataIndex: "address", key: "9" },
  { title: "Column 10", dataIndex: "address", key: "10" },

  {
    title: "Action",
    key: "operation",
    fixed: "end",
    width: 100,
    render: () => <a>action </a>,
  },
];
