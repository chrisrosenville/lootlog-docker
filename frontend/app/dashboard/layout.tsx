import { RoleGuard } from "@/components/guards/RoleGuard";
import "./DashboardLayout.css";

import { DashboardNavigation } from "@/components/dashboard/navigation/DashboardNavigation";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <RoleGuard>
      <div className="dashboard-page">
        <DashboardNavigation />
        <div className="dashboard-content">{children}</div>
      </div>
    </RoleGuard>
  );
};

export default DashboardLayout;
