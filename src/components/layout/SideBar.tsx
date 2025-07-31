'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { useSession } from 'next-auth/react'

const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Search', href: '/dashboard/search' },
    { name: 'Messages', href: '/chat' },
    { name: 'Notifications', href: '/notifications' },
    { name: 'Profile', href: '/' },
]

export default function Sidebar() {
    const { data: session } = useSession()
    const user = session?.user
    const pathname = usePathname()

    return (
        <aside className="bg-[#1a132f] w-[240px] flex flex-col px-4 py-6 border-r border-white/20 min-h-[90vh]">
            {/* Navigation items */}
            <nav className="flex flex-col gap-4">
                {navItems.map(({ name, href }) => {
                    const actualHref = name === 'Profile' ? `/profile/${user?.username}` : href
                    return (
                        <Button
                            key={name}
                            variant="ghost"
                            className={cn(
                                'text-white justify-start h-12 px-4 text-md w-full',
                                pathname === actualHref && 'bg-white font-semibold text-black'
                            )}
                            asChild
                        >
                            <Link href={actualHref}>{name}</Link>
                        </Button>
                    )
                })}
            </nav>

            {/* Settings button pushed to bottom */}
            <div className="mt-auto pt-8">
                <Button
                    variant="ghost"
                    className={cn(
                        'text-white justify-start h-12 px-4 text-md w-full',
                        pathname === '/settings' && 'bg-white font-semibold text-black'
                    )}
                    asChild
                >
                    <Link href="/settings">Settings</Link>
                </Button>
            </div>
        </aside>

    )
}
