import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table2, LayoutGrid } from 'lucide-react'

interface ViewToggleProps {
  view: 'table' | 'card'
  onViewChange: (view: 'table' | 'card') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <Tabs value={view} onValueChange={(value) => onViewChange(value as 'table' | 'card')}>
      <TabsList>
        <TabsTrigger value="table" className="gap-2">
          <Table2 className="w-4 h-4" />
          Table
        </TabsTrigger>
        <TabsTrigger value="card" className="gap-2">
          <LayoutGrid className="w-4 h-4" />
          Card
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

