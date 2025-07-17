'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signUpSchema } from '@/schemas/signUpSchema'
import * as z from 'zod'
import Silk from '@/components/shared/Silk'
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { skillList } from '@/lib/SkillSet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import SkillCard from '@/components/user/SkillCard'

const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            college: '',
            skills: [],
            bio: '',
        },
    })
    const debounced = useDebounceCallback(setUsername, 500)
    const router = useRouter()

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    console.log("Sending username:", username)
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    console.log(response.data.message)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    console.log("Sending username:", username)
                    const axiosError = error as AxiosError<ApiResponse>
                    console.log(axiosError.response?.data.message)
                    setUsernameMessage(axiosError.response?.data.message || 'Error Checking Username')
                }
                finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const selectedSkills = watch('skills') || []

    const toggleSkill = (skill: string) => {
        const updated = selectedSkills.includes(skill)
            ? selectedSkills.filter((s) => s !== skill)
            : [...selectedSkills, skill]
        setValue('skills', updated, { shouldValidate: true })
        console.log(updated)
    }

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast.success(response.data.message)
            router.replace(`/verify/${username}`)

        } catch (error) {
            console.log("Error is Signup Of User : " + error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div className="fixed inset-0 -z-10">
                <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-4 p-6 md:p-16 justify-center items-stretch">
                {/* Left side - Form */}
                <div className="bg-white/10 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/20 w-full md:w-1/2 space-y-4 min-h-[700px]">
                    <h2 className="text-white text-3xl font-bold text-center mb-6 drop-shadow-sm tracking-wide">
                        Create Your Account
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                        <div>
                            <input
                                {...register('username')}
                                onChange={(e) => debounced(e.target.value)}
                                placeholder="Username"
                                className="w-full px-4 py-4 rounded bg-white/10 text-white border border-white/20 placeholder-gray-300"
                            />
                            {isCheckingUsername && <Loader2 className="animate-spin text-white mt-2" />}
                            {usernameMessage && <p className="text-sm text-green-300 mt-1">{usernameMessage}</p>}
                            {errors.username && <p className="text-sm text-red-300 mt-1">{errors.username.message}</p>}
                        </div>

                        <div>
                            <input
                                {...register('email')}
                                placeholder="Email"
                                className="w-full px-4 py-4 rounded bg-white/10 text-white border border-white/20 placeholder-gray-300"
                            />
                            {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                {...register('password')}
                                placeholder="Password"
                                className="w-full px-4 py-4 rounded bg-white/10 text-white border border-white/20 placeholder-gray-300"
                            />
                            {errors.password && <p className="text-sm text-red-300 mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <input
                                {...register('college')}
                                placeholder="College"
                                className="w-full px-4 py-4 rounded bg-white/10 text-white border border-white/20 placeholder-gray-300"
                            />
                            {errors.college && <p className="text-sm text-red-300 mt-1">{errors.college.message}</p>}
                        </div>

                        <div>
                            <textarea
                                {...register('bio')}
                                placeholder="Bio (optional)"
                                rows={3}
                                className="w-full px-4 py-4 rounded bg-white/10 text-white border border-white/20 placeholder-gray-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                        >
                            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                {/* Right side - Skills */}
                <div className="w-full md:w-1/2 h-[800px] overflow-y-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                    <h3 className="text-white text-2xl font-semibold mb-6 text-center drop-shadow-sm tracking-wide">
                        Select Your Skills
                    </h3>
                    <ScrollArea className="h-full pr-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            {skillList.map((skill) => (
                                <SkillCard
                                    key={skill}
                                    skill={skill}
                                    selected={selectedSkills.includes(skill)}
                                    onClick={() => toggleSkill(skill)}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

export default page