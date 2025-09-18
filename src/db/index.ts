import postgres from "postgres";

import type { Chat, ChatWithMesseges, Message, StoredMessage } from "@/types";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function createChat(
  userEmail: string,
  name: string,
  msgs: Message[]
): Promise<number> {
  const [chat] = await sql`
        INSERT INTO chats (user_email, name)
        VALUES (${userEmail}, ${name})
        RETURNING id
    `;

  console.log("createing chat", chat);

  const chatId = chat.id;

  for (const msg of msgs) {
    await sql`
            INSERT INTO messages (chat_id, role, content)
            VALUES (${chatId}, ${msg.role}, ${msg.content})
        `;
  }

  return chatId;
}

export async function getChat(
  chatId: number
): Promise<ChatWithMesseges | null> {
  const chats = await sql`
        SELECT * FROM chats WHERE chat_id = ${chatId}
    `;

  if (!chats[0]) {
    return null;
  }

  const messages = await sql`
        SELECT * FROM messages WHERE chat_id = ${chatId}
    `;

  return {
    ...chats[0],
    messages: messages.map((msg) => ({
      ...msg,
      role: msg.role as Message["role"],
      content: msg.content,
    })),
  } as ChatWithMesseges;
}

export async function getChats(userEmail: string) {
  const [chats] = await sql`
        SELECT * FROM chats WHERE user_email = ${userEmail}
    `;

  return chats as Chat[];
}

export async function getChatWithMessages(
  userEmail: string
): Promise<ChatWithMesseges[]> {
  const chats = await sql`
        SELECT * FROM chats WHERE user_email = ${userEmail} ORDER BY timestamp DESC LIMIT 3
    `;

  for (const chat of chats) {
    const messages = await sql`
            SELECT * FROM messages WHERE chat_id = ${chat.id}
        `;
    chat.messages = messages.map((msg) => ({
      ...msg,
      role: msg.role as Message["role"],
      contnent: msg.content,
    }));
  }

  return chats as unknown as ChatWithMesseges[];
}

export async function getMessages(chatId: number) {
  const messages = await sql`
        SELECT * FROM messages WHERE chat_id = ${chatId}
    `;

  return messages.map((msg) => ({
    ...msg,
    role: msg.role as Message["role"],
    content: msg.content,
  })) as Message[];
}

export async function updateChat(chatId: number, msgs: Message[]) {
  console.log("updating chat", chatId);

  await sql`
      DELETE FROM messages WHERE chat_id = ${chatId}
    `;

  for (const msg of msgs) {
    await sql`
            INSERT INTO messages (chat_id, role, content) VALUES (${chatId}, ${msg.role}, ${msg.content})
        `;
  }
}
