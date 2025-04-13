import { ReactNode } from "react";

export const FormItemDescription = ({ children }: { children: ReactNode }) => {
  return <p className="text-[0.8rem] text-neutral-300">{children}</p>;
};
