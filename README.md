# Next.js + Supabase + Stripe Ecommerce

Complete starter for WooCommerce-style ecommerce app.

## Features
- Home, Shop, Product detail, Cart, Checkout
- Categories and subcategories
- Products with variations, variation price, stock, image
- Gallery images
- Reviews
- Orders, payments, users tables
- Admin dashboard routes
- Stripe Checkout + webhook starter
- Supabase database schema

## Setup
1. `npm install`
2. Create Supabase project.
3. Run `supabase/schema.sql` in Supabase SQL editor.
4. Create `.env.local` from `.env.example`.
5. Add Supabase URL, anon key, service role key, Stripe secret.
6. Run `npm run dev`.

## Admin
Open `/admin`. You can expand CRUD forms in `/app/admin/products`, `/categories`, `/orders`, `/users`, `/reviews`.

## Important
This is a complete starter structure, not a production-hardened marketplace. Before live launch add RLS policies, real cart logic, shipping, taxes, order email notifications, and full admin CRUD forms.
# ecommerce-web-app
