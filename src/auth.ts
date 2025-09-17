import NextAuth, { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const authOptions: NextAuthConfig = {
  callbacks: {
    signIn: async ({ profile }) => {
      return profile?.login === "bartekma89";
    },
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],

  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
