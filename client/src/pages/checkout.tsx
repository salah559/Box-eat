import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, ShoppingBag } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@shared/schema";

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

  // Get cart from localStorage
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
        <Card className="max-w-md w-full p-8 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-serif text-2xl font-bold mb-4">
            السلة فارغة
          </h2>
          <p className="text-muted-foreground mb-6">
            لم تقم بإضافة أي وجبات إلى السلة بعد
          </p>
          <Button onClick={() => setLocation("/menu")} data-testid="button-go-to-menu">
            تصفح القائمة
          </Button>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold mb-4">
            تم الطلب بنجاح!
          </h2>
          <p className="text-muted-foreground mb-6">
            شكراً لطلبك. سنتصل بك قريباً لتأكيد الطلب والتوصيل
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full"
              data-testid="button-go-home"
            >
              العودة إلى الرئيسية
            </Button>
            <Button 
              onClick={() => setLocation("/menu")} 
              variant="outline"
              className="w-full"
              data-testid="button-new-order"
            >
              طلب جديد
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: CheckoutForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            إتمام الطلب
          </h1>
          <p className="text-lg opacity-95">
            أكمل بياناتك لإتمام الطلب
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order Form */}
          <Card className="p-6 md:p-8 lg:col-span-3">
            <h2 className="font-serif text-2xl font-bold mb-6">بيانات التوصيل</h2>
            
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
                  name="customerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">عنوان التوصيل</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="أدخل عنوانك الكامل"
                          data-testid="input-customer-address"
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
                  data-testid="button-submit-order"
                >
                  {mutation.isPending ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
                </Button>
              </form>
            </Form>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 lg:col-span-2 h-fit">
            <h2 className="font-serif text-xl font-bold mb-4">ملخص الطلب</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.nameAr}</span>
                  <span className="font-medium">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} دج
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">المجموع:</span>
                <span className="text-2xl font-bold text-primary font-serif" data-testid="text-total">
                  {cartTotal.toFixed(2)} دج
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
