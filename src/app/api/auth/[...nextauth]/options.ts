import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

type CredentialsType = {
    identifier: string;
    password: string;
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text", placeholder: "email or username" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials: CredentialsType | undefined): Promise<any> {
                await dbConnect();
                if (!credentials) return null;

                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.identifier },
                        { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found");
                    }
                    if (!user.isVerified) {
                        throw new Error("User is not verified");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }

        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString()
                token.username = user.username
                token.email = user.email
                token.isVerified = user.isVerified
            }
            return token;
        },
        async session({session,token}){
            session.user._id = token._id
            session.user.username = token.username
            session.user.email = token.email
            session.user.isVerified = token.isVerified
            return session;
        }
    },
    pages:{
        signIn:"/sign-in"
    },
    session:{
        strategy:'jwt'
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET
}