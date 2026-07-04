import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { summarizeMessages } from "@/lib/summarize";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { chatId, startDate, endDate } = await req.json();

    if (!chatId || !startDate || !endDate) {
      return NextResponse.json(
        { message: "chatId, startDate and endDate are required" },
        { status: 400 }
      );
    }

    const messages = await Message.find({
      chatId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((msg: any) => {
      return `${msg.sender?.name || "Unknown"}: ${msg.text}`;
    });

    const summary = summarizeMessages(formattedMessages);

    return NextResponse.json({
      count: messages.length,
      summary,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to summarize chat", error },
      { status: 500 }
    );
  }
}