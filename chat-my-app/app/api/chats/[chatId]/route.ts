import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    await connectDB();

    const chat = await Chat.findById(params.chatId).populate(
      "members",
      "name email avatar isOnline lastSeen"
    );

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch chat", error },
      { status: 500 }
    );
  }
}