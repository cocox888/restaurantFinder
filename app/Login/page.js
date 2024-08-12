"use client"
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function Login() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        console.log("session:", session);
        if (session?.user) {
            router.push("/");
        }
    }, [session, router])

    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-purple-500 p-4'>
            <div className='bg-white rounded-lg shadow-2xl p-8 max-w-md w-full'>
                <div className='flex flex-col items-center mb-8'>
                    <Image src='/logo.png' alt='logo' width={120} height={120} className='mb-4' />
                    <h1 className='text-3xl font-bold text-gray-800 mb-2 text-center'>Welcome to RestaurantFinder</h1>
                    <p className='text-gray-600 text-center'>Discover amazing restaurants in your area!</p>
                </div>

                <button
                    type="button"
                    onClick={() => signIn()}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`w-full bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center justify-center transition-all duration-300 ease-in-out ${
                        isHovered ? 'shadow-lg scale-105' : 'shadow'
                    }`}
                >
                    <svg className="mr-2 -ml-1 w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Sign up with Google
                </button>

            </div>
        </div>
    )
}

export default Login