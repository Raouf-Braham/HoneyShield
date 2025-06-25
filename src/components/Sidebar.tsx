
import { NavLink } from "react-router-dom";
import { 
  CircleDashed, 
  BarChartBig, 
  UserCircle, 
  Search as SearchIcon,
  History,
  Globe,
  AlertTriangle,
  Home as HomeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = () => {
  return (
    <div className="group fixed inset-y-0 left-0 z-10 flex w-64 flex-col bg-background border-r shadow-sm">
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          <NavLink to="/" className="no-underline">
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Home
              </Button>
            )}
          </NavLink>
          <NavLink to="/dashboard" className="no-underline">
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <BarChartBig className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            )}
          </NavLink>
          <NavLink to="/alerts" className="no-underline">
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Alerts
              </Button>
            )}
          </NavLink>
          <NavLink to="/history" className="no-underline">
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <History className="mr-2 h-4 w-4" />
                Attack History
              </Button>
            )}
          </NavLink>
          <NavLink to="/map" className="no-underline">
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Globe className="mr-2 h-4 w-4" />
                Threat Map
              </Button>
            )}
          </NavLink>
          <NavLink to="/search" className="no-underline">
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            )}
          </NavLink>
          <NavLink to="/admin-login" className="no-underline mt-auto">
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
            )}
          </NavLink>
          
          <div className="pt-2">
            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleDashed className="h-4 w-4 text-green-500 animate-pulse" />
                  <span className="text-sm font-medium">System Status</span>
                </div>
                <span className="text-sm text-green-500">Active</span>
              </div>
            </div>
          </div>
        </nav>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
