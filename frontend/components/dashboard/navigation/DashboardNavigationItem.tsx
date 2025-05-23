import Link from "next/link";

type Props = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export const DashboardNavigationItem: React.FC<Props> = ({
  title,
  href,
  icon,
}) => {
  return (
    <li>
      <Link href={`/dashboard${href}`}>
        <>
          {icon}
          <span>{title}</span>
        </>
      </Link>
    </li>
  );
};
