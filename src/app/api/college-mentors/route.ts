import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get("limit") || "10", 10)
        const skip = parseInt(searchParams.get("skip") || "0", 10)
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 401
            })
        }
        const user = await UserModel.findOne({ username: session.user.username })

        if (!user) {
            return Response.json({
                success: false,
                message: "user Not Found"
            }, {
                status: 404
            })
        }

        const connections = user.connections || []
        const mentors = await UserModel.find({
            college: user.college,
            canTeach: true,
            _id:{$nin: [...connections, user._id]}
        }).select("college skills username avatarUrl")
            .skip(skip)
            .limit(limit)

        return Response.json({
            success: true,
            message: "Mentors Found",
            mentors
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Mentor Management Error:", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }

}