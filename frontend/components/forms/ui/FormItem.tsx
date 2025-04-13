import { ReactNode } from "react";

export const FormItem = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-1.5">{children}</div>;
};
