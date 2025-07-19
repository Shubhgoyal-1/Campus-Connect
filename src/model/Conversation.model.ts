import mongoose, { Schema, Document } from 'mongoose';

export interface Conversation extends Document {
    participants: mongoose.Types.ObjectId[]; // user IDs
    lastMessage?: string;
    updatedAt: Date;
}

const ConversationSchema: Schema<Conversation> = new Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastMessage: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model overwrite in dev
const ConversationModel = (mongoose.models.Conversation as mongoose.Model<Conversation>) || mongoose.model<Conversation>('Conversation', ConversationSchema);

export default ConversationModel;
