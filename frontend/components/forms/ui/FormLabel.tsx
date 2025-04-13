import { ReactNode } from "react";

export const FormLabel = ({ children }: { children: ReactNode }) => {
  return <label className="text-sm">{children}</label>;
};
