'use client'

import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { signOut, useSession } from 'next-auth/react'
import ShinyText from '../shared/ShinyText/ShinyText'

export default function TopRibbon() {
  const { data: session } = useSession()
  return (
    <div className="w-fullbg-white/10 backdrop-blur-md p-4 rounded text-center font-medium border border-white/20 px-6 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold font-serif text-white">Campus Connect</h1>
      {session ? (
        <>
          <Button variant='ghost' onClick={() => signOut()} className="w-full md:w-auto text-white" >
            Logout
            <LogOut className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <Link href="/sign-in">
          <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
        </Link>
      )}
    </div>
  )
}
