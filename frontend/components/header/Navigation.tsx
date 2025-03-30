import { DekstopNavigation } from "./navigation/DekstopNavigation";
import { MobileNavigation } from "./navigation/MobileNavigation";

export const Navigation = () => {
  return (
    <>
      <div className="hidden lg:flex">
        <DekstopNavigation />
      </div>
      <div className="flex flex-col lg:hidden">
        <MobileNavigation />
      </div>
    </>
  );
};
