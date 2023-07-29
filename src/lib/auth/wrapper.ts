import { getServerSession as naGetServerSession } from "next-auth";
import { session } from "./callbacks";

export function getServerSession() {
  return naGetServerSession<
    {},
    {
      user: {
        id: string;
        name: string;
        email: string;
        image?: string;
      };
    }
  >({
    callbacks: {
      session,
    },
  });
}
