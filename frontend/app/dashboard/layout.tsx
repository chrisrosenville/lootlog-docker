import "./DashboardLayout.css";

import { DashboardNavigation } from "@/components/dashboard/navigation/DashboardNavigation";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = async ({ children }: Props) => {
  return (
    <div className="dashboard-page">
      <DashboardNavigation />
      <div className="dashboard-content">{children}</div>
    </div>
  );
};

export default DashboardLayout;
