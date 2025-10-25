import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, ShoppingBag, ArrowRight, MapPin, Phone, User } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@shared/schema";
import { motion } from "framer-motion";
import logoImage from "@assets/generated_images/BOX'EAT_restaurant_logo_design_68466206.png";

interface CartItem extends MenuItem {
  quantity: number;
}

const checkoutSchema = z.object({
  customerName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  customerPhone: z.string().min(10, "رقم الهاتف غير صحيح"),
  customerAddress: z.string().min(10, "العنوان يجب أن يكون 10 أحرف على الأقل"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const cartData = localStorage.getItem("cart");
  const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerAddress: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
      const items = cart.map(item => ({
        id: item.id,
        name: item.nameAr,
        price: item.price,
        quantity: item.quantity,
      }));

      return await apiRequest("POST", "/api/orders", {
        ...data,
        items: JSON.stringify(items),
        total: total.toFixed(2),
        status: "pending",
      });
    },
    onSuccess: () => {
      localStorage.removeItem("cart");
      setIsSuccess(true);
      toast({
        title: "تم الطلب بنجاح!",
        description: "سنتصل بك قريباً لتأكيد الطلب",
      });
    },
    onError: () => {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="max-w-md w-full p-6 sm:p-8 text-center">
            <img src={logoImage} alt="BOX'EAT" className="h-16 sm:h-20 w-auto mx-auto mb-4" />
            <ShoppingBag className="h-14 sm:h-16 w-14 sm:w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              السلة فارغة
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              لم تقم بإضافة أي وجبات إلى السلة بعد
            </p>
            <Button 
              onClick={() => setLocation("/menu")} 
              className="w-full hover:scale-105 transition-transform"
              data-testid="button-go-to-menu"
            >
              تصفح القائمة
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              تم الطلب بنجاح!
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              شكراً لطلبك من BOX'EAT. سنتصل بك قريباً لتأكيد الطلب
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline"
                onClick={() => setLocation("/menu")} 
                className="flex-1 hover:scale-105 transition-transform"
                data-testid="button-continue-shopping"
              >
                متابعة التسوق
              </Button>
              <Button 
                onClick={() => setLocation("/orders")} 
                className="flex-1 hover:scale-105 transition-transform"
                data-testid="button-view-orders"
              >
                عرض طلباتي
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const onSubmit = (data: CheckoutForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-muted pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/menu">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-4 text-primary-foreground hover:bg-white/10"
              data-testid="button-back-to-menu"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للقائمة
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
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold"
            >
              إتمام الطلب
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-4 sm:p-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6">معلومات التوصيل</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
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

                  <FormField
                    control={form.control}
                    name="customerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          عنوان التوصيل
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل عنوان التوصيل الكامل" 
                            {...field}
                            data-testid="input-customer-address"
                            className="h-11 sm:h-12"
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
                    data-testid="button-place-order"
                  >
                    {mutation.isPending ? "جاري معالجة الطلب..." : "تأكيد الطلب"}
                  </Button>
                </form>
              </Form>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-4 sm:p-6 sticky top-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold mb-4">ملخص الطلب</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3" data-testid={`order-item-${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.nameAr}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{item.nameAr}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        الكمية: {item.quantity}
                      </p>
                      <p className="text-xs sm:text-sm text-primary font-semibold">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)} دج
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold">{cartTotal.toFixed(2)} دج</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                  <span>رسوم التوصيل:</span>
                  <span className="font-semibold">مجاناً</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-base sm:text-lg font-semibold">الإجمالي:</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary font-serif" data-testid="text-order-total">
                    {cartTotal.toFixed(2)} دج
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
