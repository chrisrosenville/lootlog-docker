import { cn } from "@/utils/utils";

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  caption?: string;
  className?: string;
}

export function Table<T>({ data, columns, caption, className }: TableProps<T>) {
  return (
    <>
      {caption && (
        <h3 className="font-inter mb-4 text-2xl uppercase">{caption}</h3>
      )}
      <table className={cn(className, "overflow-hidden rounded-md")}>
        <thead>
          <tr className="bg-neutral-800 text-neutral-300">
            {columns.map((column) => (
              <th
                key={column.key as string}
                className="font-inter px-6 py-3 text-left text-xs uppercase"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-neutral-700 last:border-b-0"
            >
              {columns.map((column) => (
                <td key={column.key as string} className="px-6 py-3 capitalize">
                  {column.render
                    ? column.render(item)
                    : (item[column.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
