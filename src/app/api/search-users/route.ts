import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username')?.trim();
        const skill = searchParams.get("skill")?.trim();
        const college = searchParams.get("college")?.trim();
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        // console.log(skill)
        if (username) {
            const userMatches = await UserModel.find({
                username: { $regex: new RegExp("^" + username, "i") },
                isVerified: true,
            })
            .select("username")
            .limit(5);

            // If exact match found and only 1 match → treat as full search
            const exactUser = userMatches.find(user => user.username.toLowerCase() === username.toLowerCase());

            if (exactUser) {
                const fullUser = await UserModel.findOne({
                    username: exactUser.username,
                    isVerified: true,
                }).select("username email college bio skills profilePic");

                return Response.json({ success: true, users: [fullUser] }, { status: 200 });
            }

            // Else return suggestions
            return Response.json({
                success: true,
                suggestions: userMatches.map(u => u.username),
            }, { status: 200 });
        }


        const filter: any = {
            isVerified: true
        };
        // console.log(filter)
        if (skill) {
            filter.skills = skill
        }
        if (college) {
            filter.college = college
        }
        if (!skill && !college) {
            return Response.json(
                { success: false, message: "Please provide a username, skill, or college to search." },
                { status: 400 }
            );
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
            pagination: {
                totalUsers,
                totalPages,
                currentPage: page,
                perPage: limit
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