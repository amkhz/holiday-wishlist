import { useState } from 'react'
import { ItemCard } from './ItemCard'
import type { WishlistItem } from '@/types/wishlist'

interface ItemCardViewProps {
  items: WishlistItem[]
  isAuthenticated: boolean
}

export function ItemCardView({ items, isAuthenticated }: ItemCardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        <p>No items in the wishlist yet</p>
      </div>
    )
  }

  const currentItem = items[currentIndex]
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < items.length - 1

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm text-gray-500">
        Item {currentIndex + 1} of {items.length}
      </div>
      <ItemCard
        item={currentItem}
        isAuthenticated={isAuthenticated}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </div>
  )
}

