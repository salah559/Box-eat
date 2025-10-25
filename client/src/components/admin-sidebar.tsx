import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Calendar, Tag } from "lucide-react";
import logoImage from "@assets/LS20251025155629_1761404202158.png";

const menuItems = [
  {
    title: "لوحة التحكم",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "القائمة",
    url: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "الطلبات",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "الحجوزات",
    url: "/admin/reservations",
    icon: Calendar,
  },
  {
    title: "العروض",
    url: "/admin/offers",
    icon: Tag,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="BOX'EAT" 
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h2 className="font-serif font-bold text-lg text-sidebar-foreground">
                BOX'EAT
              </h2>
              <p className="text-xs text-sidebar-foreground/70">لوحة الإدارة</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup className="px-2 py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
