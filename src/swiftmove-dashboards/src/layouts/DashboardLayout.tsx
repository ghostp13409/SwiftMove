import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,

  FileText,
  Truck,
  User,
  Package,
  Users,
  HandCoins,
  Route,
  History,
  LogOut,
  ChevronLeft,

  ChevronRight,
  Menu,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const clientNav: NavItem[] = [
  { title: "Dashboard", url: "/client", icon: LayoutDashboard },
  { title: "Move Requests", url: "/client/requests", icon: FileText },
  { title: "Move Trips", url: "/client/trips", icon: Route },
  { title: "History", url: "/client/history", icon: History },
  { title: "Profile", url: "/client/profile", icon: User },
];

const driverNav: NavItem[] = [
  { title: "Dashboard", url: "/driver", icon: LayoutDashboard },
  { title: "Browse Requests", url: "/driver/browse", icon: FileText },
  { title: "Vehicles", url: "/driver/vehicles", icon: Truck },
  { title: "Move Offers", url: "/driver/offers", icon: HandCoins },
  { title: "Move Trips", url: "/driver/trips", icon: Route },
  { title: "History", url: "/driver/history", icon: History },
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
  const { name, email, logout, role: userRole } = useAuth();

  const navItems =
    role === "CLIENT" ? clientNav : role === "DRIVER" ? driverNav : adminNav;

  const displayName =
    name ||
    (role === "CLIENT" ? "Client" : role === "DRIVER" ? "Driver" : "Admin");
  const displayEmail = email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Redirect if user role doesn't match the required role for this layout
  useEffect(() => {
    if (!userRole) return;
    const normalizedUserRole = userRole.toUpperCase();
    if (normalizedUserRole !== role) {
      if (normalizedUserRole === "CLIENT") navigate("/client", { replace: true });
      else if (normalizedUserRole === "DRIVER") navigate("/driver", { replace: true });
      else if (normalizedUserRole === "ADMIN") navigate("/admin", { replace: true });
      else navigate("/client", { replace: true });
    }
  }, [userRole, role, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sidebar = (
    <div
      className={`flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">

          <img src="/logo.jpg" alt="SwiftMove Logo" className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm text-sidebar-accent-foreground">
              SwiftMove
            </h1>
            <p className="text-[10px] text-sidebar-foreground opacity-70">
              {roleLabels[role]}
            </p>
          </div>
        )}


      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.url ||
            (item.url !== `/${role.toLowerCase()}` &&
              location.pathname.startsWith(item.url));
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === `/${role.toLowerCase()}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              activeClassName="bg-primary/10 text-primary"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className={cn("w-4 h-4 shrink-0 transition-transform duration-200", isActive && "scale-110")} />
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
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-sidebar-foreground opacity-60 truncate">
                {displayEmail}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 px-3"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </div>

      {/* Collapse Toggle - Desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 rounded-full bg-card border border-border items-center justify-center shadow-sm hover:bg-secondary transition-colors z-40"
      >




        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}



      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex relative shrink-0 border-r border-border/50 shadow-sm">{sidebar}</aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 shadow-2xl ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebar}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">

        {/* Top bar */}
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-6 gap-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-8 w-[1px] bg-border/50 mx-1 hidden sm:block" />
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-foreground hidden sm:inline">
                {displayName}
              </span>
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shadow-sm">
                {initials}
              </div>
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
