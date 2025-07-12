import { z } from 'zod';

export const editSkillSchema = z.object({
    skills: z.array(z.string().min(1)).max(20, "You can add up to 20 skills").optional()
})