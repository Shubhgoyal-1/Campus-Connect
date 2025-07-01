import mongoose , {Schema,Document} from 'mongoose';


export interface Message extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    timestamp: Date;
    read:boolean;
}

const MessageSchema: Schema<Message> = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false,
    },
});

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", MessageSchema);

export default MessageModel;