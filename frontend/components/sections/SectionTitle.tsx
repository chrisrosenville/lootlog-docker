import Link from "next/link";

type Props = {
  title: string;
};

export const SectionTitle = ({ title }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="m-0 text-2xl font-bold capitalize">{title}</h3>
        <div className="h-[3px] w-full bg-orange700" />
      </div>
    </div>
  );
};
