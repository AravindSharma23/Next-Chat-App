import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const chats = await Chat.find({
      members: userId,
    })
      .populate("members", "name email avatar isOnline lastSeen")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name email avatar",
        },
      })
      .sort({ updatedAt: -1 });

    return NextResponse.json({ chats });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch chats", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, isGroup, members, admins } = await req.json();

    if (!members || members.length < 2) {
      return NextResponse.json(
        { message: "At least 2 members are required" },
        { status: 400 }
      );
    }

    const chat = await Chat.create({
      name,
      isGroup,
      members,
      admins: admins || [],
    });

    const populatedChat = await Chat.findById(chat._id).populate(
      "members",
      "name email avatar isOnline lastSeen"
    );

    return NextResponse.json({
      message: "Chat created",
      chat: populatedChat,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create chat", error },
      { status: 500 }
    );
  }
}
