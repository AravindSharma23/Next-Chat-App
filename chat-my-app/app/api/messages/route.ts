import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import Chat from "@/models/Chat";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const chatId = req.nextUrl.searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { message: "chatId is required" },
        { status: 400 }
      );
    }

    const messages = await Message.find({ chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch messages", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { chatId, sender, text, type, privateMode } = await req.json();

    if (!chatId || !sender || !text) {
      return NextResponse.json(
        { message: "chatId, sender and text are required" },
        { status: 400 }
      );
    }

    const expiresAt = privateMode
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : null;

    const message = await Message.create({
      chatId,
      sender,
      text,
      type: type || "text",
      privateMode: Boolean(privateMode),
      expiresAt,
      readBy: [sender],
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email avatar"
    );

    return NextResponse.json({
      message: "Message sent",
      data: populatedMessage,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send message", error },
      { status: 500 }
    );
  }
}