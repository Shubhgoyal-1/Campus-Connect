import mongoose, { Schema, Document } from 'mongoose';

export interface Conversation extends Document {
    participants: mongoose.Types.ObjectId[]; // user IDs
    conversationKey: string; // unique key for the conversation
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
        conversationKey: {
            type: String,
            unique: true,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// Prevent model overwrite in dev
const ConversationModel = (mongoose.models.Conversation as mongoose.Model<Conversation>) || mongoose.model<Conversation>('Conversation', ConversationSchema);

export default ConversationModel;
