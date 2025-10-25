import { Link } from "wouter";
import logoImage from "@assets/LS20251025155629_1761404202158.png";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logoImage} 
                alt="BOX'EAT" 
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h2 className="font-serif font-bold text-xl">BOX'EAT</h2>
                <p className="text-sm text-muted-foreground">طعم لا يُقاوم</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              أفضل مطعم للوجبات السريعة مع أجود المكونات الطازجة
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    الرئيسية
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/menu">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    القائمة
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/reservations">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    حجز طاولة
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">0123 456 789</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">info@boxeat.dz</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  الجزائر العاصمة، الجزائر
                </span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">ساعات العمل</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">السبت - الخميس</span>
              </li>
              <li className="text-muted-foreground mr-6">
                12:00 - 23:00
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">الجمعة</span>
              </li>
              <li className="text-muted-foreground mr-6">
                14:00 - 23:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 BOX'EAT. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
