import { useEffect } from "react";
import { useLocation, Route, Switch } from "wouter";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminMenu } from "@/components/admin-menu";
import { AdminOrders } from "@/components/admin-orders";
import { AdminReservations } from "@/components/admin-reservations";
import { AdminOffers } from "@/components/admin-offers";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check admin session
    fetch("/api/admin/check")
      .then(res => res.json())
      .then(data => {
        if (!data.isAdmin) {
          setLocation("/admin/login");
        }
      })
      .catch(() => {
        setLocation("/admin/login");
      });
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-sidebar">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="font-serif text-xl font-bold text-sidebar-foreground">
              لوحة الإدارة
            </h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-sidebar-foreground"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 ml-2" />
              خروج
            </Button>
          </header>
          
          <main className="flex-1 overflow-auto bg-background p-6">
            <Switch>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/menu" component={AdminMenu} />
              <Route path="/admin/orders" component={AdminOrders} />
              <Route path="/admin/reservations" component={AdminReservations} />
              <Route path="/admin/offers" component={AdminOffers} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
