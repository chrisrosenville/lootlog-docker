import { ReactNode } from "react";

export const FormItemError = ({ children }: { children: ReactNode }) => {
  return <p className="text-[0.8rem] text-red-600">{children}</p>;
};
