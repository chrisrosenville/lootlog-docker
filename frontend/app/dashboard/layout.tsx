import { RoleGuard } from "@/components/guards/RoleGuard";
import "./DashboardLayout.css";

import { DashboardNavigation } from "@/components/dashboard/navigation/DashboardNavigation";
import { ConfirmModalProvider } from "@/components/providers/ConfirmModalProvider";
import { AdminArticleModalProvider } from "@/components/providers/AdminArticleModalProvider";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <RoleGuard>
      <AdminArticleModalProvider>
        <ConfirmModalProvider>
          <div className="dashboard-page">
            <DashboardNavigation />
            <div className="dashboard-content">{children}</div>
          </div>
        </ConfirmModalProvider>
      </AdminArticleModalProvider>
    </RoleGuard>
  );
};

export default DashboardLayout;
