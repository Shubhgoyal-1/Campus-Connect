'use client'
import { signInSchema } from '@/schemas/signInSchema'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import Silk from '@/components/shared/Silk'
import Link from 'next/link'
import {BookOpen,Mail,Lock,EyeOff,Eye, Loader2} from 'lucide-react'

const page = () => {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting },
    } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            identifier: data.identifier,
            password: data.password,
            redirect: false
        })
        console.log(result)
        if (result?.error) {
            toast.error('Something Went Wrong / Login Failed' + result.error)
        }
        if (result?.url) {
            router.replace('/sign-in');
        }
    }
    return (
         <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0} rotation={0.2} />

      {/* Form */}
      <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center mb-8">
              <BookOpen className="h-12 w-12 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-white">Campus Connect</span>
            </Link>
            <h2 className="text-3xl font-bold text-white">Welcome back!</h2>
            <p className="mt-2 text-gray-300">Sign in to your account</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
          {/*Actual Form Starts From Here */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-white mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-300" />
                  <input
                    id="identifier"
                    type="text"
                    {...register('identifier')}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 bg-white/10 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email/username"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-sm text-red-300 mt-1">{errors.identifier.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-300" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="w-full pl-10 pr-12 py-3 border border-white/20 bg-white/10 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 h-5 w-5 text-gray-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-300 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-300 hover:text-purple-100 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                 {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link
                  href="/sign-up"
                  className="text-purple-300 hover:text-purple-100 font-semibold transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default page