import { auth as getServerSession } from "@/auth";

import ChatMenu from "@/components/chat-menu";

export default async function ChatMenuColumn() {
  const session = await getServerSession();
  const authenticated = !!session?.user?.email;

  return authenticated ? (
    <div className="md:w-1/3 md:min-w-1/3 pr-5 w-full text-nowrap">
      <ChatMenu />
    </div>
  ) : null;
}
