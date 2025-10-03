import React from 'react'
import { UserProfile } from '@clerk/nextjs'

export default function settings() {
  return (
    <div className="p-5">
        <UserProfile routing='hash'/>
    </div>
  )
}
