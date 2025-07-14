'use client'
import Silk from '@/components/shared/Silk'
import { ScrollArea } from '@/components/ui/scroll-area'
import SkillCard from '@/components/user/SkillCard'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { skillList } from '@/lib/SkillSet'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

const Page = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {data:session} = useSession();


  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('/api/skill')
        setSelectedSkills(res.data.skills || [])
      } catch (error) {
        toast.error('Failed to load skills')
      }
    }
    fetchSkills()
  }, [])

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.patch('/api/skill', { skills: selectedSkills })
      toast.success('Skills updated successfully!')
      
      router.push(`/profile/${session?.user?.username}`)
    } catch {
      toast.error('Failed to update skills')
    } finally {
      setLoading(false)
    }
  }

  const filteredSkills = skillList.filter((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative min-h-screen w-full overflow-hidden px-4 py-10 flex justify-center items-center">
      <div className="fixed inset-0 -z-10">
        <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 space-y-6">
        <h3 className="text-white text-3xl font-bold text-center drop-shadow tracking-wide">
          Select Your Skills
        </h3>

        {/* 🔍 Search Bar */}
        <div className="w-full text-center">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Skill Grid */}
        <ScrollArea className="h-[500px] pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill}
                skill={skill}
                selected={selectedSkills.includes(skill)}
                onClick={() => toggleSkill(skill)}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Skills'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page
