"use client"; 
import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
import { SignInButton,useUser } from '@clerk/nextjs';
import { createCheckoutSession } from '@/app/actions/stripe';
import { useRouter } from 'next/navigation';

export default function PlanCard({name,image}:{name:string,image:string}){
    
    const { isSignedIn,isLoaded} = useUser();   
    const router = useRouter();
    

    const handleCheckout = async () => {
       if(name === "Free"){
        router.push('/dashboard');
        return;
       } else {
        try {
            const response = await createCheckoutSession();
        const {url,error} = response;

        if(error){
            toast.error(error);
            return;
        }
           if(url){
          window.location.href = url;
           }
        } catch (error:any) {
            toast.error("unexpected error occoured please try again");
        }
        }
       }
    
  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg m-4 border'>
      <Image 
      width={100}
      height={100}
       className='m-5 '
       src={image}
       alt='monthly membership'
      ></Image>
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>
            {name} Membership
        </div>
        <p className='text-green-700 dark:text-gray-300 text-base'>
            Enjoy{" "}
             {name == "Free"
             ? "Limited AI genrated Content forever in just $0.00/month"
            : "UnLimited AI genrated Content forever in just $9.99/month"}
            </p>
        <ul className='m-5'>
            <li>♨️{name == "Free" ? "Limited" : "UnLimited"} Word Generation</li>
            <li>🧠 Advanced AI Features </li>
            <li>⛈️ Faster Processing Time</li>
            <li>🛠️{name == "Free" ? " " : "Priority"} coustmer Support </li>
        </ul>
      </div>
      {!isLoaded ? "" : !isSignedIn ? (
        <div className='px-5 pb-10'>
            <Button>
                <SignInButton/>
            </Button>
        </div>  
        ) : (
        <div className='px-5 pb-10'>
            <Button onClick={handleCheckout}>Get Started</Button>
            </div>
      )}
    </div>
  )
}