import { z } from 'zod';

export const editProfileSchema = z.object({
    bio: z.string().max(200, "Bio must be under 200 characters").optional(),
    avatarUrl: z.string().url("Invalid avatar URL").optional(),
    canTeach: z.boolean().optional(),
   })