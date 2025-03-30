import Link from "next/link";

export const SectionTitle: React.FC<{
  title: string;
  route?: string;
}> = ({ title, route }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="m-0 text-2xl font-bold capitalize">{title}</h3>
        <div className="bg-orange700 h-[3px] w-full" />
      </div>
      {route && (
        <Link
          prefetch={false}
          href={route}
          className="max-w-[10rem] cursor-pointer underline-offset-2 hover:underline"
        >
          See all
        </Link>
      )}
    </div>
  );
};
