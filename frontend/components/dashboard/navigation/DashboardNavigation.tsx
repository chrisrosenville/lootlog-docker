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
          href="/user"
          icon={<FiUser />}
        />

        {/* Authors & Admins */}
        {user?.roles.includes("admin") || user?.roles.includes("author") ? (
          <>
            <DashboardNavigationItem
              title="New article"
              href="/author/new-article"
              icon={<FiEdit />}
            />
            <DashboardNavigationItem
              title="My articles"
              href="/author/my-articles"
              icon={<FiFolder />}
            />
          </>
        ) : null}

        <DashboardNavigationItem
          title="Likes"
          href="/user/likes"
          icon={<FiHeart />}
        />

        <DashboardNavigationItem
          title="Settings"
          href="/user/settings"
          icon={<FiSettings />}
        />

        {/* Admin */}
        {user?.roles.includes("admin") && (
          <>
            {/* Divider */}
            <div className="dashboard-nav-divider"></div>

            <DashboardNavigationItem
              title="Articles"
              href="/admin/articles"
              icon={<FiInbox />}
            />

            <DashboardNavigationItem
              title="Categories"
              href="/admin/categories"
              icon={<FiBox />}
            />

            <DashboardNavigationItem
              title="Users"
              href="/admin/users"
              icon={<FiUsers />}
            />
          </>
        )}
      </ul>
    </div>
  );
};
