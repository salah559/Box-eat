import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Calendar, Home, Menu as MenuIcon } from "lucide-react";
import logoImage from "@assets/LS20251025155629_1761404202158.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { title: "الرئيسية", path: "/", icon: Home },
    { title: "القائمة", path: "/menu", icon: MenuIcon },
    { title: "الحجوزات", path: "/reservations", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 hover-elevate rounded-md px-2 py-1">
              <img 
                src={logoImage} 
                alt="BOX'EAT" 
                className="h-12 w-12 rounded-full"
              />
              <div className="hidden sm:block">
                <h1 className="font-serif font-bold text-xl text-foreground">
                  BOX'EAT
                </h1>
                <p className="text-xs text-muted-foreground">طعم لا يُقاوم</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button 
                    variant={isActive ? "default" : "ghost"}
                    data-testid={`link-${item.path}`}
                  >
                    <item.icon className="h-4 w-4 ml-2" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/menu">
              <Button data-testid="button-order-header">
                <ShoppingCart className="h-4 w-4 ml-2" />
                اطلب الآن
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl">القائمة</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-3 mt-8">
                {navItems.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button 
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start"
                        data-testid={`mobile-link-${item.path}`}
                      >
                        <item.icon className="h-4 w-4 ml-2" />
                        {item.title}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
