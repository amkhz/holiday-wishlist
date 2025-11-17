import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { WishlistItem, WishlistItemForm } from '@/types/wishlist'

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  error: string | null
  fetchItems: () => Promise<void>
  addItem: (item: WishlistItemForm) => Promise<WishlistItem | null>
  updateItem: (id: string, updates: Partial<WishlistItemForm>) => Promise<WishlistItem | null>
  deleteItem: (id: string) => Promise<void>
  toggleChecked: (id: string, isChecked: boolean, checkedBy?: string) => Promise<WishlistItem | null>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('wishlist_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setItems(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
      console.error('Error fetching items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    fetchItems().catch((err) => {
      console.error('Error in fetchItems:', err)
    })

    try {
      const channel = supabase
        .channel('wishlist_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wishlist_items',
          },
          () => {
            if (mounted) {
              fetchItems().catch((err) => {
                console.error('Error in fetchItems (realtime):', err)
              })
            }
          }
        )
        .subscribe()

      return () => {
        mounted = false
        if (channel) {
          supabase.removeChannel(channel)
        }
      }
    } catch (err) {
      console.error('Error setting up realtime subscription:', err)
      return () => {
        mounted = false
      }
    }
  }, [])

  const addItem = async (item: WishlistItemForm) => {
    try {
      const { data, error: addError } = await supabase
        .from('wishlist_items')
        .insert([item])
        .select()
        .single()

      if (addError) throw addError

      if (data) {
        setItems((prevItems) => [data, ...prevItems])
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item'
      setError(errorMessage)
      throw err
    }
  }

  const updateItem = async (id: string, updates: Partial<WishlistItemForm>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('wishlist_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      if (data) {
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? data : item))
        )
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item'
      setError(errorMessage)
      throw err
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item'
      setError(errorMessage)
      throw err
    }
  }

  const toggleChecked = async (id: string, isChecked: boolean, checkedBy?: string) => {
    try {
      const { data, error: toggleError } = await supabase
        .from('wishlist_items')
        .update({
          is_checked: isChecked,
          checked_by: isChecked ? checkedBy || null : null,
        })
        .eq('id', id)
        .select()
        .single()

      if (toggleError) throw toggleError

      if (data) {
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? data : item))
        )
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle checked status'
      setError(errorMessage)
      throw err
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        error,
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
        toggleChecked,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

