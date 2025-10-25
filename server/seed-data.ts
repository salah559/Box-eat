import { storage } from "./storage";
import type { InsertMenuItem, InsertOffer } from "@shared/schema";

export async function seedData() {
  // Check if data already exists
  const existingItems = await storage.getAllMenuItems();
  if (existingItems.length > 0) {
    console.log("Data already seeded, skipping...");
    return;
  }

  console.log("Seeding initial data...");

  // Menu Items - Using static image paths that will work in both dev and production
  const menuItems: InsertMenuItem[] = [
    {
      name: "Classic Burger",
      nameAr: "برجر كلاسيك",
      description: "Juicy beef patty with fresh vegetables",
      descriptionAr: "لحم بقري طازج مع الخضروات الطازجة",
      price: "450.00",
      category: "برجر",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
      isAvailable: true,
      isPopular: true,
      isNew: false,
    },
    {
      name: "French Fries",
      nameAr: "بطاطا مقلية",
      description: "Crispy golden fries",
      descriptionAr: "بطاطا مقلية ذهبية مقرمشة",
      price: "200.00",
      category: "برجر",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop",
      isAvailable: true,
      isPopular: true,
      isNew: false,
    },
    {
      name: "Chicken Wrap",
      nameAr: "لفائف الدجاج",
      description: "Grilled chicken with fresh vegetables",
      descriptionAr: "دجاج مشوي مع الخضروات الطازجة",
      price: "380.00",
      category: "ساندويتش",
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop",
      isAvailable: true,
      isPopular: false,
      isNew: true,
    },
    {
      name: "Fresh Juice",
      nameAr: "عصير طازج",
      description: "Refreshing natural juice",
      descriptionAr: "عصير طبيعي منعش",
      price: "150.00",
      category: "مشروبات",
      image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=600&fit=crop",
      isAvailable: true,
      isPopular: false,
      isNew: false,
    },
    {
      name: "Chocolate Cake",
      nameAr: "كيك شوكولاتة",
      description: "Rich chocolate dessert",
      descriptionAr: "حلوى شوكولاتة غنية",
      price: "280.00",
      category: "حلويات",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      isAvailable: true,
      isPopular: true,
      isNew: false,
    },
    {
      name: "Fresh Salad",
      nameAr: "سلطة طازجة",
      description: "Mixed green salad with dressing",
      descriptionAr: "سلطة خضراء مشكلة مع الصلصة",
      price: "250.00",
      category: "سلطات",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      isAvailable: true,
      isPopular: false,
      isNew: false,
    },
    {
      name: "Grilled Chicken",
      nameAr: "دجاج مشوي",
      description: "Perfectly grilled chicken pieces",
      descriptionAr: "قطع دجاج مشوية بإتقان",
      price: "420.00",
      category: "برجر",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop",
      isAvailable: true,
      isPopular: true,
      isNew: false,
    },
  ];

  for (const item of menuItems) {
    await storage.createMenuItem(item);
  }

  // Offers - Using static image URLs
  const offers: InsertOffer[] = [
    {
      title: "Burger Combo Deal",
      titleAr: "عرض كومبو برجر",
      description: "Get burger, fries and drink",
      descriptionAr: "احصل على برجر، بطاطا ومشروب",
      discount: 25,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    },
    {
      title: "Dessert Special",
      titleAr: "عرض خاص على الحلويات",
      description: "Special discount on all desserts",
      descriptionAr: "خصم خاص على جميع الحلويات",
      discount: 15,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    },
  ];

  for (const offer of offers) {
    await storage.createOffer(offer);
  }

  console.log("Data seeded successfully!");
}
