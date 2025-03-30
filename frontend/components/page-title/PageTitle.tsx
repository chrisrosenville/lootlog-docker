import "./PageTitle.css";

type Props = {
  title: string;
  subtitle: string;
};

export const PageTitle: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <>
      <div className="pt-2">
        <div className="flex w-fit flex-col">
          <h2 className="font-openSans text-2xl font-bold uppercase sm:text-4xl">
            {title}
          </h2>
          <div className="h-[2px] w-full rounded-md bg-orange700"></div>
        </div>
        <p className="pt-4 text-sm">{subtitle}</p>
      </div>
      <div className="h-[2px] w-full rounded-md bg-neutral-500"></div>
    </>
  );
};
