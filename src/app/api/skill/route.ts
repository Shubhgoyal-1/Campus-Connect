import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 404
            })
        }

        const user = await UserModel.findOne({
            username: session.user.username
        })
        if(!user){
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            skills: user.skills
        }, {
            status: 200
        })
    } catch (error) {

        console.error("Skill Management Error:", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })

    }
}

export async function POST(request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 404
            })
        }
        const { skills } = await request.json()

        if (!Array.isArray(skills) || skills.length === 0) {
            return Response.json({
                success: false,
                message: "Please enter at least one skill"
            }, {
                status: 400
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

        const newSkills = skills.filter((skill: string) => !user.skills.includes(skill))
        user.skills.push(...newSkills)
        await user.save();
        return Response.json({
            success: true,
            message: "Skills added successfully",
            skills: user.skills
        }, {
            status: 200
        })
    } catch (error) {

        console.error("Skill Management Error:", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })

    }
}

export async function DELETE(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 404
            })
        }

        const { skill } = await request.json()
        skill.trim();
        if (!skill || typeof (skill) !== 'string') {
            return Response.json({
                success: false,
                message: "Please enter a valid skill"
            }, {
                status: 400
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
        user.skills = user.skills.filter((s: string) => s !== skill)
        await user.save()
        return Response.json({
            success: true,
            message: "Skill removed successfully",
        }, {
            status: 200
        })

    } catch (error) {

        console.error("Skill Management Error:", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}