import {z} from 'zod';

export const signUpSchema = z.object({
    username: z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"Username must be atmost 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers and underscores"),
    email: z.string().email({message:"Please enter a valid email address"}),
    password: z.string().min(6,{message:"Password must be at least 6 characters"}),
    college: z.string(),
    skills: z.array(z.string()),
    bio: z.string().optional()
})