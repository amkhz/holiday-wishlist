import { Badge } from '@/components/ui/badge'
import type { WishlistItem } from '@/types/wishlist'

interface ItemStatusBadgeProps {
  item: WishlistItem
}

export function ItemStatusBadge({ item }: ItemStatusBadgeProps) {
  if (item.is_checked) {
    return (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        ✓ Checked{item.checked_by ? ` by ${item.checked_by}` : ''}
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
      Available
    </Badge>
  )
}

