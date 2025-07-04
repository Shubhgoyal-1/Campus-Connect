import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
export async function GET(request: Request) {
    await dbConnect();
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

        const user = await UserModel.findOne({ username: session.user.username })
            .populate("connections", "username email college bio avatarUrl skills")
            .populate("incomingRequests", "username email college bio avatarUrl skills")
            .populate("outgoingRequests", "username email college bio avatarUrl skills")

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
            connections: user.connections,
            incomingRequests: user.incomingRequests,
            outgoingRequests: user.outgoingRequests
        }, {
            status: 200
        })
    } catch (error) {
        console.log("Error in Getting Connections", error)
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}

export async function POST(request: Request) {
    await dbConnect();
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

        const { recieverUsername } = await request.json();
        const sender = await UserModel.findOne({ username: session.user.username })
        const reciever = await UserModel.findOne({ username: recieverUsername })
        console.log("reciever", reciever, "sender", sender)
        if (!reciever) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 404
            })
        }

        if (!sender) {
            return Response.json({
                success: false,
                message: "Sender Not Found"
            }, {
                status: 404
            })
        }
        if (sender.username === reciever.username) {
            return Response.json({
                success: false,
                message: "You cannot send a request to yourself"
            }, { status: 400 });
        }

        if (
            sender.connections.includes(reciever._id as mongoose.Types.ObjectId) ||
            sender.incomingRequests.includes(reciever._id as mongoose.Types.ObjectId) ||
            sender.outgoingRequests.includes(reciever._id as mongoose.Types.ObjectId)
        ) {
            return Response.json({
                success: false,
                message: "Connection is Pending or Already Exists"
            }, {
                status: 400
            })
        }

        sender.outgoingRequests.push(reciever._id as mongoose.Types.ObjectId)
        reciever.incomingRequests.push(sender._id as mongoose.Types.ObjectId)
        await sender.save()
        await reciever.save()

        return Response.json({
            success: true,
            message: "Connection Request Sent"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Error in Making Connections", error)
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}

export async function PUT(request: Request) {
    await dbConnect();
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

        const { requestSenderUsername } = await request.json();

        const acceptor = await UserModel.findOne({ username: session.user.username })
        const requestSender = await UserModel.findOne({ username: requestSenderUsername })

        if (!acceptor) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 404
            })
        }

        if (!requestSender) {
            return Response.json({
                success: false,
                message: "Sender Not Found"
            }, {
                status: 404
            })
        }

        acceptor.incomingRequests = acceptor.incomingRequests.filter((id) => !id.equals(requestSender._id as mongoose.Types.ObjectId))
        requestSender.outgoingRequests = requestSender.outgoingRequests.filter((id) => !id.equals(acceptor._id as mongoose.Types.ObjectId))

        acceptor.connections.push(requestSender._id as mongoose.Types.ObjectId)
        requestSender.connections.push(acceptor._id as mongoose.Types.ObjectId)

        await acceptor.save()
        await requestSender.save()

        return Response.json({
            success: true,
            message: "Connection Accepted"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Error in Accepting Connections", error)
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
                status: 401
            })
        }

        const { searchParams } = new URL(request.url);
        const targetUsername = searchParams.get("targetUsername");
        const type = searchParams.get("type");

        const user = await UserModel.findOne({ username: session.user.username })
        const target = await UserModel.findOne({ username: targetUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 404
            })
        }

        if (!target) {
            return Response.json({
                success: false,
                message: "Sender Not Found"
            }, {
                status: 404
            })
        }
        //removing your request that you send to someone else
        if (type === "cancel") {
            user.outgoingRequests = user.outgoingRequests.filter((id) => !id.equals(target._id as mongoose.Types.ObjectId))
            target.incomingRequests = target.incomingRequests.filter((id) => !id.equals(user._id as mongoose.Types.ObjectId))
        } else if (type === "reject") {
            user.incomingRequests = user.incomingRequests.filter((id) => !id.equals(target._id as mongoose.Types.ObjectId))
            target.outgoingRequests = target.outgoingRequests.filter((id) => !id.equals(user._id as mongoose.Types.ObjectId))
        } else if (type === "remove") {
            user.connections = user.connections.filter((id) => !id.equals(target._id as mongoose.Types.ObjectId))
            target.connections = target.connections.filter((id) => !id.equals(user._id as mongoose.Types.ObjectId))
        } else {
            return Response.json({
                success: false,
                message: "Invalid Type"
            }, {
                status: 400
            })
        }
        await user.save()
        await target.save()

        return Response.json({
            success: true,
            message: "Action Completed"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Error in Deleting Connections", error)
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }

}