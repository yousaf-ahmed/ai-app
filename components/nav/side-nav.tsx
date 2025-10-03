"use client"
import React from 'react'
import {LayoutDashboard,FileClock,WalletCards, Settings} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Usage from './usage'
import SignUpModal from '../modal/sign-up-modal'

export default function SideNav() {
    const Path = usePathname()
    const menu = [
        {
             name:'Dashboard',
             icon:LayoutDashboard,
             path:'/dashboard'
        },
        {
            name:'History',
            icon:FileClock,
            path:'/dashboard/history'
       },
       {
        name:'Billings',
        icon:WalletCards,
        path:'/dashboard/Billings'
   },
   {
    name:'Settings',
    icon:Settings,
    path:'/dashboard/Settings'
},
    ]
  return (
   <div className='flex flex-col h-full'>
     <ul className='flex-1 space-y-2'>
      {menu.map((item,index)=>(
        <li
        key={index} className={`${Path === item.path ?
       "border-primary text-primary" : 
      "border hover:border-primary hover:text-primary`}>"}
      flex m-2 mr-2 p-2 rounded-lg cursor-pointer`}>
       <div className='flex justify-center item-center md:justify-start w-full'>
       <Link href={item.path} className='flex'>
            <item.icon/> <span className='ml-2 hidden md:inline'>{item.name}</span>
       </Link>
        </div>
      </li>
    ))}
    </ul>
      <div className='pb-20 mt-72'>
        <Usage />
        <SignUpModal/> 
      </div>
   </div>
  )
}
