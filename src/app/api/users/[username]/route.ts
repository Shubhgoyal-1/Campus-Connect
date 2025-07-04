import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET(request: Request, { params }: { params: { username: string } }) {
    await dbConnect()
    try {
        const username = params.username

        if (!username) {
            return Response.json({
                success: false,
                message: "Please enter a valid username"
            }, {
                status: 400
            })
        }

        const user = await UserModel.findOne({ username: username, isVerified: true }).select("username bio college skills profilePic connections incomingRequests outgoingRequests canTeach");
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
        console.log("Public Profile Error", error);
        return Response.json({
            success: false,
            message: "Something Went Wrong"
        }, {
            status: 500
        })
    }
}