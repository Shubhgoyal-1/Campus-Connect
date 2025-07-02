import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)

        const skill = searchParams.get("skill")?.trim();
        const college = searchParams.get("college")?.trim();
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        // console.log(skill)
        if (!skill) {
            return Response.json({
                success: false,
                message: "Please enter a valid skill"
            }, {
                status: 400
            })
        }
        const filter: any = {
            skills: skill,
            isVerified: true
        };
        // console.log(filter)
        if (college) {
            filter.college = college
        }
        const totalUsers = await UserModel.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / limit);
        const skip = (page - 1) * limit;
        // console.log(totalPages,totalUsers)

        const users = await UserModel.find(filter)
        .select("username email college bio skills profilePic")
        .skip(skip)
        .limit(limit);
        // console.log(users)

        if (!users || users.length === 0) {
            return Response.json({
                success: false,
                message: "No users found with this skill"
            }, {
                status: 404
            });
        }

        return Response.json({
            success: true,
            users,
            pagination:{
                totalUsers,
                totalPages,
                currentPage: page,
                perPage:limit
            }
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Search Error:", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        });
    }

}