import { z } from 'zod';

export const searchUsernameSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be atleast 2 characters")
        .max(20, "Username must be atmost 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
})