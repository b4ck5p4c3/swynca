import { getSession } from "../auth";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div>
      <h1 className="text-6xl italic leading-[120%] font-bold">
        If only I could hug you,
        <br /> but I&apos;m just a text.
      </h1>
    </div>
  );
}
