"use client";
import { JSX, useState } from "react";
import Image from "next/image"; 

interface TableProps<T extends Record<string, unknown>> {
  columns: (keyof T)[];
  data: T[];
  actions?: (row: T) => JSX.Element;
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  actions,
}: TableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (!columns || columns.length === 0) {
    return <p className="text-center text-gray-500">No columns provided.</p>;
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    return sortOrder === "asc"
      ? String(a[sortColumn]).localeCompare(String(b[sortColumn]))
      : String(b[sortColumn]).localeCompare(String(a[sortColumn]));
  });

  const handleSort = (column: keyof T) => {
    setSortColumn(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[600px] sm:min-w-full bg-white border border-gray-200 shadow-md">
        {/* Table Head */}
        <thead className="bg-jkuatGreen text-white">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column)}
                onClick={() => handleSort(column)}
                className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
              >
                {String(column)}{" "}
                {sortColumn === column ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
            ))}
            {actions && <th className="px-4 py-3 whitespace-nowrap">Actions</th>}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                {columns.map((column) => (
                  <td key={String(column)} className="px-4 py-3 whitespace-nowrap">
                    {column === "image" ? (
                      <Image
                        src={String(row[column])}
                        alt="Lost ID"
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                    ) : (
                      String(row[column])
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 whitespace-nowrap">{actions(row)}</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-3 text-center"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
