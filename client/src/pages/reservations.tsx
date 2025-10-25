import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Check, ArrowRight, Mail, Phone, User } from "lucide-react";
import { insertReservationSchema } from "@shared/schema";
import type { InsertReservation } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import logoImage from "@assets/generated_images/BOX'EAT_restaurant_logo_design_68466206.png";

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
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 to-muted">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="max-w-md w-full p-6 sm:p-8 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6"
            >
              <Check className="h-8 sm:h-10 w-8 sm:w-10 text-primary" />
            </motion.div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              تم الحجز بنجاح!
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              شكراً لحجزك طاولة في BOX'EAT. سنتصل بك قريباً لتأكيد الحجز
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline"
                onClick={() => setIsSuccess(false)} 
                className="flex-1 hover:scale-105 transition-transform"
                data-testid="button-new-reservation"
              >
                حجز جديد
              </Button>
              <Link href="/">
                <Button 
                  className="w-full hover:scale-105 transition-transform"
                  data-testid="button-back-home"
                >
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-8 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-4 text-primary-foreground hover:bg-white/10"
              data-testid="button-back-to-home"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للرئيسية
            </Button>
          </Link>
          
          <div className="text-center">
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={logoImage} 
              alt="BOX'EAT" 
              className="h-12 sm:h-16 w-auto mx-auto mb-4"
            />
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
            >
              احجز طاولتك
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg opacity-95"
            >
              استمتع بتجربة طعام لا تُنسى في BOX'EAT
            </motion.p>
          </div>
        </div>
      </div>

      {/* Reservation Form */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 sm:p-6 md:p-8">
            <div className="mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-2">تفاصيل الحجز</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                املأ النموذج أدناه وسنتواصل معك لتأكيد الحجز
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                {/* Customer Name */}
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        الاسم الكامل
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="أدخل اسمك الكامل" 
                          {...field}
                          data-testid="input-customer-name"
                          className="h-11 sm:h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Customer Phone */}
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          رقم الهاتف
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="0555 123 456" 
                            {...field}
                            data-testid="input-customer-phone"
                            className="h-11 sm:h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Customer Email */}
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          البريد الإلكتروني
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="example@email.com" 
                            {...field}
                            value={field.value || ""}
                            data-testid="input-customer-email"
                            className="h-11 sm:h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          التاريخ
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            data-testid="input-date"
                            className="h-11 sm:h-12"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          الوقت
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-time" className="h-11 sm:h-12">
                              <SelectValue placeholder="اختر الوقت" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Number of Guests */}
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          عدد الأشخاص
                        </FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-guests" className="h-11 sm:h-12">
                              <SelectValue placeholder="اختر العدد" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {guestOptions.map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "شخص" : "أشخاص"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Special Requests */}
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>طلبات خاصة (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="هل لديك أي طلبات خاصة؟ (مثال: كرسي أطفال، مكان قريب من النافذة، إلخ)" 
                          className="resize-none min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                          data-testid="textarea-special-requests"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold hover:scale-105 transition-transform"
                  disabled={mutation.isPending}
                  data-testid="button-submit-reservation"
                >
                  {mutation.isPending ? "جاري الحجز..." : "تأكيد الحجز"}
                </Button>
              </form>
            </Form>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 sm:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1 text-sm sm:text-base">ساعات العمل</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                السبت - الخميس
                <br />
                10:00 - 23:00
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1 text-sm sm:text-base">اتصل بنا</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                0123 456 789
                <br />
                0987 654 321
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1 text-sm sm:text-base">سعة المطعم</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                حتى 50 شخص
                <br />
                مجموعات كبيرة مرحب بها
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
