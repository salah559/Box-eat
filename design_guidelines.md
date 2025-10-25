# Design Guidelines: BOX'EAT Restaurant Website

## Design Approach

**Selected Approach:** Reference-Based (Food & Hospitality Industry Leaders)

**Primary Inspirations:**
- Uber Eats: Clean card-based menu layouts, intuitive ordering flow
- OpenTable: Professional reservation system with calendar integration
- Deliveroo: Bold hero sections with food photography, clear CTAs
- Chipotle: Streamlined ordering process with visual item selection

**Key Design Principles:**
- Appetizing Visual Hierarchy: Food imagery takes center stage
- Effortless Navigation: Clear paths to order, reserve, or browse
- Trust & Professionalism: Clean design that inspires confidence in food quality
- Mobile-First: Optimized for on-the-go ordering and booking

## Color System (Derived from Logo)

**Primary Palette:**
- Brand Red (#E31E24 or similar from logo): Primary CTAs, headers, active states
- Warm Beige/Cream (#F5E6D3 or similar): Background sections, cards
- Golden Yellow (#F4C430 or similar): Accents, highlights, special offers badges
- Deep Charcoal (#2D2D2D): Primary text, headings
- Soft Gray (#F8F8F8): Alternate backgrounds, subtle dividers
- Pure White (#FFFFFF): Card backgrounds, clean sections

**Color Usage:**
- Hero sections: Red overlays on food imagery with cream text
- Menu items: White cards on beige backgrounds with red price tags
- CTAs: Red primary buttons with yellow hover accents
- Admin panel: Darker scheme with red accents for authority

## Typography System

**Font Families:**
- **Headings:** 'Poppins' (Bold 700, SemiBold 600) - Modern, friendly, professional
- **Body Text:** 'Inter' (Regular 400, Medium 500) - Highly readable, clean
- **Accents/Prices:** 'Poppins' (SemiBold 600) - Emphasis on pricing

**Type Scale:**
- Hero Headline: 3.5rem (56px) desktop / 2.25rem (36px) mobile
- Section Headers: 2.5rem (40px) desktop / 1.875rem (30px) mobile
- Menu Item Titles: 1.5rem (24px)
- Body Text: 1rem (16px)
- Small Text/Labels: 0.875rem (14px)
- Prices: 1.25rem (20px) - Always prominent

**RTL Support:** Full right-to-left layout support for Arabic content with mirrored navigation and layout flows.

## Layout System

**Spacing Primitives:**
Primary units: 2, 4, 6, 8, 12, 16 (Tailwind scale)
- Micro spacing (gaps, padding): 2, 4
- Component spacing: 6, 8
- Section spacing: 12, 16
- Large breakpoints: 20, 24

**Container Strategy:**
- Full-width hero: w-full
- Content sections: max-w-7xl (1280px)
- Menu grids: max-w-6xl (1152px)
- Forms/Checkout: max-w-2xl (672px)

**Grid System:**
- Menu Items: 3 columns desktop (lg:grid-cols-3), 2 tablet (md:grid-cols-2), 1 mobile
- Featured Items: 4 columns desktop for special offers
- Reservation Time Slots: 4-5 columns for time selection
- Admin Dashboard: Flexible 2-3 column layouts

## Component Library

### Navigation
**Main Header:**
- Sticky top navigation with logo left, menu items center, "Order Now" + "Book Table" CTAs right
- Mobile: Hamburger menu with full-screen overlay
- Cart icon with item count badge (red circle with yellow number)
- Language toggle (AR/EN) if needed

### Hero Section
**Restaurant Hero:**
- Full-width section (80vh) with high-quality food photography background
- Red gradient overlay (opacity 60-70%) for text contrast
- Centered headline + subheading + dual CTAs ("Order Now" / "Reserve Table")
- Floating trust indicators below: "Fresh Ingredients" • "Fast Delivery" • "100+ Menu Items"
- Subtle scroll indicator at bottom

### Menu Components
**Menu Item Card:**
- White background with subtle shadow (hover: lift effect)
- Food image top (aspect-ratio 4:3) with "New" or "Popular" badge overlay
- Item name (bold, charcoal)
- Short description (2 lines max, gray text)
- Price in red (right side) with "Add to Cart" button (red, yellow hover)
- Dietary icons (vegetarian, spicy, etc.) below description

**Category Navigation:**
- Horizontal scroll tabs: "Burgers" "Sandwiches" "Salads" "Drinks" "Desserts"
- Active category: red underline, bold text
- Sticky below main header when scrolling

### Ordering Flow
**Shopping Cart Panel:**
- Slide-in from right (RTL: from left)
- Item list with thumbnail, name, quantity controls, price
- Subtotal, delivery fee, total in distinct sections
- Red "Checkout" button at bottom
- Empty state: Friendly illustration + "Your cart is empty" message

**Checkout Form:**
- Single-column layout, max-width container
- Sections: Contact Info, Delivery Address, Payment Method, Order Summary
- Clear field labels, validation messages in red
- Progress indicator at top (3 steps)

### Reservation System
**Table Booking Component:**
- Date picker: Calendar view (red highlights for selected date)
- Party size: Visual selector (1-10+ people with icons)
- Time slots: Grid of available times (disabled if unavailable)
- Special requests: Text area for dietary needs, celebrations
- Confirmation summary card before submission
- Success state: Confirmation number + calendar add option

### Special Offers Section
**Promotions Display:**
- 2-column layout (desktop), 1-column (mobile)
- Large cards with food imagery, yellow "Limited Time" ribbon
- Discount percentage in red circle badge
- "Order Now" CTA overlaid on image (blurred background button)
- Countdown timer for time-sensitive offers

### Admin Panel
**Dashboard Overview:**
- Dark theme: Charcoal backgrounds (#1F1F1F) with red accents
- Sidebar navigation: Dashboard, Menu, Orders, Reservations, Offers, Settings
- Header: "Admin Panel" + logout button
- Stats cards: Today's Orders, Pending Reservations, Total Revenue (red backgrounds with white text)
- Recent activity feed on right

**Menu Management:**
- Table view with inline editing
- Add/Edit modal: Image upload, name, description, price, category, availability toggle
- Drag-and-drop reordering
- Bulk actions: Enable/Disable, Delete

**Orders Dashboard:**
- Status tabs: New, Preparing, Ready, Delivered
- Order cards with: Order number, customer info, items list, total, timestamp
- Action buttons: Accept, Reject, Mark Ready, Complete
- Filter by date, status, customer

**Reservations Calendar:**
- Monthly/weekly/daily views
- Color-coded by status: Pending (yellow), Confirmed (green), Cancelled (gray)
- Click to view/edit details
- Capacity management per time slot

## Images Strategy

**Required Images:**

1. **Hero Section:**
   - Large, high-quality hero image (1920x1080px minimum)
   - Showcase signature dish or appetizing food spread
   - Professional food photography with garnish, steam effects
   - Warm lighting, shallow depth of field

2. **Menu Items:**
   - Each menu item needs professional photo (800x600px)
   - Consistent styling: white/neutral backgrounds or plated presentation
   - Top-down or 45-degree angle shots
   - At least 50-100 food images for comprehensive menu

3. **About Section:**
   - Restaurant interior/ambiance photo
   - Chef or staff photo (humanize brand)
   - Kitchen cleanliness/preparation shots for trust

4. **Promotional Banners:**
   - Seasonal offers: 1200x600px banners
   - Special dishes with promotional overlay text

5. **Admin Panel:**
   - Placeholder images for items without photos
   - Dashboard graphs/charts (can use libraries)

**Image Placement:**
- Hero: Full-width, full-height background
- Menu cards: Top position, maintaining aspect ratio
- Offers: Large background with overlay gradient
- About: Side-by-side with text content

## Animation & Interactions

**Minimal, Purposeful Animations:**
- Menu item cards: Gentle lift on hover (translateY: -4px)
- Cart addition: Brief scale pulse + success checkmark
- Page transitions: Subtle fade-in for route changes
- Loading states: Skeleton screens for menu items
- Toast notifications: Slide-in from top for order confirmations

**No Distracting Effects:**
- Avoid parallax scrolling
- Skip scroll-triggered animations
- Minimize motion for accessibility

## Accessibility Standards

- WCAG AA contrast ratios (red on white, charcoal on cream)
- Focus indicators: 3px red outline for keyboard navigation
- Form validation: Icon + text error messages
- Alt text for all food images
- Screen reader announcements for cart updates
- Touch targets minimum 44x44px (mobile)

## Responsive Breakpoints

- Mobile: 320px - 767px (single column, stacked layout)
- Tablet: 768px - 1023px (2 columns for menu)
- Desktop: 1024px+ (3 columns, full navigation)
- Large Desktop: 1280px+ (max-width containers, generous spacing)

---

**Design Deliverable Summary:**
A visually appetizing, conversion-optimized restaurant website that balances bold food imagery with clean, functional interfaces. The design system draws from successful food delivery platforms while incorporating BOX'EAT's brand colors (red, beige, yellow) to create a unique, professional identity that builds trust and encourages online orders and reservations.