import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Star, Sparkles, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/generated_images/BOX'EAT_restaurant_logo_design_68466206.png";

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
    <div className="min-h-screen pb-24">
      {/* Simple Header with Logo and Back Button */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
                <ArrowRight className="h-4 w-4" />
                <span className="hidden sm:inline">العودة للرئيسية</span>
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="BOX'EAT" className="h-8 sm:h-10 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg font-bold text-primary">BOX'EAT</h1>
              </div>
            </div>
            
            <div className="w-20 sm:w-24" />
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4"
          >
            قائمة الطعام
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl opacity-95"
          >
            اكتشف تشكيلتنا الواسعة من الوجبات اللذيذة
          </motion.p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-[57px] sm:top-[65px] z-40 bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap text-sm sm:text-base hover:scale-105 transition-transform"
                  size={selectedCategory === category ? "default" : "sm"}
                  data-testid={`button-category-${category}`}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  layout
                >
                  <Card 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full group"
                    data-testid={`card-menu-item-${item.id}`}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.nameAr}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        {item.isPopular && (
                          <Badge className="bg-primary text-primary-foreground shadow-lg">
                            <Star className="h-3 w-3 ml-1 fill-current" />
                            مميز
                          </Badge>
                        )}
                        {item.isNew && (
                          <Badge className="bg-accent text-accent-foreground shadow-lg">
                            <Sparkles className="h-3 w-3 ml-1" />
                            جديد
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-serif font-semibold text-base sm:text-lg mb-2 text-foreground line-clamp-1">
                        {item.nameAr}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem] sm:min-h-[3rem]">
                        {item.descriptionAr}
                      </p>
                      
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-lg sm:text-xl font-bold text-primary font-serif">
                          {item.price} دج
                        </span>
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button 
                            size="sm"
                            onClick={() => addToCart(item)}
                            className="hover:scale-110 transition-transform text-xs sm:text-sm"
                            data-testid={`button-add-to-cart-${item.id}`}
                          >
                            <Plus className="h-4 w-4 ml-1" />
                            إضافة
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <p className="text-muted-foreground text-base sm:text-lg">
              لا توجد وجبات في هذه الفئة
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md"
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  size="lg" 
                  className="h-12 sm:h-14 px-6 sm:px-8 shadow-2xl text-base sm:text-lg font-semibold relative w-full hover:scale-105 transition-transform"
                  data-testid="button-view-cart"
                >
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  عرض السلة ({cartItemCount})
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Badge className="absolute -top-2 -left-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center bg-accent text-accent-foreground shadow-lg">
                      {cartItemCount}
                    </Badge>
                  </motion.div>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="left" className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                  <SheetTitle className="font-serif text-xl sm:text-2xl">سلة المشتريات</SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto mt-6 sm:mt-8 pb-32">
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-3 sm:p-4" data-testid={`cart-item-${item.id}`}>
                          <div className="flex gap-3 sm:gap-4">
                            <img 
                              src={item.image} 
                              alt={item.nameAr}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm sm:text-base mb-1 truncate">{item.nameAr}</h4>
                              <p className="text-sm sm:text-base text-primary font-semibold mb-2">
                                {item.price} دج
                              </p>
                              
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex items-center gap-1 sm:gap-2 border rounded-md">
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    data-testid={`button-decrease-${item.id}`}
                                  >
                                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base" data-testid={`quantity-${item.id}`}>
                                    {item.quantity}
                                  </span>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    data-testid={`button-increase-${item.id}`}
                                  >
                                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                                
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => removeFromCart(item.id)}
                                  data-testid={`button-remove-${item.id}`}
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 left-0 p-4 sm:p-6 border-t bg-background/95 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="text-base sm:text-lg font-semibold">المجموع:</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary font-serif" data-testid="text-cart-total">
                      {cartTotal.toFixed(2)} دج
                    </span>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full text-base sm:text-lg font-semibold h-11 sm:h-12 hover:scale-105 transition-transform"
                    onClick={() => setLocation("/checkout")}
                    data-testid="button-checkout"
                  >
                    <ShoppingCart className="ml-2 h-5 w-5" />
                    إتمام الطلب
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
