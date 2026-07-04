import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "birthday", "system"],
      default: "text",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    privateMode: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// TTL index: MongoDB automatically deletes private messages after expiresAt
MessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.Message || mongoose.model("Message", MessageSchema);