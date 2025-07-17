'use client'
import React, { useEffect, useState } from 'react'
import Silk from '@/components/shared/Silk'
import { editProfileSchema } from '@/schemas/editProfileSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod';
import { toast } from 'sonner'
import axios from 'axios'
import Image from 'next/image'
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [skills, setSkills] = useState<string[]>([])
    const [username,setUsername] = useState<String>('')


    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<z.infer<typeof editProfileSchema>>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            bio: '',
            avatarUrl: '',
            canTeach: false,
        },
    })
    const onSubmit = async (data: z.infer<typeof editProfileSchema>) => {
        setLoading(true)
        console.log("Form data:", data)
        try {
            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);
                const res = await axios.post('/api/upload-avatar', formData);
                if (!res.data?.url) throw new Error("Cloudinary upload failed");
                data.avatarUrl = res.data.url;
            }
            await axios.put('/api/profile', data)
            toast.success("Profile updated successfully!");
            router.push(`/profile/${username}`)
            // toast.success(data.toString);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false)
        }
    }
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setAvatarFile(file);
        setCurrentAvatar(URL.createObjectURL(file));
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/profile')
                console.log("Fetched profile:", res.data)
                const user = res.data.profile
                setValue('bio', user.bio)
                setValue('avatarUrl', user.avatarUrl)
                setValue('canTeach', user.canTeach)
                setCurrentAvatar(user.avatarUrl)
                setUsername(user.username)
                if (user.skills) {
                    setSkills(user.skills)
                }
            } catch (error) {
                toast.error('Failed to load profile')
            }
        }
        fetchProfile()
    }, [setValue])

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-auto bg-gradient-to-br from-[#1a132f] to-[#3a235e]">
            <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />

            <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl px-10 py-12 space-y-10 border border-white/20">
                <h2 className="text-4xl font-bold text-white text-center leading-tight drop-shadow-md tracking-wide">
                    Edit Your Profile
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-white">
                    {/* Avatar Upload */}
                    <div className="space-y-3 text-white text-lg">
                        <label className="block font-semibold">Profile Picture</label>
                        {currentAvatar && (
                            <div className="w-40 h-40 mx-auto">
                                <Image
                                    src={currentAvatar}
                                    alt="Avatar"
                                    width={160}
                                    height={160}
                                    className="rounded-full border-4 border-white shadow-xl object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="w-full file:mr-3 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-base file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold">Bio</label>
                        <textarea
                            {...register('bio')}
                            className="w-full p-4 text-base rounded-lg border border-white/30 bg-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] shadow-inner"
                            placeholder="Tell something about yourself"
                        />
                        {errors.bio && <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>}
                    </div>

                    {skills.length >= 0 && (
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold">Your Skills</label>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-white/20 border border-white/30 rounded-full text-sm text-white"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Edit Skills Button aligned right */}
                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push(`/profile/${username}/edit/skills`)}
                                    className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-full text-sm hover:bg-purple-700 transition"
                                >
                                    Edit Skills
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Can Teach Switch */}
                    <div className="flex items-center justify-between pt-1">
                        <label className="text-lg font-semibold">Willing to teach others</label>
                        <div className="scale-125">
                            <Controller
                                control={control}
                                name="canTeach"
                                render={({ field: { value, onChange } }) => (
                                    <Switch checked={value} onCheckedChange={onChange} className={value ? "bg-green-500 data-[state=checked]:bg-green-500" : "bg-red-500 data-[state=unchecked]:bg-red-500"} />
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? <span className="animate-pulse">Saving...</span> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default page