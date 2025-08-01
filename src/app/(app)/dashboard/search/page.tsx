'use client'
import Silk from '@/components/shared/Silk'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { searchUsernameSchema } from '@/schemas/searchUsername'
import axios from 'axios'
import { skillList } from '@/lib/SkillSet'
import SkillCard from '@/components/user/SkillCard'
import UserCard from '@/components/user/UserCard'
import { useDebounceCallback } from 'usehooks-ts'

const Page = () => {
    const collegelist = ["KIET", "DTU", "IIT Delhi", "IIT Bombay", "IIT Madras", "IIT Kanpur", "IIT Roorkee", "IIT Kharagpur", "IIT Guwahati", "test"];
    const [users, setUsers] = useState<any[]>([]);
    const [college, setCollege] = useState<string>("");
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    // const [input, setInput] = useState('')
    // const [suggestions, setSuggestions] = useState<string[]>([])
    // const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<z.infer<typeof searchUsernameSchema>>({
        resolver: zodResolver(searchUsernameSchema),
        defaultValues: {
            username: ''
        },
    })
    // const watchedUsername = watch("username");
    // const debouncedUsername = useDebounceCallback((val: string) => {
    //     fetchSuggestions(val);
    // }, 400);

    // useEffect(() => {
    //     if (watchedUsername) {
    //         debouncedUsername(watchedUsername);
    //     } else {
    //         setSuggestions([]);
    //     }
    // }, [watchedUsername]);
    // const fetchSuggestions = async (value: string) => {
    //     try {
    //         const res = await axios.get('/api/search-users', {
    //             params: { username: value }
    //         });

    //         if (res.data?.users) {
    //             const topMatches = res.data.users.map((u: any) => u.username).slice(0, 5);
    //             setSuggestions(topMatches);
    //         } else {
    //             setSuggestions([]);
    //         }
    //     } catch (err) {
    //         setSuggestions([]);
    //     }
    // };

    const onSubmit = async (data: z.infer<typeof searchUsernameSchema>) => {
        try {
            const res = await axios.get('/api/search-users', {
                params: { username: data.username },
            });
            setUsers(res.data.users);
        } catch (error) {
            console.error("Search failed:", error);
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            // Skip if username is being searched (handled by form)
            if (selectedSkill || college) {
                try {
                    const res = await axios.get("/api/search-users", {
                        params: {
                            ...(selectedSkill && { skill: selectedSkill }),
                            ...(college && { college }),
                        },
                    });
                    setUsers(res.data.users);
                } catch (err) {
                    console.error(err);
                    setUsers([]);
                }
            }
        };
        fetchUsers();
    }, [college, selectedSkill]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Silk Background */}
            <div className="fixed inset-0 -z-10">
                <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
            </div>
            {/* Main Search Section */}
            <div className="flex flex-col p-6">
                {/* Search Input */}
                <div className="w-full mb-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-3 items-center">
                            <input
                                type="text"
                                placeholder="Search users by username..."
                                {...register("username")}
                                className="w-[85%] p-4 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            {/* {suggestions.length > 0 && (
                                <ul className="bg-white text-black mt-2 rounded shadow-lg max-h-48 overflow-auto">
                                    {suggestions.map((s) => (
                                        <li
                                            key={s}
                                            className="p-2 cursor-pointer hover:bg-violet-800"
                                            onClick={() => {
                                                setValue("username", s); // set username in form
                                                setSuggestions([]);
                                                handleSubmit(onSubmit)(); // optional: trigger search immediately
                                            }}
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )} */}
                            {errors.username && (
                                <p className="text-red-500 mt-2">{errors.username.message}</p>
                            )}
                            <Button
                                type="submit"
                                className="w-45 h-14 rounded-lg text-lg bg-violet-600 hover:bg-violet-700 text-white"
                            >
                                Search
                            </Button>
                        </div>
                        <select
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="mt-4 p-3 rounded-lg bg-white/20 text-white focus:outline-none w-full"
                        >
                            <option className="text-black" value="">Select College (optional)</option>
                            {collegelist.map((col) => (
                                <option className="text-black rounded-lg" key={col} value={col}>
                                    {col}
                                </option>
                            ))}
                        </select>
                        <div>
                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {skillList.map((skill) => (
                                    <SkillCard
                                        key={skill}
                                        skill={skill}
                                        selected={selectedSkill === skill}
                                        onClick={async () => {
                                            const isSameSkill = selectedSkill === skill;
                                            const newSkill = isSameSkill ? null : skill;
                                            setSelectedSkill(newSkill);
                                            try {
                                                const res = await axios.get("/api/search-users", {
                                                    params: {
                                                        ...(newSkill && { skill: newSkill }),
                                                        ...(college && { college }),
                                                    }
                                                });
                                                setUsers(res.data.users);
                                            } catch (err) {
                                                console.error(err);
                                                setUsers([]);
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                        </div>

                    </form>
                </div>

                {/* Search Results (Placeholder) */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {users.length === 0 ? (
                        <p className="text-white text-center col-span-full">No users found</p>
                    ) : (
                        users.map((user) => (
                            <UserCard key={user.username} user={user} />
                        ))
                    )}
                </div>
            </div>
        </div >
    )
}

export default Page