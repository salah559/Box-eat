import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Calendar, UtensilsCrossed, TrendingUp } from "lucide-react";
import type { Order, Reservation, MenuItem } from "@shared/schema";

export function AdminDashboard() {
  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: reservations } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations"],
  });

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders?.filter(o => o.createdAt?.toString().startsWith(today)) || [];
  const pendingOrders = orders?.filter(o => o.status === "pending") || [];
  const pendingReservations = reservations?.filter(r => r.status === "pending") || [];
  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;

  const recentOrders = [...(orders || [])].sort((a, b) => 
    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  ).slice(0, 5);

  const stats = [
    {
      title: "طلبات اليوم",
      value: todayOrders.length,
      icon: ShoppingBag,
      color: "text-primary",
    },
    {
      title: "طلبات قيد الانتظار",
      value: pendingOrders.length,
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      title: "حجوزات قيد الانتظار",
      value: pendingReservations.length,
      icon: Calendar,
      color: "text-destructive",
    },
    {
      title: "عدد الوجبات",
      value: menuItems?.length || 0,
      icon: UtensilsCrossed,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold mb-2">
          مرحباً بك في لوحة التحكم
        </h2>
        <p className="text-muted-foreground">
          نظرة عامة على نشاط المطعم اليوم
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} data-testid={`card-stat-${stat.title}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">الطلبات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 border rounded-md hover-elevate"
                  data-testid={`order-${order.id}`}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerPhone}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.createdAt!).toLocaleString('ar-DZ')}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary font-serif">
                      {order.total} دج
                    </p>
                    <Badge 
                      variant={
                        order.status === "pending" ? "default" :
                        order.status === "completed" ? "secondary" :
                        "outline"
                      }
                    >
                      {order.status === "pending" ? "قيد الانتظار" :
                       order.status === "preparing" ? "قيد التحضير" :
                       order.status === "ready" ? "جاهز" :
                       "مكتمل"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              لا توجد طلبات
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-serif text-2xl">الإيرادات الإجمالية</CardTitle>
          <TrendingUp className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary font-serif" data-testid="text-total-revenue">
            {totalRevenue.toFixed(2)} دج
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            من {orders?.length || 0} طلب
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
