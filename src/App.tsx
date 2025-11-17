import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useWishlist } from '@/contexts/WishlistContext'
import { LoginButton } from '@/components/auth/LoginButton'
import { UserMenu } from '@/components/auth/UserMenu'
import { ViewToggle } from '@/components/ui/ViewToggle'
import { ItemTable } from '@/components/wishlist/ItemTable'
import { ItemCardView } from '@/components/wishlist/ItemCardView'
import { AddItemDialog } from '@/components/wishlist/AddItemDialog'
import { Gift, AlertCircle, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { hasSupabaseConfig } from '@/lib/supabase'

function App() {
  console.log('App rendering, hasSupabaseConfig:', hasSupabaseConfig)
  
  const { user, loading: authLoading } = useAuth()
  const { items, loading: itemsLoading, error } = useWishlist()
  const [view, setView] = useState<'table' | 'card'>('table')
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])
  
  console.log('Hooks initialized:', { 
    hasUser: !!user, 
    authLoading, 
    itemsCount: items.length, 
    itemsLoading,
    error 
  })
  
  if (!hasSupabaseConfig) {
    console.log('Showing configuration screen')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-red-600">Configuration Required</h1>
          </div>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">Your app needs Supabase credentials to work properly.</p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="font-semibold mb-2">To fix this:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Create a <code className="bg-gray-200 px-2 py-1 rounded text-sm">.env</code> file in the root of your project</li>
                <li>Add these two lines to the file:
                  <pre className="mt-2 bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`}
                  </pre>
                </li>
                <li>Replace the placeholder values with your actual Supabase credentials</li>
                <li>Get your credentials from your Supabase project: Settings → API</li>
                <li>Restart your development server (stop it with Ctrl+C, then run <code className="bg-gray-200 px-2 py-1 rounded text-sm">npm run dev</code> again)</li>
              </ol>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Need help setting up Supabase? Check the README.md file for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (authLoading) {
    console.log('Showing auth loading screen')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Gift Wishlist
                </h1>
                <p className="text-xs md:text-sm text-gray-600">Share your gift ideas with family and friends</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
              <ViewToggle view={view} onViewChange={setView} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="h-9 w-9"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {user ? (
                <>
                  <AddItemDialog />
                  <UserMenu />
                </>
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {items.length > 0 && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Updated: {(() => {
                const mostRecent = items.reduce((latest, item) => {
                  const itemDate = new Date(item.updated_at)
                  const latestDate = new Date(latest.updated_at)
                  return itemDate > latestDate ? item : latest
                }, items[0])
                const date = new Date(mostRecent.updated_at)
                const now = new Date()
                const diffMs = now.getTime() - date.getTime()
                const diffMins = Math.floor(diffMs / 60000)
                const diffHours = Math.floor(diffMs / 3600000)
                const diffDays = Math.floor(diffMs / 86400000)
                
                if (diffMins < 1) return 'Just now'
                if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
                if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
                if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
              })()}
            </p>
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Getting Started</h2>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Welcome to the Holiday Wishlist! Browse items below, check off items you've purchased, and switch between table and card views. 
            {!user && ' Sign in to add, edit, or delete items.'}
          </p>
        </div>

        {itemsLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading wishlist...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {view === 'table' ? (
              <ItemTable items={items} isAuthenticated={!!user} />
            ) : (
              <ItemCardView items={items} isAuthenticated={!!user} />
            )}
          </div>
        )}

        {!user && items.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700">
              Want to add or edit items? <span className="font-semibold">Sign in</span> to manage the wishlist!
            </p>
          </div>
        )}
      </main>

      <footer className="mt-12 py-6 border-t bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Made with ❤️ for sharing holiday wishes</p>
        </div>
      </footer>
    </div>
  )
}

export default App
