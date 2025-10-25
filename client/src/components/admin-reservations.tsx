import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Calendar as CalendarIcon, Users, Clock } from "lucide-react";
import type { Reservation } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AdminReservations() {
  const { toast } = useToast();

  const { data: reservations, isLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/reservations/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      toast({ title: "تم تحديث الحالة" });
    },
  });

  const pendingReservations = reservations?.filter(r => r.status === "pending") || [];
  const confirmedReservations = reservations?.filter(r => r.status === "confirmed") || [];
  const cancelledReservations = reservations?.filter(r => r.status === "cancelled") || [];

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <Card className="p-4" data-testid={`reservation-card-${reservation.id}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{reservation.customerName}</h3>
            <p className="text-sm text-muted-foreground">{reservation.customerPhone}</p>
            {reservation.customerEmail && (
              <p className="text-sm text-muted-foreground">{reservation.customerEmail}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              تم الإنشاء: {new Date(reservation.createdAt!).toLocaleString('ar-DZ')}
            </p>
          </div>
          <Badge 
            variant={
              reservation.status === "pending" ? "default" :
              reservation.status === "confirmed" ? "secondary" :
              "destructive"
            }
            data-testid={`badge-status-${reservation.id}`}
          >
            {reservation.status === "pending" ? "قيد الانتظار" :
             reservation.status === "confirmed" ? "مؤكد" :
             "ملغي"}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t pt-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(reservation.date).toLocaleDateString('ar-DZ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.guests} شخص</span>
          </div>
        </div>

        {reservation.specialRequests && (
          <div className="border-t pt-3">
            <p className="text-sm font-semibold mb-1">طلبات خاصة:</p>
            <p className="text-sm text-muted-foreground">{reservation.specialRequests}</p>
          </div>
        )}

        {reservation.status === "pending" && (
          <div className="flex gap-2 border-t pt-3">
            <Button 
              size="sm"
              onClick={() => updateStatusMutation.mutate({ id: reservation.id, status: "confirmed" })}
              data-testid={`button-confirm-${reservation.id}`}
            >
              <Check className="h-4 w-4 ml-1" />
              تأكيد
            </Button>
            <Button 
              size="sm"
              variant="destructive"
              onClick={() => updateStatusMutation.mutate({ id: reservation.id, status: "cancelled" })}
              data-testid={`button-cancel-${reservation.id}`}
            >
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold">إدارة الحجوزات</h2>
        <p className="text-muted-foreground">عرض وإدارة حجوزات الطاولات</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" data-testid="tab-pending">
            قيد الانتظار ({pendingReservations.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" data-testid="tab-confirmed">
            مؤكد ({confirmedReservations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" data-testid="tab-cancelled">
            ملغي ({cancelledReservations.length})
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
          ) : pendingReservations.length > 0 ? (
            <div className="grid gap-4">
              {pendingReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">لا توجد حجوزات قيد الانتظار</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="confirmed">
          {confirmedReservations.length > 0 ? (
            <div className="grid gap-4">
              {confirmedReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">لا توجد حجوزات مؤكدة</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledReservations.length > 0 ? (
            <div className="grid gap-4">
              {cancelledReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">لا توجد حجوزات ملغية</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
