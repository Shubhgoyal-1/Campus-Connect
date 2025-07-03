'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { verifyOtpSchema } from '@/schemas/verifyOtpSchema'
import { toast } from 'sonner'
import Silk from '@/components/shared/Silk'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react'


const page = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: ''
    }
  })
  const onSubmit = async (data: z.infer<typeof verifyOtpSchema>) => {
    try {
      const response = await axios.post('/api/verify-otp', {
        username: params?.username as string,
        otp: data.otp,
      })

      toast.success(response.data.message)
      router.replace('/sign-in');

    } catch (error) {
      console.log("Error is Signup Of User : " + error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message ?? "an error occured"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
      </div>

      <div className="relative z-10 flex justify-center items-center h-screen p-4">
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 w-full max-w-md">
          <h2 className="text-white text-2xl font-bold text-center mb-6">Verify Your Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input
              {...register('otp')}
              placeholder="Enter verification code"
              className="w-full px-4 py-3 rounded bg-white/10 text-white border border-white/20 placeholder-gray-300"
            />
            {errors.otp && <p className="text-sm text-red-300 mt-1">{errors.otp.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{isSubmitting ? 'Verifying...' : 'Verify'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page