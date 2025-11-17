export interface WishlistItem {
  id: string
  name: string
  description: string
  amazon_link: string
  other_retailer_link: string
  price: string
  is_checked: boolean
  checked_by: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email?: string
  name?: string
  avatar_url?: string
}

export interface WishlistItemForm {
  name: string
  description: string
  amazon_link: string
  other_retailer_link: string
  price: string
}

