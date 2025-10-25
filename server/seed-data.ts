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

  // Menu Items
  const menuItems: InsertMenuItem[] = [
    {
      name: "Classic Burger",
      nameAr: "برجر كلاسيك",
      description: "Juicy beef patty with fresh vegetables",
      descriptionAr: "لحم بقري طازج مع الخضروات الطازجة",
      price: "450.00",
      category: "برجر",
      image: "/attached_assets/generated_images/Gourmet_burger_food_photography_93147261.png",
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
      image: "/attached_assets/generated_images/Golden_french_fries_photography_5ed2fd49.png",
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
      image: "/attached_assets/generated_images/Chicken_wrap_sandwich_photography_8721a98b.png",
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
      image: "/attached_assets/generated_images/Refreshing_beverage_photography_6b823fc0.png",
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
      image: "/attached_assets/generated_images/Chocolate_dessert_photography_821a184d.png",
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
      image: "/attached_assets/generated_images/Fresh_salad_photography_3edf5ee5.png",
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
      image: "/attached_assets/generated_images/Grilled_chicken_photography_8ab6d707.png",
      isAvailable: true,
      isPopular: true,
      isNew: false,
    },
  ];

  for (const item of menuItems) {
    await storage.createMenuItem(item);
  }

  // Offers
  const offers: InsertOffer[] = [
    {
      title: "Burger Combo Deal",
      titleAr: "عرض كومبو برجر",
      description: "Get burger, fries and drink",
      descriptionAr: "احصل على برجر، بطاطا ومشروب",
      discount: 25,
      image: "/attached_assets/generated_images/Gourmet_burger_food_photography_93147261.png",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    },
    {
      title: "Dessert Special",
      titleAr: "عرض خاص على الحلويات",
      description: "Special discount on all desserts",
      descriptionAr: "خصم خاص على جميع الحلويات",
      discount: 15,
      image: "/attached_assets/generated_images/Chocolate_dessert_photography_821a184d.png",
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    },
  ];

  for (const offer of offers) {
    await storage.createOffer(offer);
  }

  console.log("Data seeded successfully!");
}
