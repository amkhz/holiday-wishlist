import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ItemStatusBadge } from './ItemStatusBadge'
import { EditItemDialog } from './EditItemDialog'
import { Pencil, Trash2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react'
import type { WishlistItem } from '@/types/wishlist'
import { useWishlist } from '@/contexts/WishlistContext'
import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ItemTableProps {
  items: WishlistItem[]
  isAuthenticated: boolean
}

type SortColumn = 'name' | 'description' | 'price' | 'status' | null
type SortDirection = 'asc' | 'desc'

export function ItemTable({ items, isAuthenticated }: ItemTableProps) {
  const { toggleChecked, deleteItem } = useWishlist()
  const [checkingItem, setCheckingItem] = useState<string | null>(null)
  const [checkedByName, setCheckedByName] = useState('')
  const [openCheckDialog, setOpenCheckDialog] = useState(false)
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedItems = useMemo(() => {
    if (!sortColumn) return items

    return [...items].sort((a, b) => {
      let comparison = 0

      switch (sortColumn) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'description':
          comparison = a.description.localeCompare(b.description)
          break
        case 'price':
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0
          comparison = priceA - priceB
          break
        case 'status':
          if (a.is_checked === b.is_checked) {
            comparison = 0
          } else {
            comparison = a.is_checked ? 1 : -1
          }
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [items, sortColumn, sortDirection])

  const handleCheckToggle = async (item: WishlistItem) => {
    if (item.is_checked) {
      await toggleChecked(item.id, false)
    } else {
      setCheckingItem(item.id)
      setOpenCheckDialog(true)
    }
  }

  const handleConfirmCheck = async () => {
    if (checkingItem) {
      await toggleChecked(checkingItem, true, checkedByName || undefined)
      setCheckingItem(null)
      setCheckedByName('')
      setOpenCheckDialog(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id)
    }
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">
              <TableHead className="w-12"></TableHead>
              <TableHead 
                className="min-w-[150px] cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Item Name
                  {sortColumn === 'name' && (
                    sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="hidden md:table-cell min-w-[200px] cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-2">
                  Description
                  {sortColumn === 'description' && (
                    sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="min-w-[100px] cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-2">
                  Price
                  {sortColumn === 'price' && (
                    sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="min-w-[150px]">Links</TableHead>
              <TableHead 
                className="min-w-[120px] cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortColumn === 'status' && (
                    sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              {isAuthenticated && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAuthenticated ? 7 : 6} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <p>No items in the wishlist yet</p>
                    {isAuthenticated && (
                      <p className="text-sm text-gray-400">Click "Add Item" to get started!</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((item, index) => (
                <TableRow 
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                >
                  <TableCell className="py-4">
                    <Checkbox
                      checked={item.is_checked}
                      onCheckedChange={() => handleCheckToggle(item)}
                    />
                  </TableCell>
                  <TableCell className="font-medium py-4">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-md py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-normal break-words">{item.description}</p>
                  </TableCell>
                  <TableCell className="font-semibold py-4">{item.price}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex gap-2">
                      {item.amazon_link && item.amazon_link.trim() && (
                        <a
                          href={item.amazon_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm"
                        >
                          Amazon
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {item.other_retailer_link && item.other_retailer_link.trim() && (
                        <a
                          href={item.other_retailer_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm"
                        >
                          Other
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <ItemStatusBadge item={item} />
                  </TableCell>
                  {isAuthenticated && (
                    <TableCell className="py-4">
                      <div className="flex gap-2">
                        <EditItemDialog item={item} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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

