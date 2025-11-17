# Holiday Wishlist App

A beautiful, playful React web app for sharing holiday gift wishlists with family and friends. Built with React, TypeScript, Supabase, ShadCN UI, and Tailwind CSS.

## Features

- 🔐 **Email/Password Authentication** - Secure login for list managers
- 📝 **Add, Edit, Delete Items** - Full CRUD operations for authenticated users
- ✅ **Public Check-off** - Anyone can mark items as purchased (no login required)
- 📊 **Table View** - Default view with all items in a sortable table
- 🎴 **Card View** - Beautiful single-item card view with navigation
- 📱 **Mobile Responsive** - Works great on all devices
- 🎨 **Playful UI/UX** - Fun, engaging design with smooth animations
- 🔄 **Real-time Updates** - Changes sync instantly across all users

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Supabase** - Backend (database + authentication)
- **ShadCN UI** - Component library
- **Tailwind CSS** - Styling
- **GitHub Pages** - Hosting

## Setup Instructions

### 1. Prerequisites

- Node.js 20+ installed
- A Supabase account (free tier works)

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd holiday-wishlist
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Authentication > Settings and enable "Email" provider (it's enabled by default)
3. Go to SQL Editor and run this to create the table:

```sql
-- Create wishlist_items table
CREATE TABLE wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  amazon_link TEXT NOT NULL,
  other_retailer_link TEXT NOT NULL,
  price TEXT NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  checked_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read items
CREATE POLICY "Public can read items"
  ON wishlist_items FOR SELECT
  USING (true);

-- Policy: Anyone can update is_checked and checked_by (but not other fields)
CREATE POLICY "Public can update checked status"
  ON wishlist_items FOR UPDATE
  USING (true)
  WITH CHECK (
    OLD.name = NEW.name AND
    OLD.description = NEW.description AND
    OLD.amazon_link = NEW.amazon_link AND
    OLD.other_retailer_link = NEW.other_retailer_link AND
    OLD.price = NEW.price
  );

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert"
  ON wishlist_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update (full update)
CREATE POLICY "Authenticated users can update"
  ON wishlist_items FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete"
  ON wishlist_items FOR DELETE
  USING (auth.role() = 'authenticated');
```

3. Get your project URL and anon key from Settings > API

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Deployment to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Set source to "GitHub Actions"
4. Add secrets in Settings > Secrets and variables > Actions:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Push to `main` branch - deployment will happen automatically!

The workflow is already configured in `.github/workflows/deploy.yml`.

**Note:** Update the `base` path in `vite.config.ts` if your repository name is different from `holiday-wishlist`.

## Project Structure

```
src/
  ├── components/
  │   ├── auth/          # Authentication components
  │   ├── ui/            # ShadCN UI components
  │   └── wishlist/      # Wishlist-specific components
  ├── hooks/             # Custom React hooks
  ├── lib/               # Utilities (Supabase client, etc.)
  └── types/             # TypeScript type definitions
```

## Features in Detail

### Authentication
- Email/Password authentication via Supabase Auth
- Users can sign up or sign in with email and password
- Only authenticated users can add/edit/delete items
- Public users can view and check items

### Views
- **Table View**: Default view showing all items in a table format
- **Card View**: Single item view with previous/next navigation

### Item Management
- Add items with name, description, price, and links
- Edit existing items
- Delete items (with confirmation)
- Check off items (public, no login required)
- Optional name when checking off items

## License

MIT
