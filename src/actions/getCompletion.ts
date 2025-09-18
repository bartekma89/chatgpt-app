"use server";

import OpenAI from "openai";

import { auth as getServerSession } from "@/auth";
import { Message } from "@/types";
import { createChat, updateChat } from "@/db";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getCompletion(
  id: number | null,
  messageHistory: Message[]
) {
  const response = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: messageHistory,
  });

  const messages = [
    ...messageHistory,
    response.choices[0].message,
  ] as Message[];

  const session = await getServerSession();

  let chatId = id;

  console.log("chat id", { chatId, id });

  if (!chatId) {
    chatId = await createChat(
      session?.user?.email!,
      messageHistory[0].content,
      messages
    );
  } else {
    await updateChat(chatId, messages);
  }

  return {
    messages,
    id: chatId,
  };
}
