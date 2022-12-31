import { CallbacksOptions, Session } from "next-auth";

const session: CallbacksOptions["session"] = async ({
  session,
  token,
  user,
}) => {
  console.log(session, user);
  session = {
    ...session,
    user: {
      id: token.sub,
      ...session.user,
    } as Session["user"] & { id: string },
  };
  return session;
};

export { session };
