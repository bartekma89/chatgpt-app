import Chat from "@/components/chat";
import { getChat } from "@/db";
import { notFound, redirect } from "next/navigation";

import { auth as getServerSession } from "@/auth";

export const dynamic = "force-dynamic";

export default async function ChatDetailsPage({
  params,
}: {
  params: Promise<{ chatid: string }>;
}) {
  const { chatid } = await params;

  const chat = await getChat(Number(chatid));

  if (!chat) {
    notFound();
  }

  const session = await getServerSession();
  if (!session || session.user?.email !== chat.user_email) {
    redirect("/");
  }

  return (
    <main className="pt-5">
      <Chat id={Number(chatid)} key={chatid} messages={chat?.messages} />
    </main>
  );
}
