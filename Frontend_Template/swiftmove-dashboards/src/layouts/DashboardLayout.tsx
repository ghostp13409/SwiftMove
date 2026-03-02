import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, FileText, Truck, User, Package, Users, HandCoins, Route,
  LogOut, ChevronLeft, ChevronRight, Menu,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const clientNav: NavItem[] = [
  { title: "Dashboard", url: "/client", icon: LayoutDashboard },
  { title: "Move Requests", url: "/client/requests", icon: FileText },
  { title: "Move Trips", url: "/client/trips", icon: Route },
  { title: "Profile", url: "/client/profile", icon: User },
];

const driverNav: NavItem[] = [
  { title: "Dashboard", url: "/driver", icon: LayoutDashboard },
  { title: "Browse Requests", url: "/driver/browse", icon: FileText },
  { title: "Vehicles", url: "/driver/vehicles", icon: Truck },
  { title: "Move Offers", url: "/driver/offers", icon: HandCoins },
  { title: "Move Trips", url: "/driver/trips", icon: Route },
  { title: "Profile", url: "/driver/profile", icon: User },
];

const adminNav: NavItem[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Move Requests", url: "/admin/requests", icon: FileText },
  { title: "Move Offers", url: "/admin/offers", icon: HandCoins },
  { title: "Move Trips", url: "/admin/trips", icon: Route },
  { title: "Vehicles", url: "/admin/vehicles", icon: Truck },
];

const roleLabels: Record<UserRole, string> = {
  CLIENT: "Client Portal",
  DRIVER: "Driver Portal",
  ADMIN: "Admin Panel",
};

interface DashboardLayoutProps {
  role: UserRole;
}

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = role === "CLIENT" ? clientNav : role === "DRIVER" ? driverNav : adminNav;

  const sidebar = (
    <div className={`flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm text-sidebar-accent-foreground">SwiftMove</h1>
            <p className="text-[10px] text-sidebar-foreground opacity-70">{roleLabels[role]}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url || (item.url !== `/${role.toLowerCase()}` && location.pathname.startsWith(item.url));
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === `/${role.toLowerCase()}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"}`}
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-medium text-sidebar-accent-foreground">
              {role === "CLIENT" ? "JD" : role === "DRIVER" ? "MJ" : "AD"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                {role === "CLIENT" ? "John Doe" : role === "DRIVER" ? "Mike Johnson" : "Admin User"}
              </p>
              <p className="text-[10px] text-sidebar-foreground opacity-60 truncate">
                {role === "CLIENT" ? "john@example.com" : role === "DRIVER" ? "mike@example.com" : "admin@swiftmove.com"}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 px-3"
          onClick={() => navigate("/login")}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </div>

      {/* Collapse Toggle - Desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 rounded-full bg-card border border-border items-center justify-center shadow-sm hover:bg-secondary transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex relative shrink-0">
        {sidebar}
      </aside>

      {/* Sidebar - Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebar}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {role === "CLIENT" ? "John Doe" : role === "DRIVER" ? "Mike Johnson" : "Admin User"}
            </span>
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
              {role === "CLIENT" ? "JD" : role === "DRIVER" ? "MJ" : "AD"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
