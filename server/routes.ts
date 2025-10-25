import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { 
  insertMenuItemSchema, 
  insertOrderSchema, 
  insertReservationSchema,
  insertOfferSchema 
} from "@shared/schema";

const ADMIN_CODE = "Hichamdb";

declare module 'express-session' {
  interface SessionData {
    isAdmin: boolean;
  }
}

// Middleware to check admin authentication
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "boxeat-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Admin login
  app.post("/api/admin/login", (req, res) => {
    const { code } = req.body;
    if (code === ADMIN_CODE) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid code" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.json({ success: true });
      }
    });
  });

  // Check admin session
  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });
  // Menu Items Routes
  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getAllMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu", requireAdmin, async (req, res) => {
    try {
      const validated = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validated);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid menu item data" });
    }
  });

  app.patch("/api/menu/:id", requireAdmin, async (req, res) => {
    try {
      const item = await storage.updateMenuItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.delete("/api/menu/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteMenuItem(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  // Orders Routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validated = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validated);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.patch("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // Reservations Routes
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });

  app.get("/api/reservations/:id", async (req, res) => {
    try {
      const reservation = await storage.getReservation(req.params.id);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservation" });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const validated = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validated);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ error: "Invalid reservation data" });
    }
  });

  app.patch("/api/reservations/:id", requireAdmin, async (req, res) => {
    try {
      const reservation = await storage.updateReservation(req.params.id, req.body);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: "Failed to update reservation" });
    }
  });

  // Offers Routes
  app.get("/api/offers", async (req, res) => {
    try {
      const offers = await storage.getAllOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch offers" });
    }
  });

  app.get("/api/offers/:id", async (req, res) => {
    try {
      const offer = await storage.getOffer(req.params.id);
      if (!offer) {
        return res.status(404).json({ error: "Offer not found" });
      }
      res.json(offer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch offer" });
    }
  });

  app.post("/api/offers", requireAdmin, async (req, res) => {
    try {
      const validated = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer(validated);
      res.status(201).json(offer);
    } catch (error) {
      res.status(400).json({ error: "Invalid offer data" });
    }
  });

  app.patch("/api/offers/:id", requireAdmin, async (req, res) => {
    try {
      const offer = await storage.updateOffer(req.params.id, req.body);
      if (!offer) {
        return res.status(404).json({ error: "Offer not found" });
      }
      res.json(offer);
    } catch (error) {
      res.status(500).json({ error: "Failed to update offer" });
    }
  });

  app.delete("/api/offers/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteOffer(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Offer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete offer" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
