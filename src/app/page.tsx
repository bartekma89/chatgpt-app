import Chat from "@/components/chat";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { auth as getServerSession } from "@/auth";
import PreviousChats from "@/components/previous-chats";
import { Suspense } from "react";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="p-5">
      <h1 className="text-4xl font-bold">Welcome To GPT Chat</h1>
      {!session?.user?.email && <div>You need to log in to use this chat</div>}
      {session?.user?.email && (
        <>
          <Suspense fallback={<div>Loading the previous chats</div>}>
            <PreviousChats />
          </Suspense>
          <h4 className="mt-5 text-2xl font-bold">New Chat Session</h4>
          <Separator className="my-5" />
          <Chat />
        </>
      )}
    </main>
  );
}
