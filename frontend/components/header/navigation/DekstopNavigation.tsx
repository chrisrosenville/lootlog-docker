import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export const DekstopNavigation = () => {
  return (
    <ul className="flex space-x-8">
      {ROUTES.map((item) => (
        <li key={item.name} className="flex flex-col">
          <Link href={item.path} className="group/nav-item">
            {item.name}
            <div className="h-[1px] w-0 rounded-md bg-neutral-100 transition-[width] ease-in-out group-hover/nav-item:w-full"></div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
