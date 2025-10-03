"use client"
import React from 'react'
import {  SignInButton, SignedIn, SignedOut, UserButton,useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ModeToggle } from '@/components/nav/modetoggle'



export default function TopNav() {
    const{isSignedIn,user}= useUser()
  return (
         <nav className='flex items-center justify-between p-3 shadow '>
            <Link href="/">
            AI
            </Link>
         

              <div className="absolute left-1/2 transform -translate-x-1/2">
    <Link href="/gen-ai" className="font-medium">
      Gen-ai
    </Link>
  </div>

            <div className='flex items-center'>
                {isSignedIn&& (
                    <Link href="/dashborad" className='mr-2'>  {`${user.fullName}'s Dashboard `} </Link>
                )}
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <div className="ml-2">
              <ModeToggle/>
            </div>
            </div>
          </nav>
  
  )
}
