import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 401
            })
        }
        const user = await UserModel.findOne({
            username: session.user.username
        }).select("-password -otp -otpExpiry");
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "User Found",
            profile: user
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Profile Management Error:", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })

    }
}
export async function PUT(request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 401
            })
        }
        const user = await UserModel.findOne({
            username: session.user.username
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 404
            })
        }
        /*profile will look like 
        profile : {
            bio: "abc",
            avatarurl: "abc",
            college: "abc",
        }
        */
        const updateData = await request.json()
        const updatedUser = await UserModel.findOneAndUpdate({
            username: session.user.username
        }, updateData, { new: true })
        return Response.json({
            success: true,
            message: "User Updated Successfully",
            profile: updatedUser
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Profile Management Error:", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })

    }
}