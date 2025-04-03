"use client";

import "./DashboardNavigation.css";

// Components
import { DashboardNavigationItem } from "./DashboardNavigationItem";

// Icons
import {
  FiBox,
  FiEdit,
  FiFolder,
  FiHeart,
  FiInbox,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { useAuthStore } from "@/store/auth-store";

export const DashboardNavigation = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="sidebar">
      {/* Navigation */}
      <ul>
        <DashboardNavigationItem
          title="My account"
          href="/"
          icon={<FiUser />}
        />

        {/* Authors & Admins */}
        {user?.roles.includes("admin") || user?.roles.includes("author") ? (
          <>
            <DashboardNavigationItem
              title="Create article"
              href="/create-article"
              icon={<FiEdit />}
            />
            <DashboardNavigationItem
              title="My articles"
              href="/my-articles"
              icon={<FiFolder />}
            />
          </>
        ) : null}

        <DashboardNavigationItem
          title="Likes"
          href="/likes"
          icon={<FiHeart />}
        />

        <DashboardNavigationItem
          title="Settings"
          href="/settings"
          icon={<FiSettings />}
        />

        {/* Admin */}
        {user?.roles.includes("admin") && (
          <>
            {/* Divider */}
            <div className="dashboard-nav-divider"></div>

            <DashboardNavigationItem
              title="Manage articles"
              href="/manage-articles"
              icon={<FiInbox />}
            />

            <DashboardNavigationItem
              title="Manage categories"
              href="/manage-categories"
              icon={<FiBox />}
            />

            <DashboardNavigationItem
              title="Manage users"
              href="/manage-users"
              icon={<FiUsers />}
            />
          </>
        )}
      </ul>
    </div>
  );
};
