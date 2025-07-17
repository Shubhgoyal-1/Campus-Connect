import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();
        //bio is optional
        //college should be taken from the given options
        const { username, email, password, college, bio ,skills } = body;

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified: true,
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, {
                status: 400
            })
        }
        const existingUserVerifiedByEmail = await UserModel.findOne({
            email: email,
            isVerified: true,
        })
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email already exists"
                }, {
                    status: 400
                })
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashPassword;
                existingUserVerifiedByEmail.otp = otp;
                existingUserVerifiedByEmail.otpExpiry = new Date(Date.now() + 60 * 60 * 1000);
                await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                college,
                bio,
                otp: otp,
                otpExpiry: expiryDate,
                isVerified: false,
                skills:skills,
            })
            await newUser.save();
        }

        //send Verification Email
        const emailResponse = await sendVerificationEmail(email, username, otp)

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
            message: "User Resgistered Successfully. Verification email sent"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Error in Signing up ", error)
        return Response.json({
            success: false,
            message: "Something Went Wrong in Signing up"
        },{
            status: 500
        });
    }
}