import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Calendar, Clock, Star, Flame, ChefHat, Menu, Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem, Offer } from "@shared/schema";
import { motion } from "framer-motion";
import logoImage from "@assets/generated_images/BOX'EAT_restaurant_logo_design_68466206.png";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
                data-testid="link-home-logo"
              >
                <img 
                  src={logoImage} 
                  alt="BOX'EAT Logo" 
                  className="h-10 md:h-12 w-auto"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl md:text-2xl font-bold text-primary">BOX'EAT</h1>
                  <p className="text-xs text-muted-foreground">أفضل وجبات سريعة</p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-home">
                الرئيسية
              </Link>
              <Link href="/menu" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-menu">
                القائمة
              </Link>
              <Link href="/reservations" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-reservations">
                الحجز
              </Link>
              <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-orders">
                الطلبات
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/menu">
                <Button className="hidden sm:flex" data-testid="button-nav-order">
                  <ShoppingCart className="ml-2 h-4 w-4" />
                  اطلب الآن
                </Button>
              </Link>
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden border-t py-4"
            >
              <nav className="flex flex-col gap-3">
                <Link href="/" className="block py-2 text-sm font-medium hover:text-primary transition-colors" data-testid="link-mobile-home">
                  الرئيسية
                </Link>
                <Link href="/menu" className="block py-2 text-sm font-medium hover:text-primary transition-colors" data-testid="link-mobile-menu">
                  القائمة
                </Link>
                <Link href="/reservations" className="block py-2 text-sm font-medium hover:text-primary transition-colors" data-testid="link-mobile-reservations">
                  الحجز
                </Link>
                <Link href="/orders" className="block py-2 text-sm font-medium hover:text-primary transition-colors" data-testid="link-mobile-orders">
                  الطلبات
                </Link>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="h-16 md:h-20" />

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&h=1080&fit=crop)'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <img 
              src={logoImage} 
              alt="BOX'EAT" 
              className="h-24 md:h-32 w-auto mx-auto mb-4"
            />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6"
          >
            استمتع بألذ الوجبات
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-white/95 mb-6 md:mb-8 font-medium"
          >
            مكونات طازجة • توصيل سريع • أكثر من 100 وجبة لذيذة
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/menu">
              <Button 
                size="lg" 
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold hover:scale-105 transition-transform w-full sm:w-auto"
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
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-transform w-full sm:w-auto"
                data-testid="button-book-table"
              >
                <Calendar className="ml-2 h-5 w-5" />
                احجز طاولة
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 md:mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-white/90"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2"
            >
              <Flame className="h-5 w-5 text-accent" />
              <span className="text-xs sm:text-sm font-medium">مكونات طازجة</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2"
            >
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-xs sm:text-sm font-medium">توصيل سريع</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2"
            >
              <ChefHat className="h-5 w-5 text-accent" />
              <span className="text-xs sm:text-sm font-medium">جودة عالية</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Items Section */}
      {popularItems.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4"
              >
                الوجبات الأكثر طلباً
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg text-muted-foreground"
              >
                جرب أشهر وجباتنا المفضلة لدى العملاء
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {popularItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {item.isPopular && (
                        <Badge 
                          className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-lg"
                          data-testid={`badge-popular-${item.id}`}
                        >
                          <Star className="h-3 w-3 ml-1 fill-current" />
                          مميز
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-serif font-semibold text-base md:text-lg mb-2 text-foreground line-clamp-1">
                        {item.nameAr}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.descriptionAr}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg md:text-xl font-bold text-primary">
                          {item.price} دج
                        </span>
                        <Link href="/menu">
                          <Button 
                            size="sm"
                            className="hover:scale-110 transition-transform"
                            data-testid={`button-view-${item.id}`}
                          >
                            اطلب
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 md:mt-10">
              <Link href="/menu">
                <Button size="lg" variant="outline" className="hover:scale-105 transition-transform" data-testid="button-view-full-menu">
                  عرض القائمة الكاملة
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Special Offers Section */}
      {activeOffers.length > 0 && (
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4"
              >
                عروض خاصة
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg text-muted-foreground"
              >
                لا تفوت عروضنا المحدودة
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {activeOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card 
                    className="overflow-hidden relative hover:shadow-2xl transition-all duration-300 group"
                    data-testid={`card-offer-${offer.id}`}
                  >
                    <div className="aspect-[16/9] md:aspect-[2/1] relative overflow-hidden">
                      <img 
                        src={offer.image} 
                        alt={offer.titleAr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Badge 
                          className="absolute top-4 right-4 h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center bg-accent text-foreground text-base md:text-lg font-bold shadow-xl"
                          data-testid={`badge-discount-${offer.id}`}
                        >
                          {offer.discount}%
                        </Badge>
                      </motion.div>

                      <div className="absolute bottom-0 right-0 left-0 p-4 md:p-6">
                        <h3 className="font-serif font-bold text-xl md:text-2xl text-white mb-2">
                          {offer.titleAr}
                        </h3>
                        <p className="text-sm md:text-base text-white/90 mb-3">
                          {offer.descriptionAr}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <span className="text-xs md:text-sm text-white/80">
                            صالح حتى: {new Date(offer.validUntil).toLocaleDateString('ar-DZ')}
                          </span>
                          <Link href="/menu">
                            <Button 
                              size="sm"
                              className="bg-white text-primary hover:bg-white/90 hover:scale-110 transition-transform font-semibold"
                              data-testid={`button-order-offer-${offer.id}`}
                            >
                              اطلب الآن
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 md:py-16 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 h-full">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6"
                >
                  <Flame className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </motion.div>
                <h3 className="font-serif font-semibold text-lg md:text-xl mb-2 md:mb-3">
                  مكونات طازجة
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  نستخدم أجود المكونات الطازجة يومياً لضمان أعلى جودة
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 h-full">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6"
                >
                  <Clock className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </motion.div>
                <h3 className="font-serif font-semibold text-lg md:text-xl mb-2 md:mb-3">
                  توصيل سريع
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  نضمن وصول طلبك ساخناً وطازجاً في أسرع وقت ممكن
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <Card className="p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 h-full">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6"
                >
                  <ChefHat className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </motion.div>
                <h3 className="font-serif font-semibold text-lg md:text-xl mb-2 md:mb-3">
                  طهاة محترفون
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  فريق من الطهاة المحترفين لتقديم أفضل تجربة طعام
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact/Footer Section */}
      <section className="py-12 md:py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-5 w-5" />
                اتصل بنا
              </h3>
              <p className="text-primary-foreground/90">0123 456 789</p>
              <p className="text-primary-foreground/90">0987 654 321</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
                <MapPin className="h-5 w-5" />
                العنوان
              </h3>
              <p className="text-primary-foreground/90">الجزائر العاصمة</p>
              <p className="text-primary-foreground/90">شارع ديدوش مراد</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
                <Clock className="h-5 w-5" />
                ساعات العمل
              </h3>
              <p className="text-primary-foreground/90">السبت - الخميس: 10:00 - 23:00</p>
              <p className="text-primary-foreground/90">الجمعة: 14:00 - 23:00</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
            <p className="text-primary-foreground/80 text-sm">
              © 2024 BOX'EAT. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
