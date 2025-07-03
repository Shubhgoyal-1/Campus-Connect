import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from 'zod';

const usernameQuerySchema = z.object({
    username: z
        .string()
        .min(2, "Username must be atleast 2 characters")
        .max(20, "Username must be atmost 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
})

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        // console.log(searchParams);
        const queryParam = {
            username: searchParams.get("username") || ""
        }
        const result = usernameQuerySchema.safeParse(queryParam)
        // console.log(result)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid username"
            }, {
                status: 400
            })
        }

        const username = result.data.username
        // console.log(username)
        const existingVerifiedUser = await UserModel.findOne({
            username: username,
            isVerified: true
        })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, {
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: "Username is available",
        }, {
            status: 200
        })

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        }
        )
    }
}