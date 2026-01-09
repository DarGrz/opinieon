'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Portale', href: '/dashboard/portals', icon: Building2 },
  { name: 'Opinie', href: '/dashboard/reviews', icon: MessageSquare },
  { name: 'Analityka', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Ustawienia', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center justify-center h-16 bg-gray-800 px-4">
        <Link href="/dashboard">
          <Image 
            src="/opinieon-logo-sq-new-green.png" 
            alt="opinieOn Logo" 
            width={88} 
            height={88}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="px-2 pb-4 space-y-2">
          <Link
            href="/onboarding/pricing"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Plus className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
            Dodaj firmę
          </Link>
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
            Wyloguj się
          </button>
        </div>
      </div>
    </div>
  )
}
