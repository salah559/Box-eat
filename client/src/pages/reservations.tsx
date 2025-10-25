import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, Check } from "lucide-react";
import { insertReservationSchema } from "@shared/schema";
import type { InsertReservation } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Reservations() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertReservation>({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      date: "",
      time: "",
      guests: 2,
      specialRequests: "",
      status: "pending",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertReservation) => {
      return await apiRequest("POST", "/api/reservations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      setIsSuccess(true);
      toast({
        title: "تم الحجز بنجاح!",
        description: "سنتصل بك قريباً لتأكيد الحجز",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const timeSlots = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const onSubmit = (data: InsertReservation) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold mb-4">
            تم الحجز بنجاح!
          </h2>
          <p className="text-muted-foreground mb-6">
            شكراً لحجزك. سنتصل بك قريباً لتأكيد الحجز
          </p>
          <Button 
            onClick={() => setIsSuccess(false)} 
            className="w-full"
            data-testid="button-new-reservation"
          >
            حجز جديد
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            احجز طاولتك
          </h1>
          <p className="text-lg opacity-95">
            استمتع بتجربة طعام لا تُنسى في BOX'EAT
          </p>
        </div>
      </div>

      {/* Reservation Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">الاسم الكامل</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="أدخل اسمك الكامل"
                        data-testid="input-customer-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="0123456789"
                          type="tel"
                          data-testid="input-customer-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">البريد الإلكتروني (اختياري)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="example@email.com"
                          type="email"
                          data-testid="input-customer-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      التاريخ
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        data-testid="input-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      الوقت
                    </FormLabel>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={field.value === slot ? "default" : "outline"}
                          className="w-full"
                          onClick={() => field.onChange(slot)}
                          data-testid={`button-time-${slot}`}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      عدد الأشخاص
                    </FormLabel>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {guestOptions.map((num) => (
                        <Button
                          key={num}
                          type="button"
                          variant={field.value === num ? "default" : "outline"}
                          className="w-full"
                          onClick={() => field.onChange(num)}
                          data-testid={`button-guests-${num}`}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">طلبات خاصة (اختياري)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="مثلاً: حساسية من بعض المكونات، احتفال خاص..."
                        rows={3}
                        data-testid="input-special-requests"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg"
                className="w-full text-lg font-semibold h-12"
                disabled={mutation.isPending}
                data-testid="button-submit-reservation"
              >
                {mutation.isPending ? "جاري الحجز..." : "تأكيد الحجز"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
