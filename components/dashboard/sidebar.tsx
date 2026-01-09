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
  Plus,
  Building,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Moja Firma', href: '/dashboard/company', icon: Building },
  { name: 'Portale', href: '/dashboard/portals', icon: Building2 },
  { name: 'Opinie', href: '/dashboard/reviews', icon: MessageSquare },
  { name: 'Analityka', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Ustawienia', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userPlan, setUserPlan] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .or('status.eq.active,status.eq.trialing')
        .maybeSingle()

      setUserPlan((subscription as any)?.plan || null)
    }

    fetchUserPlan()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        flex flex-col w-64 bg-gray-900 
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
      <div className="flex items-center justify-between h-16 bg-gray-800 px-4">
        <Link href="/dashboard">
          <Image 
            src="/opinieon-logo-sq-new-green.png" 
            alt="opinieOn Logo" 
            width={88} 
            height={88}
          />
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
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
          {userPlan === 'BIZNES' && (
            <Link
              href="/onboarding/pricing"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Plus className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
              Dodaj firmę
            </Link>
          )}
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
    </>
  )
}
