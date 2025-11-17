import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ItemStatusBadge } from './ItemStatusBadge'
import { EditItemDialog } from './EditItemDialog'
import { Trash2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import type { WishlistItem } from '@/types/wishlist'
import { useWishlist } from '@/contexts/WishlistContext'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ItemCardProps {
  item: WishlistItem
  isAuthenticated: boolean
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export function ItemCard({
  item,
  isAuthenticated,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ItemCardProps) {
  const { toggleChecked, deleteItem } = useWishlist()
  const [checkedByName, setCheckedByName] = useState('')
  const [openCheckDialog, setOpenCheckDialog] = useState(false)

  const handleCheckToggle = async () => {
    if (item.is_checked) {
      await toggleChecked(item.id, false)
    } else {
      setOpenCheckDialog(true)
    }
  }

  const handleConfirmCheck = async () => {
    await toggleChecked(item.id, true, checkedByName || undefined)
    setCheckedByName('')
    setOpenCheckDialog(false)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem(item.id)
    }
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{item.name}</CardTitle>
              <CardDescription className="text-base">{item.description}</CardDescription>
            </div>
            <ItemStatusBadge item={item} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`check-${item.id}`}
                checked={item.is_checked}
                onCheckedChange={handleCheckToggle}
              />
              <label
                htmlFor={`check-${item.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark as purchased
              </label>
            </div>
          </div>

          {item.price && item.price.trim() && (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{item.price}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            {item.amazon_link && item.amazon_link.trim() && (
              <a
                href={item.amazon_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <span>View on Amazon</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {item.other_retailer_link && item.other_retailer_link.trim() && (
              <a
                href={item.other_retailer_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <span>View on Other Retailer</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {isAuthenticated && (
            <div className="flex gap-2 pt-4 border-t">
              <EditItemDialog item={item} />
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Item
              </Button>
            </div>
          )}

          {(hasPrevious || hasNext) && (
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openCheckDialog} onOpenChange={setOpenCheckDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check off item</DialogTitle>
            <DialogDescription>
              Optional: Enter your name so others know who purchased this item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your name (optional)</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={checkedByName}
                onChange={(e) => setCheckedByName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmCheck()
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenCheckDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmCheck}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

