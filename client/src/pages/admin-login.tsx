import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/LS20251025155629_1761404202158.png";

export default function AdminLogin() {
  const [code, setCode] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        setLocation("/admin");
      } else {
        toast({
          title: "كود خاطئ",
          description: "الرجاء إدخال الكود الصحيح",
          variant: "destructive",
        });
        setCode("");
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <img 
            src={logoImage} 
            alt="BOX'EAT" 
            className="h-24 w-24 mx-auto mb-6 rounded-full"
          />
          <h1 className="font-serif text-3xl font-bold mb-2">
            لوحة الإدارة
          </h1>
          <p className="text-muted-foreground">
            أدخل كود الدخول للمتابعة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-base font-semibold">
              كود الدخول
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="أدخل الكود"
                className="pr-10"
                data-testid="input-admin-code"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full text-lg font-semibold"
            data-testid="button-admin-login"
          >
            دخول
          </Button>
        </form>
      </Card>
    </div>
  );
}
