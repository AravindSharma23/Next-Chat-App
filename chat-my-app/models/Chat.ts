import mongoose, { Schema, models } from "mongoose";

const ChatSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },

    isGroup: {
      type: Boolean,
      default: false,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    groupAvatar: {
      type: String,
      default: "",
    },

    locationSharingEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Chat || mongoose.model("Chat", ChatSchema);