import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email, otp, password } = await request.json()
        if (!email || !otp || !password) {
            return Response.json({
                success: false,
                message: "Email, Otp and Password are required"
            }, {
                status: 400
            })
        }

        const user = await UserModel.findOne({ email }).select("+otp")
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        console.log(user)
        console.log(otp , user.otp)
        if (user.otp !== otp || (user.otpExpiry as Date) < new Date()) {
            return Response.json({
                success: false,
                message: "Invalid Otp"
            },{
                status:400
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword
        user.otp=undefined
        user.otpExpiry=undefined
        await user.save()

        return Response.json({
            success: true,
            message: "Password Reset Successfully"
        }, {
            status: 200
        })

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