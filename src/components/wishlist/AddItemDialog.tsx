import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWishlist } from '@/contexts/WishlistContext'
import { Plus } from 'lucide-react'
import type { WishlistItemForm } from '@/types/wishlist'

export function AddItemDialog() {
  const { addItem } = useWishlist()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<WishlistItemForm>({
    name: '',
    description: '',
    amazon_link: '',
    other_retailer_link: '',
    price: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!formData.name.trim()) {
        throw new Error('Item name is required')
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required')
      }

      await addItem(formData)
      setFormData({
        name: '',
        description: '',
        amazon_link: '',
        other_retailer_link: '',
        price: '',
      })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (value: string) => {
    if (!value) return value
    if (value.startsWith('$')) return value
    return `$${value}`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Add a new item to your wishlist. Item name and description are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Govee Uplighter Floor Lamp"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter a description of the item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              placeholder="e.g., $159.99"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '')
                setFormData({ ...formData, price: formatPrice(value) })
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amazon_link">Amazon Link</Label>
            <Input
              id="amazon_link"
              type="url"
              placeholder="https://www.amazon.com/..."
              value={formData.amazon_link}
              onChange={(e) => setFormData({ ...formData, amazon_link: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other_retailer_link">Other Retailer Link</Label>
            <Input
              id="other_retailer_link"
              type="url"
              placeholder="https://..."
              value={formData.other_retailer_link}
              onChange={(e) => setFormData({ ...formData, other_retailer_link: e.target.value })}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

