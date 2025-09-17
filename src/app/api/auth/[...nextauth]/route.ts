import NextAuth, { CallbacksOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const authOptions = {
  callbacks: {
    signIn: async ({ profile }: { profile: { login: string } }) => {
      return profile.login === "bartekma89";
    },
  } as unknown as CallbacksOptions,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
