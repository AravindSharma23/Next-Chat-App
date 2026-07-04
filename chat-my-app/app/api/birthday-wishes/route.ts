import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Chat from "@/models/Chat";
import Message from "@/models/Message";

export async function POST() {
  try {
    await connectDB();

    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();

    const users = await User.find();

    const birthdayUsers = users.filter((user: any) => {
      if (!user.birthday) return false;

      const birthday = new Date(user.birthday);

      return (
        birthday.getMonth() + 1 === todayMonth &&
        birthday.getDate() === todayDate
      );
    });

    const sentMessages = [];

    for (const birthdayUser of birthdayUsers) {
      const chats = await Chat.find({
        members: birthdayUser._id,
      });

      for (const chat of chats) {
        const wishText = `🎉 Happy Birthday ${birthdayUser.name}! Wishing you a fantastic year ahead! 🎂✨`;

        const message = await Message.create({
          chatId: chat._id,
          sender: birthdayUser._id,
          text: wishText,
          type: "birthday",
        });

        await Chat.findByIdAndUpdate(chat._id, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        sentMessages.push(message);
      }
    }

    return NextResponse.json({
      message: "Birthday wishes processed",
      birthdayUsers: birthdayUsers.length,
      sentMessages: sentMessages.length,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to process birthday wishes", error },
      { status: 500 }
    );
  }
}