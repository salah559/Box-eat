import { 
  type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder,
  type Reservation, type InsertReservation,
  type Offer, type InsertOffer
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order | undefined>;
  
  // Reservations
  getAllReservations(): Promise<Reservation[]>;
  getReservation(id: string): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: string, reservation: Partial<Reservation>): Promise<Reservation | undefined>;
  
  // Offers
  getAllOffers(): Promise<Offer[]>;
  getOffer(id: string): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOffer(id: string, offer: Partial<Offer>): Promise<Offer | undefined>;
  deleteOffer(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<string, MenuItem>;
  private orders: Map<string, Order>;
  private reservations: Map<string, Reservation>;
  private offers: Map<string, Offer>;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.reservations = new Map();
    this.offers = new Map();
  }

  // Menu Items
  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = { ...insertItem, id };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: string, updateData: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...updateData };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updateData: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, ...updateData };
    this.orders.set(id, updated);
    return updated;
  }

  // Reservations
  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservation(id: string): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = randomUUID();
    const reservation: Reservation = { 
      ...insertReservation, 
      id,
      createdAt: new Date()
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async updateReservation(id: string, updateData: Partial<Reservation>): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    const updated = { ...reservation, ...updateData };
    this.reservations.set(id, updated);
    return updated;
  }

  // Offers
  async getAllOffers(): Promise<Offer[]> {
    return Array.from(this.offers.values());
  }

  async getOffer(id: string): Promise<Offer | undefined> {
    return this.offers.get(id);
  }

  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const id = randomUUID();
    const offer: Offer = { ...insertOffer, id };
    this.offers.set(id, offer);
    return offer;
  }

  async updateOffer(id: string, updateData: Partial<Offer>): Promise<Offer | undefined> {
    const offer = this.offers.get(id);
    if (!offer) return undefined;
    const updated = { ...offer, ...updateData };
    this.offers.set(id, updated);
    return updated;
  }

  async deleteOffer(id: string): Promise<boolean> {
    return this.offers.delete(id);
  }
}

export const storage = new MemStorage();
