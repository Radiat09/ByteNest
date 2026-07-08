# ByteNest

A full-stack electronics e-commerce platform built with Next.js 16 (App Router) frontend and Node.js/Express TypeScript backend.

## Tech Stack

### Frontend (`bikroy-electronics/`)

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript |
| UI | shadcn/ui v4, Tailwind CSS 4 |
| State | Redux Toolkit |
| Auth | NextAuth.js v5 (Credentials + Google) |
| Styling | Tailwind CSS, tw-animate-css |
| Icons | react-icons, lucide-react |
| Carousel | Swiper 14 |
| Forms | react-hook-form |
| Charts | Chart.js, react-chartjs-2 |
| Notifications | sonner |

### Backend (`BikroyElectronics-server-ts/`)

| Category | Technology |
|----------|------------|
| Runtime | Node.js + Express |
| Language | TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Payments | Stripe, COD |
| Validation | Zod |
| File Upload | Cloudinary |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (for payments)

### 1. Clone & Install

```bash
# Clone the repo
git clone <repo-url>
cd Ecomerce

# Install backend dependencies
cd BikroyElectronics-server-ts
npm install

# Install frontend dependencies
cd ../bikroy-electronics
npm install
```

### 2. Environment Variables

#### Backend — `BikroyElectronics-server-ts/.env`

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bytenest
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_ENDPOINT_SECRET=whsec_your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

#### Frontend — `bikroy-electronics/.env.local`

```env
AUTH_SECRET=your_auth_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_preset
```

### 3. Run Development

```bash
# Terminal 1 — Backend
cd BikroyElectronics-server-ts
npm run dev

# Terminal 2 — Frontend
cd bikroy-electronics
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)
Backend API: [http://localhost:3000](http://localhost:3000)

## Project Structure

### Frontend

```
bikroy-electronics/
├── src/
│   ├── app/
│   │   ├── (admin)/admin/          # Admin panel
│   │   │   ├── categories/
│   │   │   ├── coupons/
│   │   │   ├── customers/
│   │   │   ├── flash-sales/
│   │   │   ├── orders/
│   │   │   ├── overview/
│   │   │   ├── products/
│   │   │   └── users/
│   │   ├── (auth)/                 # Login, Register
│   │   ├── (dashboard)/dashboard/  # User dashboard
│   │   │   ├── myaccount/
│   │   │   ├── mycancellations/
│   │   │   └── myorders/
│   │   ├── (main)/                 # Public pages
│   │   │   ├── about/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   ├── payment/
│   │   │   ├── products/
│   │   │   ├── privacy/
│   │   │   ├── terms/
│   │   │   └── wishlist/
│   │   ├── api/auth/[...nextauth]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── layout/                 # Nav, Footer, BottomNav, MainLayout
│   │   └── ui/                     # shadcn/ui + ProductCard
│   ├── lib/                        # api.ts, utils.ts
│   ├── redux/
│   │   ├── features/
│   │   │   ├── cart/
│   │   │   ├── filter/
│   │   │   └── user/
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── auth.ts                     # NextAuth config
│   ├── proxy.ts                    # Route protection (middleware)
│   └── Providers.tsx               # Session + Redux providers
```

### Backend

```
BikroyElectronics-server-ts/
├── src/
│   ├── app/
│   │   ├── config/                 # db.ts, env.ts
│   │   ├── errorHelpers/           # Custom error classes
│   │   ├── helpers/                # Error handlers (Zod, Cast, Duplicate, Validation)
│   │   ├── interfaces/             # TypeScript interfaces
│   │   ├── middlewares/            # Auth, error handler, validation
│   │   ├── modules/
│   │   │   ├── auth/               # Login, register, JWT
│   │   │   ├── cart/               # Add, update, remove items
│   │   │   ├── category/           # CRUD categories
│   │   │   ├── order/              # Orders, payments, Stripe
│   │   │   ├── product/            # CRUD products
│   │   │   ├── user/               # User management
│   │   │   └── wishlist/           # Add/remove wishlist
│   │   ├── routes/
│   │   └── utils/                  # JWT, query builder, response
│   ├── app.ts
│   └── server.ts
```

## Features

### Customer

- Browse products with category filtering and search
- Product details with image gallery and discount badges
- Cart with quantity controls and coupon support
- Wishlist with move-to-cart
- Checkout with billing form + payment selection
- Stripe or Cash on Delivery payment
- Order history and cancellation tracking
- Auth with email/password or Google sign-in

### Admin Dashboard

- Overview stats (revenue, orders, products, users)
- Manage products (add, edit, best sellers)
- Manage categories
- Manage coupons
- Manage flash sales
- View all orders
- View site users and customers

### User Dashboard

- Edit profile (name, email)
- View order history
- View cancellations

## API Routes (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/jwt` | Get JWT token |
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |
| GET | `/products` | List products |
| GET | `/product/count` | Product count |
| GET | `/categories` | List categories |
| GET | `/cart` | Get cart items |
| PUT | `/cart/:id` | Update quantity |
| DELETE | `/cart/:id` | Remove from cart |
| GET | `/wishlist` | Get wishlist |
| POST | `/wishlist` | Add to wishlist |
| DELETE | `/wishlist/:id` | Remove from wishlist |
| GET | `/orders` | Get user orders |
| GET | `/cancelledOrder` | Get cancelled orders |
| GET | `/allOrders` | Admin: all orders |
| GET | `/revenue` | Admin: total revenue |
| GET | `/user/count` | Admin: user count |
| POST | `/payment/create-checkout-session` | Stripe checkout |

## Scripts

### Frontend

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

### Backend

```bash
npm run dev      # Start with nodemon
npm run build    # Compile TypeScript
npm run start    # Run compiled JS
```

## Route Protection

Protected routes are handled via `src/proxy.ts`:

- `/dashboard/*` — requires authentication
- `/admin/*` — requires authentication
- `/checkout/*` — requires authentication
- `/wishlist/*` — requires authentication
- `/cart/*` — requires authentication

## License

Private project.
