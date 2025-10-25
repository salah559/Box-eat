import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock, Package } from "lucide-react";
import type { Order } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AdminOrders() {
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "تم تحديث الحالة" });
    },
  });

  const pendingOrders = orders?.filter(o => o.status === "pending") || [];
  const preparingOrders = orders?.filter(o => o.status === "preparing") || [];
  const readyOrders = orders?.filter(o => o.status === "ready") || [];
  const completedOrders = orders?.filter(o => o.status === "completed") || [];

  const OrderCard = ({ order }: { order: Order }) => {
    const items = JSON.parse(order.items);
    
    return (
      <Card className="p-4" data-testid={`order-card-${order.id}`}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{order.customerName}</h3>
              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
              <p className="text-sm text-muted-foreground">{order.customerAddress}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(order.createdAt!).toLocaleString('ar-DZ')}
              </p>
            </div>
            <Badge 
              variant={
                order.status === "pending" ? "default" :
                order.status === "preparing" ? "secondary" :
                order.status === "ready" ? "outline" :
                "secondary"
              }
              data-testid={`badge-status-${order.id}`}
            >
              {order.status === "pending" ? "جديد" :
               order.status === "preparing" ? "قيد التحضير" :
               order.status === "ready" ? "جاهز" :
               "مكتمل"}
            </Badge>
          </div>

          <div className="border-t pt-3">
            <p className="text-sm font-semibold mb-2">الطلبات:</p>
            <div className="space-y-1">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="text-muted-foreground">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} دج
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-semibold">المجموع:</span>
            <span className="text-xl font-bold text-primary font-serif">
              {order.total} دج
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {order.status === "pending" && (
              <>
                <Button 
                  size="sm"
                  onClick={() => updateStatusMutation.mutate({ id: order.id, status: "preparing" })}
                  data-testid={`button-accept-${order.id}`}
                >
                  <Check className="h-4 w-4 ml-1" />
                  قبول
                </Button>
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={() => updateStatusMutation.mutate({ id: order.id, status: "cancelled" })}
                  data-testid={`button-reject-${order.id}`}
                >
                  <X className="h-4 w-4 ml-1" />
                  رفض
                </Button>
              </>
            )}
            
            {order.status === "preparing" && (
              <Button 
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: "ready" })}
                data-testid={`button-ready-${order.id}`}
              >
                <Package className="h-4 w-4 ml-1" />
                جاهز
              </Button>
            )}
            
            {order.status === "ready" && (
              <Button 
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: "completed" })}
                data-testid={`button-complete-${order.id}`}
              >
                <Check className="h-4 w-4 ml-1" />
                إكمال
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold">إدارة الطلبات</h2>
        <p className="text-muted-foreground">تتبع ومعالجة طلبات العملاء</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="relative" data-testid="tab-pending">
            <Clock className="h-4 w-4 ml-2" />
            جديد ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="preparing" data-testid="tab-preparing">
            قيد التحضير ({preparingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="ready" data-testid="tab-ready">
            جاهز ({readyOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">
            مكتمل ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2].map((n) => (
                <Card key={n} className="p-4">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : pendingOrders.length > 0 ? (
            <div className="grid gap-4">
              {pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">لا توجد طلبات جديدة</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preparing">
          {preparingOrders.length > 0 ? (
            <div className="grid gap-4">
              {preparingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">لا توجد طلبات قيد التحضير</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ready">
          {readyOrders.length > 0 ? (
            <div className="grid gap-4">
              {readyOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">لا توجد طلبات جاهزة</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedOrders.length > 0 ? (
            <div className="grid gap-4">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">لا توجد طلبات مكتملة</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
