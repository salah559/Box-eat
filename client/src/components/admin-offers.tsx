import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOfferSchema } from "@shared/schema";
import type { InsertOffer, Offer } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import burgerImage from "@assets/generated_images/Gourmet_burger_food_photography_93147261.png";
import dessertImage from "@assets/generated_images/Chocolate_dessert_photography_821a184d.png";

const offerImages = [burgerImage, dessertImage];

export function AdminOffers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const { toast } = useToast();

  const { data: offers, isLoading } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
  });

  const form = useForm<InsertOffer>({
    resolver: zodResolver(insertOfferSchema),
    defaultValues: {
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      discount: 10,
      image: burgerImage,
      validUntil: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertOffer) => {
      return await apiRequest("POST", "/api/offers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      setIsDialogOpen(false);
      setEditingOffer(null);
      form.reset();
      toast({ title: "تمت الإضافة بنجاح" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Offer> }) => {
      return await apiRequest("PATCH", `/api/offers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({ title: "تم التحديث بنجاح" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/offers/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({ title: "تم الحذف بنجاح" });
    },
  });

  const onSubmit = (data: InsertOffer) => {
    if (editingOffer) {
      updateMutation.mutate({ id: editingOffer.id, data });
      setIsDialogOpen(false);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    form.reset(offer);
    setIsDialogOpen(true);
  };

  const toggleActive = (offer: Offer) => {
    updateMutation.mutate({
      id: offer.id,
      data: { isActive: !offer.isActive },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold">إدارة العروض</h2>
          <p className="text-muted-foreground">إضافة وتعديل العروض الترويجية</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingOffer(null);
                form.reset();
              }}
              data-testid="button-add-offer"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة عرض جديد
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingOffer ? "تعديل العرض" : "إضافة عرض جديد"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="titleAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان (عربي)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-title-ar" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان (إنجليزي)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-title-en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف (عربي)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} data-testid="input-description-ar" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف (إنجليزي)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} data-testid="input-description-en" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نسبة الخصم (%)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            data-testid="input-discount"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>صالح حتى</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            data-testid="input-valid-until"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الصورة</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {offerImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => field.onChange(img)}
                            className={`border-2 rounded-md overflow-hidden ${field.value === img ? 'border-primary' : 'border-border'}`}
                            data-testid={`button-image-${idx}`}
                          >
                            <img src={img} alt="" className="w-full h-32 object-cover" />
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between border rounded-md p-3">
                      <FormLabel className="mb-0">عرض نشط</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-offer"
                >
                  {editingOffer ? "تحديث" : "إضافة"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <Card key={n} className="overflow-hidden">
              <div className="aspect-[2/1] bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : offers && offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card 
              key={offer.id}
              className="overflow-hidden"
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
                >
                  {offer.discount}%
                </Badge>

                {!offer.isActive && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive">غير نشط</Badge>
                  </div>
                )}

                <div className="absolute bottom-0 right-0 left-0 p-4">
                  <h3 className="font-serif font-bold text-xl text-white mb-1">
                    {offer.titleAr}
                  </h3>
                  <p className="text-white/90 text-sm mb-2">
                    {offer.descriptionAr}
                  </p>
                  <p className="text-xs text-white/80">
                    صالح حتى: {new Date(offer.validUntil).toLocaleDateString('ar-DZ')}
                  </p>
                </div>
              </div>
              
              <div className="p-4 flex gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => toggleActive(offer)}
                  data-testid={`button-toggle-active-${offer.id}`}
                >
                  <Tag className="h-4 w-4 ml-1" />
                  {offer.isActive ? "إلغاء التفعيل" : "تفعيل"}
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(offer)}
                  data-testid={`button-edit-${offer.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => deleteMutation.mutate(offer.id)}
                  data-testid={`button-delete-${offer.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">لا توجد عروض</p>
          <p className="text-sm text-muted-foreground mt-2">ابدأ بإضافة عرض جديد</p>
        </Card>
      )}
    </div>
  );
}
