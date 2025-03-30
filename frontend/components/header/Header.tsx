import { UserMenu } from "./menu/UserMenu";
import { Navigation } from "./Navigation";
import { Logo } from "../logo/Logo";

export const Header = async () => {
  return (
    <header className="static top-0 h-header w-full border-b border-orange700">
      <div className="relative grid h-full w-full grid-cols-4 grid-rows-1 items-center px-8">
        <div className="order-2 col-span-2 flex justify-center lg:order-1 lg:col-span-1 lg:justify-self-start">
          <Logo size="1.25rem" />
        </div>

        <nav className="order-1 flex justify-center justify-self-start lg:order-2 lg:col-span-2 lg:justify-self-center">
          <Navigation />
        </nav>

        <div className="order-3 justify-self-end">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
