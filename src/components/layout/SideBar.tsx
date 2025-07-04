'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { useSession } from 'next-auth/react'

const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Search', href: '/dashboard/search' },
    { name: 'Messages', href: '/messages' },
    { name: 'Notifications', href: '/notifications' },
    { name: 'Profile', href: '/' },
]

export default function Sidebar() {
    const { data: session } = useSession()
    const user = session?.user

    const pathname = usePathname()

    return (
        <aside className="bg-white/10 backdrop-blur-md p-4 rounded text-center font-medium border border-white/20 w-[240px] min-h-screen py-8 px-4 flex flex-col">
            <nav className="flex flex-col gap-4">

                {navItems.map(({ name, href }) => {
                    const actualHref = name==='Profile' ? `/profile/${user?.username}` : href
                    return (
                        <Button key={name} variant="ghost" className={cn('text-white h-15 text-md',
                            pathname === actualHref && 'bg-white font-semibold text-black'
                        )}>
                            <Link
                                href={actualHref}
                            >
                                {name}
                            </Link>
                        </Button>
                        )
                }
                )}
            </nav>
        </aside>
    )
}
