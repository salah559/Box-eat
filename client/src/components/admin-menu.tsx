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
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMenuItemSchema } from "@shared/schema";
import type { InsertMenuItem, MenuItem } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import burgerImage from "@assets/generated_images/Gourmet_burger_food_photography_93147261.png";
import friesImage from "@assets/generated_images/Golden_french_fries_photography_5ed2fd49.png";
import wrapImage from "@assets/generated_images/Chicken_wrap_sandwich_photography_8721a98b.png";
import drinkImage from "@assets/generated_images/Refreshing_beverage_photography_6b823fc0.png";
import dessertImage from "@assets/generated_images/Chocolate_dessert_photography_821a184d.png";
import saladImage from "@assets/generated_images/Fresh_salad_photography_3edf5ee5.png";
import chickenImage from "@assets/generated_images/Grilled_chicken_photography_8ab6d707.png";

const foodImages = [burgerImage, friesImage, wrapImage, drinkImage, dessertImage, saladImage, chickenImage];

export function AdminMenu() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const form = useForm<InsertMenuItem>({
    resolver: zodResolver(insertMenuItemSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: "0",
      category: "برجر",
      image: burgerImage,
      isAvailable: true,
      isPopular: false,
      isNew: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertMenuItem) => {
      return await apiRequest("POST", "/api/menu", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({ title: "تمت الإضافة بنجاح" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MenuItem> }) => {
      return await apiRequest("PATCH", `/api/menu/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({ title: "تم التحديث بنجاح" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/menu/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({ title: "تم الحذف بنجاح" });
    },
  });

  const onSubmit = (data: InsertMenuItem) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const toggleAvailability = (item: MenuItem) => {
    updateMutation.mutate({
      id: item.id,
      data: { isAvailable: !item.isAvailable },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold">إدارة القائمة</h2>
          <p className="text-muted-foreground">إضافة وتعديل وحذف الوجبات</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingItem(null);
                form.reset();
              }}
              data-testid="button-add-menu-item"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة وجبة جديدة
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingItem ? "تعديل الوجبة" : "إضافة وجبة جديدة"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nameAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم (عربي)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-name-ar" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم (إنجليزي)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-name-en" />
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعر (دج)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" data-testid="input-price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الفئة</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            data-testid="select-category"
                          >
                            <option value="برجر">برجر</option>
                            <option value="ساندويتش">ساندويتش</option>
                            <option value="سلطات">سلطات</option>
                            <option value="مشروبات">مشروبات</option>
                            <option value="حلويات">حلويات</option>
                          </select>
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
                      <div className="grid grid-cols-4 gap-2">
                        {foodImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => field.onChange(img)}
                            className={`border-2 rounded-md overflow-hidden ${field.value === img ? 'border-primary' : 'border-border'}`}
                            data-testid={`button-image-${idx}`}
                          >
                            <img src={img} alt="" className="w-full h-20 object-cover" />
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between border rounded-md p-3">
                        <FormLabel className="mb-0">متاح للطلب</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPopular"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between border rounded-md p-3">
                        <FormLabel className="mb-0">وجبة مميزة</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between border rounded-md p-3">
                        <FormLabel className="mb-0">وجبة جديدة</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-menu-item"
                >
                  {editingItem ? "تحديث" : "إضافة"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : menuItems && menuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden"
              data-testid={`card-menu-item-${item.id}`}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.nameAr}
                  className="w-full h-full object-cover"
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">غير متاح</Badge>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif font-semibold text-lg">
                    {item.nameAr}
                  </h3>
                  <div className="flex gap-1">
                    {item.isPopular && <Badge variant="default">مميز</Badge>}
                    {item.isNew && <Badge variant="secondary">جديد</Badge>}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {item.descriptionAr}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-primary font-serif">
                    {item.price} دج
                  </span>
                  <Badge variant="outline">{item.category}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleAvailability(item)}
                    data-testid={`button-toggle-availability-${item.id}`}
                  >
                    {item.isAvailable ? (
                      <><Eye className="h-4 w-4 ml-1" /> متاح</>
                    ) : (
                      <><EyeOff className="h-4 w-4 ml-1" /> غير متاح</>
                    )}
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    data-testid={`button-edit-${item.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() => deleteMutation.mutate(item.id)}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">لا توجد وجبات في القائمة</p>
          <p className="text-sm text-muted-foreground mt-2">ابدأ بإضافة وجبة جديدة</p>
        </Card>
      )}
    </div>
  );
}
