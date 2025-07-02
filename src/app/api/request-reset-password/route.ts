import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { success } from "zod/v4";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json()

        if (!email) {
            return Response.json({
                success: false,
                message: "Email is required"
            }, {
                status: 400
            })
        }
        const user = await UserModel.findOne({
            email,
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        //5 min expiry
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        const emailResponse = await sendVerificationEmail(email, user.username, otp)
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }
        return Response.json({
            success: true,
            message: "Otp sent successfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Error sending verification email:", error);
        return Response.json({
            success: false,
            message: "Failed to send verification email. Please try again later.",
        }, {
            status: 500
        })
    }
}