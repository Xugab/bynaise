# by.naise — Toko Online Thrift & Jasa

Website toko online untuk baju thrift, wig styling, nail art, dan ilustrasi.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (JWT)
- **Styling**: Tailwind CSS v4
- **State**: Zustand (cart)
- **Deploy**: Heroku

---

## Setup Lokal (Development)

### 1. Clone & Install
```bash
git clone <repo-url>
cd by-naise
npm install
```

### 2. Buat file `.env.local`
Salin dari `.env.example` dan isi nilai-nilainya:
```bash
cp .env.example .env.local
```

**Nilai yang WAJIB diisi:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bynaise"
AUTH_SECRET="random-string-panjang"
ADMIN_EMAIL="email-kamu@gmail.com"
```

**Generate AUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Setup Database
```bash
# Push schema ke database
npm run db:push

# Isi data awal (kategori, admin, produk contoh)
npm run db:seed
```

### 4. Jalankan development server
```bash
npm run dev
```

Buka http://localhost:3000

### 5. Login sebagai Admin
- Email: sesuai `ADMIN_EMAIL` di `.env.local`
- Password: `admin123`
- **Ganti password setelah login pertama!**

---

## Deploy ke Heroku

### 1. Install Heroku CLI
Download dari https://devcenter.heroku.com/articles/heroku-cli

### 2. Login ke Heroku
```bash
heroku login
```

### 3. Buat app & database
```bash
heroku create nama-app-kamu

# Tambah PostgreSQL (gratis)
heroku addons:create heroku-postgresql:essential-0 --app nama-app-kamu
```

### 4. Set environment variables
```bash
heroku config:set AUTH_SECRET="isi-random-string" --app nama-app-kamu
heroku config:set NEXTAUTH_URL="https://nama-app-kamu.herokuapp.com" --app nama-app-kamu
heroku config:set ADMIN_EMAIL="email-kamu@gmail.com" --app nama-app-kamu
heroku config:set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="cloud_name" --app nama-app-kamu
heroku config:set CLOUDINARY_API_KEY="api_key" --app nama-app-kamu
heroku config:set CLOUDINARY_API_SECRET="api_secret" --app nama-app-kamu
```

> DATABASE_URL sudah otomatis ditambahkan oleh Heroku Postgres

### 5. Deploy
```bash
git init
git add .
git commit -m "initial commit"
heroku git:remote -a nama-app-kamu
git push heroku main
```

### 6. Setup database di Heroku
```bash
heroku run npm run db:push --app nama-app-kamu
heroku run npm run db:seed --app nama-app-kamu
```

### 7. Buka website
```bash
heroku open --app nama-app-kamu
```

---

## Struktur Folder

```
app/
  (auth)/login, register       # Halaman login & register
  products/                    # Katalog & detail produk
  cart/                        # Keranjang belanja
  checkout/                    # Checkout
  admin/                       # Panel admin (protected)
  api/                         # API routes
components/                    # Reusable components
lib/                           # Utilities (prisma, auth, utils)
store/                         # Zustand stores
types/                         # TypeScript types
prisma/                        # Schema & seed database
```

---

## Upload Gambar dengan Cloudinary

1. Daftar gratis di https://cloudinary.com
2. Buka **Media Library**
3. Upload gambar produk
4. Klik kanan gambar → **Copy URL**
5. Paste URL di form tambah produk di admin panel

---

## Menambah Kategori Baru

Buka Prisma Studio:
```bash
npm run db:studio
```

Atau tambah langsung via API (admin only):
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Aksesoris", "slug": "aksesoris"}'
```
  
# by.naise  
