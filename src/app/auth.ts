import NextAuth from "next-auth";
import { authProviderFactory } from "@/lib/auth/provider";

const nextAuth = NextAuth({
  providers: [authProviderFactory()],
  callbacks: {
    async session({ session, token }) {
      session.user.external = {
        id: token.externalId as string,
        provider: token.externalProvider as string,
      };
      session.user.id = token.sub as string;
      session.user.username = token.username as string | undefined;
      session.user.image = token.picture;
      return session;
    },
    async jwt({ token, user, profile, account }) {
      if (profile && account) {
        token.username = user.name;
        token.picture = user.image;
        token.externalId = profile.sub;
        token.externalProvider = account.provider;
        console.log(token);
      }
      return token;
    },
  },
});

/**
 * Returns the current session for Page components
 * @note This only enforce the type of the session object. Use this only when you're sure that the user is actually authenticated.
 * @returns Session
 */
export async function getSession() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Session is expected but not available");
  }

  return session;
}

export const { auth } = nextAuth;
export const { GET, POST } = nextAuth.handlers;
