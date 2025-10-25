import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Calendar, Clock, Star, Flame, ChefHat } from "lucide-react";
import heroImage from "@assets/generated_images/Restaurant_hero_image_bb42dfff.png";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem, Offer } from "@shared/schema";

export default function Home() {
  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const { data: offers } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
  });

  const popularItems = menuItems?.filter(item => item.isPopular).slice(0, 4) || [];
  const activeOffers = offers?.filter(offer => offer.isActive).slice(0, 2) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            استمتع بألذ الوجبات
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 font-medium">
            مكونات طازجة • توصيل سريع • أكثر من 100 وجبة لذيذة
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/menu">
              <Button 
                size="lg" 
                className="h-12 px-8 text-lg font-semibold"
                data-testid="button-order-now"
              >
                <ShoppingCart className="ml-2 h-5 w-5" />
                اطلب الآن
              </Button>
            </Link>
            
            <Link href="/reservations">
              <Button 
                size="lg" 
                variant="outline"
                className="h-12 px-8 text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                data-testid="button-book-table"
              >
                <Calendar className="ml-2 h-5 w-5" />
                احجز طاولة
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">مكونات طازجة</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">توصيل سريع</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">جودة عالية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      {popularItems.length > 0 && (
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                الوجبات الأكثر طلباً
              </h2>
              <p className="text-lg text-muted-foreground">
                جرب أشهر وجباتنا المفضلة لدى العملاء
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map((item) => (
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
                    {item.isPopular && (
                      <Badge 
                        className="absolute top-3 left-3 bg-primary text-primary-foreground"
                        data-testid={`badge-popular-${item.id}`}
                      >
                        <Star className="h-3 w-3 ml-1 fill-current" />
                        مميز
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-serif font-semibold text-lg mb-2 text-foreground">
                      {item.nameAr}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.descriptionAr}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {item.price} دج
                      </span>
                      <Link href="/menu">
                        <Button 
                          size="sm"
                          data-testid={`button-view-${item.id}`}
                        >
                          اطلب
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/menu">
                <Button size="lg" variant="outline" data-testid="button-view-full-menu">
                  عرض القائمة الكاملة
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Special Offers Section */}
      {activeOffers.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                عروض خاصة
              </h2>
              <p className="text-lg text-muted-foreground">
                لا تفوت عروضنا المحدودة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeOffers.map((offer) => (
                <Card 
                  key={offer.id}
                  className="overflow-hidden relative hover-elevate active-elevate-2"
                  data-testid={`card-offer-${offer.id}`}
                >
                  <div className="aspect-[2/1] relative overflow-hidden">
                    <img 
                      src={offer.image} 
                      alt={offer.titleAr}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    <Badge 
                      className="absolute top-4 right-4 h-16 w-16 rounded-full flex items-center justify-center bg-accent text-foreground text-lg font-bold"
                      data-testid={`badge-discount-${offer.id}`}
                    >
                      {offer.discount}%
                    </Badge>

                    <div className="absolute bottom-0 right-0 left-0 p-6">
                      <h3 className="font-serif font-bold text-2xl text-white mb-2">
                        {offer.titleAr}
                      </h3>
                      <p className="text-white/90 mb-3">
                        {offer.descriptionAr}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/80">
                          صالح حتى: {new Date(offer.validUntil).toLocaleDateString('ar-DZ')}
                        </span>
                        <Link href="/menu">
                          <Button 
                            size="sm"
                            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                            variant="outline"
                            data-testid={`button-order-offer-${offer.id}`}
                          >
                            اطلب الآن
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Flame className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl mb-3">
                مكونات طازجة
              </h3>
              <p className="text-muted-foreground">
                نستخدم أجود المكونات الطازجة يومياً لضمان أعلى جودة
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl mb-3">
                توصيل سريع
              </h3>
              <p className="text-muted-foreground">
                نضمن وصول طلبك ساخناً وطازجاً في أسرع وقت ممكن
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl mb-3">
                طهاة محترفون
              </h3>
              <p className="text-muted-foreground">
                فريق من الطهاة المحترفين لتقديم أفضل تجربة طعام
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
