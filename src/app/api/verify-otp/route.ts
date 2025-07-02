import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, otp } = await request.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        const isCodeValid = user.otp === otp;
        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return Response.json({
                success: false,
                message: "Otp Expired"
            }, {
                status: 400
            })
        }
        if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Otp Invalid"
            }, {
                status: 400
            })
        } else {
            user.isVerified = true;
            user.otp = undefined
            user.otpExpiry = undefined
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully"
            }, {
                status: 200
            })
        }

    } catch (error) {
        console.log("Error Verifying User", error)
        return Response.json({
            success: false,
            message: "Error Verifying User"
        }, {
            status: 500
        })
    }
}