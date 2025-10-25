# BOX'EAT Restaurant Website

## Overview

BOX'EAT is a full-stack restaurant website built for an Arabic-speaking fast-food establishment. The application provides customers with menu browsing, online ordering, table reservations, and special offers. It includes a complete admin panel for managing menu items, orders, reservations, and promotional offers. The site is designed with RTL (right-to-left) support and follows design principles inspired by leading food delivery and hospitality platforms like Uber Eats, OpenTable, and Deliveroo.

**Latest Updates (October 25, 2025):**
- ✅ Created professional BOX'EAT logo and integrated across all pages
- ✅ Completely redesigned homepage with:
  - Fixed navigation header featuring logo and responsive mobile menu
  - Enhanced hero section with logo display and smooth animations
  - Improved trust indicators and feature cards
  - Contact/footer section with business information
- ✅ Redesigned menu page with:
  - Clean header with back navigation and logo
  - Improved category filtering system
  - Enhanced product cards with hover effects
  - Optimized cart sidebar with better UX
- ✅ Redesigned checkout page with:
  - Professional layout with order summary sidebar
  - Enhanced form fields with icons
  - Improved success states with animations
- ✅ Redesigned reservations page with:
  - Elegant form design with proper field grouping
  - Added informational cards for hours, contact, and capacity
  - Improved mobile responsiveness
- ✅ Enhanced color system with warmer, food-appropriate tones
- ✅ Comprehensive responsive design for mobile, tablet, and desktop
- ✅ Smooth animations throughout using framer-motion
- ✅ Updated all images to use Unsplash CDN for better performance

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component Library:**
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- CVA (Class Variance Authority) for component variant management
- Custom color system derived from brand identity (red, beige, golden yellow)

**State Management:**
- LocalStorage for shopping cart persistence
- React Hook Form with Zod validation for form handling
- Session-based admin authentication state

**Styling & Design:**
- RTL layout support for Arabic content
- Custom fonts: Poppins (headings) and Inter (body text)
- Mobile-first responsive design approach
- Custom CSS variables for theming and dark mode support

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Session management using express-session
- JSON request/response handling with raw body preservation for potential webhook integration

**Data Layer:**
- Drizzle ORM configured for PostgreSQL
- Schema-first approach with Zod validation
- In-memory storage fallback (MemStorage) for development/testing
- Migration support via drizzle-kit

**Database Schema:**
The application uses four primary tables:
- **menu_items**: Product catalog with bilingual content (Arabic/English), pricing, categories, availability flags, and popularity indicators
- **orders**: Customer orders with items JSON, delivery details, status tracking, and timestamps
- **reservations**: Table bookings with customer info, date/time, guest count, special requests, and status
- **offers**: Promotional campaigns with bilingual content, discount percentages, validity periods, and active status

**API Design:**
- RESTful endpoints organized by resource type
- Admin routes protected by session-based authentication
- CRUD operations for all major entities
- Status update endpoints for order and reservation workflow management

**Authentication:**
- Simple code-based admin authentication (single hardcoded admin code)
- Session persistence with configurable secret and cookie settings
- Middleware-based route protection for admin endpoints

### External Dependencies

**Database:**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Connection via DATABASE_URL environment variable
- Session storage via connect-pg-simple for PostgreSQL-backed sessions

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, popovers, etc.)
- Embla Carousel for image/content carousels
- Lucide React for icon library
- date-fns for date formatting and manipulation

**Development Tools:**
- Replit-specific plugins for runtime error handling and development banners
- TypeScript for static type checking
- ESBuild for server-side bundling in production

**Form Handling:**
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for integrating Zod with React Hook Form

**Styling:**
- Tailwind CSS with PostCSS and Autoprefixer
- clsx and tailwind-merge (via cn utility) for conditional class composition

**Seed Data:**
The application includes initial seed data for menu items with pre-generated food photography assets, ensuring the site has content on first deployment.