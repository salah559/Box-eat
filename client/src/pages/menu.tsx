import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Star, Sparkles, Minus, Plus, Trash2 } from "lucide-react";
import type { MenuItem } from "@shared/schema";

interface CartItem extends MenuItem {
  quantity: number;
}

export default function Menu() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const categories = ["الكل", "برجر", "ساندويتش", "سلطات", "مشروبات", "حلويات"];
  
  const filteredItems = selectedCategory === "الكل" 
    ? menuItems?.filter(item => item.isAvailable) 
    : menuItems?.filter(item => item.category === selectedCategory && item.isAvailable);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      );
      return updated.filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            قائمة الطعام
          </h1>
          <p className="text-lg opacity-95">
            اكتشف تشكيلتنا الواسعة من الوجبات اللذيذة
          </p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
                data-testid={`button-category-${category}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card 
                key={item.id}
                className="overflow-hidden hover-elevate active-elevate-2 transition-transform"
                data-testid={`card-menu-item-${item.id}`}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.nameAr}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {item.isPopular && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 ml-1 fill-current" />
                        مميز
                      </Badge>
                    )}
                    {item.isNew && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Sparkles className="h-3 w-3 ml-1" />
                        جديد
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-lg mb-2 text-foreground">
                    {item.nameAr}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.descriptionAr}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary font-serif">
                      {item.price} دج
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => addToCart(item)}
                      data-testid={`button-add-to-cart-${item.id}`}
                    >
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              لا توجد وجبات في هذه الفئة
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                size="lg" 
                className="h-14 px-8 shadow-2xl text-lg font-semibold relative"
                data-testid="button-view-cart"
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                عرض السلة ({cartItemCount})
                <Badge className="absolute -top-2 -left-2 h-7 w-7 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
                  {cartItemCount}
                </Badge>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl">سلة المشتريات</SheetTitle>
              </SheetHeader>
              
              <div className="mt-8 space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="p-4" data-testid={`cart-item-${item.id}`}>
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.nameAr}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.nameAr}</h4>
                        <p className="text-sm text-primary font-semibold">
                          {item.price} دج
                        </p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2 border rounded-md">
                            <Button 
                              size="icon" 
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                              data-testid={`button-decrease-${item.id}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium" data-testid={`quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                              data-testid={`button-increase-${item.id}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeFromCart(item.id)}
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="absolute bottom-0 right-0 left-0 p-6 border-t bg-background">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">المجموع:</span>
                  <span className="text-2xl font-bold text-primary font-serif" data-testid="text-cart-total">
                    {cartTotal.toFixed(2)} دج
                  </span>
                </div>
                <Button 
                  size="lg" 
                  className="w-full text-lg font-semibold h-12"
                  onClick={() => setLocation("/checkout")}
                  data-testid="button-checkout"
                >
                  <ShoppingCart className="ml-2 h-5 w-5" />
                  إتمام الطلب
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}
