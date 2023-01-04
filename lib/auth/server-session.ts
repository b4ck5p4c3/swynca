import { unstable_getServerSession } from "next-auth";
import { session } from "./callbacks";

export async function getServerSession() {
  return unstable_getServerSession({
    callbacks: {
      session,
    },
  });
}
