# ByteNest — Frontend

Next.js 16 e-commerce frontend for ByteNest electronics store.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript |
| UI | shadcn/ui v4, Tailwind CSS 4 |
| State | Redux Toolkit |
| Auth | NextAuth.js v5 (Credentials + Google) |
| Carousel | Swiper 14 |
| Forms | react-hook-form |
| Charts | Chart.js, react-chartjs-2 |
| Notifications | sonner |

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see backend repo)

### Install

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
AUTH_SECRET=your_auth_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> Image uploads are handled server-side by the backend. No Cloudinary keys needed on the frontend.

### Run

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (admin)/admin/          # Admin panel pages
│   ├── (auth)/                 # Login, Register
│   ├── (dashboard)/dashboard/  # User dashboard
│   ├── (main)/                 # Public pages
│   ├── api/auth/[...nextauth]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/      # Nav, Footer, BottomNav, MainLayout
│   └── ui/          # shadcn/ui + ProductCard + ImageUpload
├── lib/             # api.ts, utils.ts
├── redux/
│   ├── features/    # cart, filter, user slices
│   ├── hooks.ts
│   └── store.ts
├── auth.ts          # NextAuth config
├── proxy.ts         # Route protection
└── Providers.tsx    # Session + Redux providers
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero banner, flash sale, categories, best sellers |
| `/products` | Product listing with filters |
| `/products/[id]` | Product detail with image gallery |
| `/cart` | Shopping cart with coupon |
| `/wishlist` | Saved products |
| `/checkout` | Billing form + payment selection |
| `/payment/success` | Payment success |
| `/payment/failed` | Payment failed |
| `/payment/cancel` | Payment cancelled |
| `/login` | Login (email + Google) |
| `/register` | Registration |
| `/dashboard/myaccount` | Edit profile |
| `/dashboard/myorders` | Order history |
| `/dashboard/mycancellations` | Cancelled orders |
| `/admin/overview` | Admin dashboard stats |
| `/admin/products/new` | Add product (with ImageUpload) |
| `/admin/products/bestsellings` | Best sellers |
| `/admin/categories` | Manage categories |
| `/admin/coupons` | Manage coupons |
| `/admin/flash-sales` | Flash sale management |
| `/admin/orders` | All orders |
| `/admin/users` | Site users |
| `/admin/customers` | Customers list |
| `/about` | About us |
| `/contact` | Contact form |
| `/faq` | FAQ accordion |
| `/terms` | Terms & conditions |
| `/privacy` | Privacy policy |

## Route Protection

Protected routes via `src/proxy.ts`:

- `/dashboard/*` — auth required
- `/admin/*` — auth required
- `/checkout/*` — auth required
- `/wishlist/*` — auth required
- `/cart/*` — auth required

## License

Private project.
