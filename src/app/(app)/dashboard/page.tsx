'use client'

import Silk from '@/components/shared/Silk'
import Image from 'next/image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Autoplay from 'embla-carousel-autoplay'
import UserCard from '@/components/user/UserCard'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { skillList } from '@/lib/SkillSet'

interface Mentor {
    username: string
    skills: string[]
    avatarUrl?: string
    college: string
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const [skills, setSkills] = useState<string[]>([])
    const [mentors, setMentors] = useState<Mentor[]>([])
    const [collegeMentors, setCollegeMentors] = useState<Mentor[]>([])
    const [collegePage, setCollegePage] = useState(0)
    const [mentorPage, setMentorPage] = useState(0)

    const fetchMentors = async () => {
        try {
            const res = await axios.get(`/api/mentors?limit=5&skip=${mentorPage * 5}`)
            setMentors(prev => [...prev, ...res.data.mentors])
        } catch (error) {
            console.log("Error fetching mentors", error)
        }
    }
    console.log(mentors)

    const fetchCollegeMentors = async () => {
        try {
            const res = await axios.get(`/api/college-mentors?limit=5&skip=${mentorPage * 5}`)
            setCollegeMentors(prev => [...prev, ...res.data.mentors])
        } catch (error) {

            console.log("Error fetching college mentors", error)
        }
    }
    useEffect(() => {
        fetchMentors()
    }, [mentorPage])
    useEffect(() => {
        fetchCollegeMentors()
    }, [collegePage])


    useEffect(() => {
        const fetchSkills = async () => {
            if (session?.user?.email) {
                try {
                    const res = await axios.get(`/api/skill`)
                    setSkills(res.data.skills || [])
                } catch (error) {
                    console.error('Failed to fetch skills', error)
                }
            }
        }
        fetchSkills()
    }, [session])
    // console.log(session?.user?.username)
    // console.log(skills)


    // const suggestedSkills: string[] = skillList.filter((skill) => !skills.includes(skill));
    // const shuffledSkills = [...suggestedSkills].sort(() => Math.random() - 0.5);
    // const randomEight = shuffledSkills.slice(0, 8);
    const [randomEight, setRandomEight] = useState<string[]>([]);

    useEffect(() => {
        const suggested = skillList.filter(skill => !skills.includes(skill));
        const shuffled = [...suggested].sort(() => Math.random() - 0.5);
        setRandomEight(shuffled.slice(0, 8));
    }, [skills]);


    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Silk Background */}
            <div className="fixed inset-0 -z-10">
                <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
            </div>

            <div className="relative z-10 space-y-8 p-6 text-white">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded text-center font-medium border border-white/20">
                    <span>Your Skills</span>
                    <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-7xl mt-5"> {/* Increase max width for better spacing */}
                        <CarouselContent className="-ml-2">
                            {skills.map((skill, index) => (
                                <CarouselItem key={index} className="pl-2 md:basis-1/2 lg:basis-1/4">
                                    <Card className="h-16 w-full bg-white/10 border border-white/20 text-white">
                                        <CardContent className="flex items-center justify-center h-full">
                                            <span className="text-base font-medium">{skill}</span>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                </div>

                {/* Suggested Peers */}
                <section>
                    <h2 className="text-xl font-semibold mb-3">Suggested Peers</h2>
                    <ScrollArea className="w-full rounded-md no-scrollbar overflow-x-auto">
                        <div className="flex w-max space-x-4 p-4">
                            {mentors.map((user, i) => (
                                <UserCard
                                    key={i}
                                    user={{
                                        username: user.username,
                                        skills: user.skills,
                                        avatarUrl: user?.avatarUrl || "/Screenshot 2024-04-21 191535.png",
                                    }}
                                />
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="hidden" />
                    </ScrollArea>
                </section>



                {/* From Your College */}
                <section>
                    <h2 className="text-xl font-semibold mb-3">From Your College</h2>
                    <ScrollArea className="w-full rounded-md whitespace-nowrap">
                        <div className="flex w-max space-x-4 p-4">
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {collegeMentors.map((user, i) => (
                                    <UserCard key={i} user={{
                                        username: user.username,
                                        skills: user.skills,
                                        avatarUrl: user?.avatarUrl || "/Screenshot 2024-04-21 191535.png"
                                    }} />
                                ))}
                            </div>
                        </div>
                        <ScrollBar className='h-0' orientation="horizontal" />
                    </ScrollArea>
                </section>

                {/* Future Feature Placeholder */}
                <section>
                    <h2 className="text-xl font-semibold mt-6 text-center">Skills That You Might Be Interested In</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {randomEight.map((skill, i) => (
                            <div key={i} className="h-24 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-white font-semibold tex-xl">
                                {skill}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
