# PawDeal Pet Marketplace Requirements Document

## 1. Application Overview

### 1.1 Application Name
PawDeal

### 1.2 Application Description
A comprehensive pet marketplace platform where users can buy and sell live pets, purchase pet products and accessories, access breed information and educational guides, communicate via direct messaging, view analytics dashboards, and subscribe to paid plans.

### 1.3 Application Type
Web Application (60+ pages)

## 2. Core Features

### 2.1 User System
- Users can be BOTH buyers AND sellers simultaneously with one account
- Users can browse pets and products WITHOUT logging in
- Users CANNOT make any deal (message seller, add to cart, checkout, comment, save favorites) UNLESS logged in
- Logged-out users see \"Login to message seller\" or \"Login to add to cart\" buttons
- After login, users maintain both buyer and seller capabilities in same account
- Dashboard shows different sections based on activity (purchase history + selling analytics)

### 2.2 Pet Listings
- Browse live pets across categories: dogs, cats, fish, birds, small animals, reptiles
- Grid view of pet cards showing photo, name, breed, age, price, seller
- Filter sidebar: breed, age, gender, price range, location
- Sort options: newest, price low-high, price high-low
- Individual pet page with photo gallery carousel, detailed description, health records, seller information card
- Message button and save button only visible to logged-in users
- Related pets section

### 2.3 Product Store
- Purchase pet products and accessories across all pet categories
- Product cards show image, name, price, rating
- Filter by price, brand, rating, pet type
- Individual product page with multiple images, detailed description, specifications, reviews section, related products
- Add to cart only for logged-in users
- Categories: New Arrivals, Sale & Clearance

### 2.4 Breed Directory
- A-Z listing of all pet breeds
- Search and filter breeds by pet type
- Individual breed page includes breed description, care requirements, temperament, health considerations, available pets of this breed, recommended products

### 2.5 Educational Hub
- Pet care guides covering topics like French Bulldog care, Golden Retriever care, Siamese Cat care, new pet owner checklist, training tips, health & nutrition, product buying guides, seasonal pet care
- Blog with articles
- Individual article pages with featured image, author bio, related products, comments section

### 2.6 Comments System
- Users can comment on blog posts, breed guides, pet listings
- Comments show username, avatar, date, content
- Reply to comments with nested replies
- Edit/delete own comments
- Like/unlike comments
- Sort comments by newest, oldest, most liked
- Comment form ONLY visible to logged-in users
- Logged-out users see \"Login to join the discussion\" message

### 2.7 Direct Messaging System (LOGIN REQUIRED)
- Buyers can message sellers from pet listings
- Conversation list with unread badges
- Active conversation panel with timestamps, read receipts, typing indicator simulation
- Message search, block/report user option
- Message bubbles for sent and received messages
- Emoji picker, delete conversation
- Users CANNOT access messages unless logged in

### 2.8 Analytics Dashboard (LOGIN REQUIRED)
- For sellers: stats cards (total profile views, total messages, total favorites, conversion rate), interactive charts (line chart for views over time, bar chart for messages per day, pie chart for traffic sources), recent activity feed, top performing pets list, export data as CSV, PDF report generation
- For buyers: purchase history, saved favorites, recent messages, saved searches

### 2.9 Shopping Cart & Checkout (LOGIN REQUIRED)
- Add to cart functionality only when logged in
- Cart page with line items, update quantity, remove item, subtotal calculation
- Checkout page with shipping information form, payment method (mock), order summary, place order button shows success message
- Logged-out users redirected to login when accessing cart or checkout

### 2.10 Favorites/Wishlist (LOGIN REQUIRED)
- Save pets to favorites and products to wishlist
- Favorites page showing all saved items
- Remove from favorites, move to cart from wishlist
- Heart icons only visible to logged-in users

### 2.11 Pricing & Subscription
- Basic Plan ($9.99/month): 5 pets, basic analytics, standard support
- Pro Plan ($24.99/month): 25 pets, advanced analytics, DM access, featured search, marked as BEST VALUE
- Premium Plan ($49.99/month): unlimited listings, priority support, premium breeder badge, analytics exports
- Annual Discount: 20% off

### 2.12 Search Functionality
- Global search in header across pets, products, breeds, guides, blog
- Real-time search results dropdown
- Search results page with filters
- Recent searches stored in localStorage
- Search suggestions

### 2.13 Community Features
- Success stories gallery
- Events calendar
- Seller directory with individual seller profiles
- Recent comments feed

### 2.14 Authentication System
- User registration with email/password stored in localStorage
- Login/logout functionality
- SAME user account works for buying AND selling
- Protected routes redirect to login (dashboard, messages, cart, checkout)
- Login prompts on action buttons for logged-out users
- Remember me functionality
- Profile editing
- Mock test users: buyer@test.com, seller@test.com, both@test.com (password: password123)

## 3. Complete Page Structure (60+ Pages)

### 3.1 Foundation Pages
- `/` - Homepage
- `/about` - About Us
- `/contact` - Contact Us
- `/faq` - Frequently Asked Questions
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/shipping` - Shipping Policy
- `/returns` - Returns Policy
- `/seller-guidelines` - Seller Guidelines
- `/welfare` - Animal Welfare Promise

### 3.2 Pet Listings Pages
- `/pets` - All Pets Directory (with filters)
- `/pets/dogs` - Dogs Category
- `/pets/cats` - Cats Category
- `/pets/fish` - Fish & Aquatics
- `/pets/birds` - Birds Category
- `/pets/small` - Small Animals
- `/pets/reptiles` - Reptiles Category
- `/breeds` - A-Z Breed Directory
- `/breeds/:breedName` - Individual Breed Page
- `/pet/:id` - Individual Pet Listing Page

### 3.3 Product Store Pages
- `/products` - All Products
- `/products/dogs` - Dog Supplies
- `/products/cats` - Cat Supplies
- `/products/fish` - Fish Supplies
- `/products/birds` - Bird Supplies
- `/products/small` - Small Animal Supplies
- `/products/reptiles` - Reptile Supplies
- `/products/new` - New Arrivals
- `/products/sale` - Sale & Clearance
- `/product/:id` - Individual Product Page

### 3.4 Educational Hub Pages
- `/guides` - All Pet Care Guides
- `/guides/french-bulldog` - French Bulldog Care Guide
- `/guides/golden-retriever` - Golden Retriever Care Guide
- `/guides/siamese-cat` - Siamese Cat Care Guide
- `/guides/new-pet` - New Pet Owner Checklist
- `/guides/training` - Training Tips
- `/guides/health` - Health & Nutrition
- `/guides/buying` - Product Buying Guides
- `/guides/seasonal` - Seasonal Pet Care
- `/blog` - Blog Homepage
- `/blog/:slug` - Individual Blog Post

### 3.5 Community Pages
- `/success-stories` - Happy Tails Gallery
- `/events` - Events Calendar
- `/sellers` - Seller Directory
- `/seller/:id` - Individual Seller Profile
- `/favorites` - Saved Pets & Products (LOGIN REQUIRED)
- `/comments` - Recent Comments Feed

### 3.6 Messaging System Pages (ALL LOGIN REQUIRED)
- `/messages` - Inbox (all conversations)
- `/messages/:id` - Individual Message Thread
- `/messages/new` - Compose New Message

### 3.7 User Dashboard Pages (ALL LOGIN REQUIRED)
- `/dashboard` - Main Dashboard (combined buyer/seller view)
- `/dashboard/buyer` - Buyer Dashboard (purchase history, saved items)
- `/dashboard/seller` - Seller Dashboard (listings, sales, analytics)
- `/dashboard/analytics` - Daily Analytics Overview
- `/dashboard/reports` - Sales Reports
- `/dashboard/messages` - Message Analytics
- `/dashboard/settings` - Account Settings
- `/dashboard/listings` - Manage Pet Listings
- `/dashboard/products` - Manage Product Listings (if seller)

### 3.8 Paid Plans Pages
- `/pricing` - Pricing Plans
- `/upgrade` - Upgrade Account
- `/premium` - Premium Breeder Program

### 3.9 Auth & Utility Pages
- `/login` - Login Page
- `/register` - Register Page
- `/cart` - Shopping Cart (LOGIN REQUIRED)
- `/checkout` - Checkout (LOGIN REQUIRED, simulated)
- `/404` - 404 Error Page

## 4. Navigation Requirements

### 4.1 Main Navigation
- ALL navigation links between ALL pages MUST work properly
- NO broken links, NO placeholder links, NO dead ends
- Main navigation menu changes based on login status:
  - Logged out: Home | Pets | Products | Breeds | Guides | Community | Pricing | Login/Register
  - Logged in: Home | Pets | Products | Breeds | Guides | Community | Dashboard | Messages | Logout
- Mobile-responsive hamburger menu
- Breadcrumb navigation on EVERY interior page
- Active page highlighting in navigation
- Footer navigation with ALL section links
- Search bar in header (filters pets/products/guides)
- 404 page with link back to homepage

## 5. Login Gate Requirements

### 5.1 Logged-out Users Can ONLY
- Browse all pets, products, breeds, guides, blog
- View individual listings
- Read comments
- Search

### 5.2 Logged-out Users CANNOT
- Message any seller (button shows \"Login to message\")
- Add to cart (button shows \"Login to shop\")
- Save to favorites (heart shows \"Login to save\")
- Post comments (form shows \"Login to comment\")
- View dashboard
- Access messages
- Complete checkout
- View any protected route (redirects to login)

### 5.3 After Login
- Users gain ALL capabilities immediately with same account

## 6. Color Theme: Ocean Trust Palette

### 6.1 Color Codes
- Deep Ocean: #0A2540
- Tropical Waters: #00A8CC
- Vibrant Reef: #FF6B6B
- Deep Sea: #2C3E50
- Success Green: #27AE60
- Warm Sunlight: #FFD93D
- Clean Foam: #F8F9FA

### 6.2 Color Usage Rules
- Primary buttons: Vibrant Reef with white text
- Secondary buttons: Tropical Waters border with Tropical Waters text, hover fills
- Navigation headers: Deep Ocean with white text
- Footer: Deep Ocean with white text
- Page titles: Deep Ocean font-bold
- Links: Tropical Waters with underline on hover
- Sale badges: Vibrant Reef with white text
- Availability/Verified: Success Green text
- Premium/Featured: Warm Sunlight background with Deep Sea text
- Body text: Deep Sea
- Background: Clean Foam
- Card backgrounds: White

## 7. Technical Requirements

### 7.1 Framework & Libraries
- Framework: React.js (using Vite or Create React App)
- Styling: Tailwind CSS ONLY
- Routing: React Router for navigation between ALL pages
- State Management: React Context API
- Data Persistence: localStorage for mock data, user sessions, cart, favorites
- Charts: Recharts or Chart.js for analytics dashboards
- Icons: React Icons library or Heroicons

### 7.2 Build & Deployment
- Build Output: Must generate static HTML/CSS/JS files
- Deployment: Must work on Netlify, Vercel, or GitHub Pages
- NO backend, NO databases, NO payment processing (simulate everything with mock data)

## 8. Mock Data Requirements

### 8.1 Sample Data
- 50+ sample pets with varied breeds, ages, prices, locations
- 50+ sample products across all categories
- 30+ breeds with detailed information
- 20+ guides on pet care topics
- 20+ blog posts with comments
- 15+ sellers with profiles and listings
- Mock users: buyer@test.com, seller@test.com, both@test.com (all with password \"password123\")

## 9. Responsive Design Requirements

### 9.1 Design Approach
- Mobile-first approach using Tailwind
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile: stacked layout, hamburger menu, touch-friendly buttons
- Tablet: 2-column grids
- Desktop: 3-4 column grids
- Images: responsive with object-fit cover
- No horizontal scroll on any device

## 10. Additional Requirements

### 10.1 UI/UX Features
- Loading skeletons for async operations
- Toast notifications system:
  - Success: Success Green background
  - Error: Vibrant Reef background
  - Warning: Warm Sunlight background
  - Info: Tropical Waters background
- Form validation on ALL forms
- 404 page with cute pet image and link home
- Smooth scrolling
- Back to top button
- \"Login to continue\" modals when logged-out users click protected features

## 11. Testing Requirements

### 11.1 Verification Checklist
- ALL 60+ pages load without errors
- EVERY navigation link works between ALL pages
- Mobile menu works on small screens
- Logged-out users can browse but CANNOT message, cart, favorite, comment
- All protected features show login prompts for logged-out users
- Login works with mock users
- Same account can buy AND sell
- After login, all features unlock immediately
- Search returns results
- Filters work on pet and product pages
- Messaging system works between two logged-in accounts
- Comments can be posted after login
- Dashboard shows analytics for sellers
- Dashboard shows purchase history for buyers
- Pricing page has working plan selection
- Favorites save to localStorage
- 404 page shows for invalid URLs
- All colors match the Ocean Trust palette exactly